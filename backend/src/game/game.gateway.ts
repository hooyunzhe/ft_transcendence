import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RemoteSocket, Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { GameService } from './game.service';
import { User } from 'src/user/entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) { }

  async handleConnection(client: Socket) {
    client.emit('socketConnected');
  }

  @SubscribeMessage('initConnection')
  initConnection(
    @MessageBody() user_id: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.user_id = user_id;
  }

  @SubscribeMessage('matchmake')
  async setup(
    @MessageBody() game_mode: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.ready = false;
    client.data.room_id = game_mode;
    client.data.game_mode = game_mode;
    client.join(client.data.room_id);
    this.makingRoom(client.data.room_id);
  }

  async makingRoom(room_id: string) {
    const client_list = await this.fetchPlayer(room_id);

    if (client_list.length >= 2)
      this.matchMaking(client_list.splice(0, 2), room_id);
  }

  @SubscribeMessage('sendInvite')
  async inviteGame(
    @MessageBody() body: { user: User; opponent_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const opponent = await this.fetchPlayerwithUID(body.opponent_id);

    if (opponent) {
      client.data.ready = false;
      client.data.room_id = client.id;
      client.data.game_mode = 'CYBERPONG';
      client.join(client.data.room_id);
      opponent.emit('newInvite', {
        user: body.user,
        room_id: client.data.room_id,
      });
    }
  }

  @SubscribeMessage('cancelInvite')
  async cancelInvite(
    @MessageBody() body: { user: User; opponent_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const opponent = await this.fetchPlayerwithUID(body.opponent_id);

    if (opponent) {
      opponent.emit('cancelInvite', body.user);
    }
    this.leaveCurrentRoom(client);
  }

  @SubscribeMessage('acceptInvite')
  async acceptGame(
    @MessageBody() room_id: string,
    @ConnectedSocket() client: Socket,
  ) {
    const opponent = await this.fetchPlayerCount(room_id);

    if (opponent === 1) {
      client.data.ready = false;
      client.data.room_id = room_id;
      client.data.game_mode = 'CYBERPONG';
      client.join(room_id);
      this.makingRoom(client.data.room_id);
    }
  }

  @SubscribeMessage('rejectInvite')
  rejectGame(@MessageBody() body: { user: User; room_id: string }) {
    this.server.to(body.room_id).emit('rejectInvite', body.user);
  }

  @SubscribeMessage('getMatchPlayerIDs')
  async getMatchPlayerIDs(@ConnectedSocket() client: Socket) {
    const players = await this.fetchPlayer(client.data.room_id);

    if (players.length === 2) {
      client.emit('getMatchPlayerIDs', {
        player1: players[0].data.user_id,
        player2: players[1].data.user_id,
      });
    }
  }

  @SubscribeMessage('end')
  endGame(@ConnectedSocket() client: Socket) {
    this.leaveCurrentRoom(client);
    this.gameService.deleteGame(client.data.room_id);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@ConnectedSocket() client: Socket) {
    this.leaveCurrentRoom(client);
  }

  @SubscribeMessage('playerDisconnected')
  async disconnectGame(client: Socket) {
    if (client.data.player === 1 || client.data.player === 2) {
      this.server
        .to(client.data.room_id)
        .emit('playerDisconnected', client.data.user_id);
      this.gameService.deleteGame(client.data.room_id);
    }
    this.leaveCurrentRoom(client);
  }

  async handleDisconnect(client: Socket) {
    if (client.data.player === 1 || client.data.player === 2) {
      this.server
        .to(client.data.room_id)
        .emit('playerDisconnected', client.data.user_id);
      this.gameService.deleteGame(client.data.room_id);
    }
    this.leaveCurrentRoom(client);
  }

  async matchMaking(
    clients: RemoteSocket<DefaultEventsMap, any>[],
    room_id: string,
  ) {
    const uniquekey = clients[0].id + clients[1].id + Date.now();

    clients.forEach((client) => {
      client.data.room_id = uniquekey;
      client.leave(room_id);
      client.join(uniquekey);
      client.emit('matchFound', {
        player1: clients[0].data.user_id,
        player2: clients[1].data.user_id,
      });
    });
    clients[0].data.player = 1;
    clients[1].data.player = 2;
    this.gameService.createGame(
      {
        room_id: uniquekey,
        player1: clients[0].data.user_id,
        player2: clients[1].data.user_id,
      },
      this.socketHandler,
    );
  }

  @SubscribeMessage('ready')
  async startGame(
    @MessageBody() classes: number,
    @ConnectedSocket() client: Socket,
  ) {
    const players = await this.fetchPlayer(client.data.room_id);
    if (players.length != 2) return;
    client.data.ready = !client.data.ready;
    this.gameService.roomlist
      .get(client.data.room_id)
      .gameSetClass(
        client.data.player,
        client.data.game_mode === 'CYBERPONG' ? classes : 0,
      );
    if (players.every((player) => player.data.ready)) {
      players.forEach((player) =>
        player.emit('startGame', client.data.room_id),
      );
      this.gameService.roomlist.get(client.data.room_id).gameUpdate();
    }
  }

  @SubscribeMessage('Player')
  MovePaddle(
    @MessageBody() movement: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const gameClass = this.gameService.roomlist.get(client.data.room_id);
    if (client.data.player === 0 || !gameClass) return;
    if (movement === 'w')
      this.gameService.roomlist
        .get(client.data.room_id)
        .gameSetPaddlePosition(client.data.player, -1);
    if (movement === 's')
      this.gameService.roomlist
        .get(client.data.room_id)
        .gameSetPaddlePosition(client.data.player, 1);
    if (movement === ' ')
      this.gameService.roomlist
        .get(client.data.room_id)
        .gameStart(client.data.player);
    if (movement === 'e')
      this.gameService.roomlist
        .get(client.data.room_id)
        .gameActiveSkill(client.data.player);
  }

  @SubscribeMessage('spectator')
  async SpectateGame(
    @MessageBody() friend_id: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.player = 0;
    const friend = await this.fetchPlayerwithUID(friend_id);
    if (friend) {
      if (this.gameService.roomlist[friend.data.room_id])
        client.join(friend.data.room_id);
      else this.server.to(client.id).emit('error');
    } else this.server.to(client.id).emit('error');
  }

  @SubscribeMessage('load')
  SetLoaded(@MessageBody() loaded: boolean, @ConnectedSocket() client: Socket) {
    const gameClass = this.gameService.roomlist.get(client.data.room_id);

    if (gameClass) {
      gameClass.gameSetLoaded(client.data.player, loaded);
    }
  }

  async fetchPlayer(room_id: string) {
    if (room_id) {
      return this.server.in(room_id).fetchSockets();
    }
  }

  async fetchPlayerwithUID(user_id: string) {
    if (user_id) {
      const players = this.server.fetchSockets();
      return (await players).find((player) => player.data.user_id === user_id);
    }
  }

  async fetchPlayerCount(room_id: string) {
    if (room_id) {
      return (await this.fetchPlayer(room_id)).length;
    }
  }

  leaveCurrentRoom(client: Socket) {
    this.gameService.clearGame(client.data.room_id);
    client.leave(client.data.room_id);
    client.data.room_id = '';
    client.data.game_mode = '';
    client.data.player = 0;
    client.data.ready = false;
  }

  socketHandler = (room_id: string, message: string, data: any) => {
    this.server.to(room_id).emit(message, data);
  };
}
