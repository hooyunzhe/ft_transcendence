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
import { GameClass } from './game.class';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  private roomlist = new Map<string, GameClass>();

  async handleConnection(client: Socket) {
    client.data.roomid ??= '';
  }

  @SubscribeMessage('init')
  async setup(
    @MessageBody() user_id: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.user_id ??= user_id;
    client.data.ready = false;
    client.join(client.data.roomid);
    console.log('user id:', client.data.user_id);
    const client_list = await this.fetchPlayer('');
    if (client_list.length >= 2) this.matchMaking(client_list.splice(0, 2));
  }
  async handleDisconnect(client: Socket) {
    if (client.data.player === 0) return;
    this.server.to(client.data.roomid).emit('disc');
    this.roomlist.delete(client.data.roomid);
  }

  async matchMaking(clients: RemoteSocket<DefaultEventsMap, any>[]) {
    const uniquekey = clients[0].id + clients[1].id;
    clients.forEach((client) => {
      client.data.roomid = uniquekey;
      client.leave('');
      client.join(uniquekey);
      client.emit('match', {
        player1: clients[0].data.user_id,
        player2: clients[1].data.user_id,
      });
    });
    console.log(
      'client found a match, joining room:',
      clients[0].rooms + clients[1].id,
    );
    clients[0].data.player = 1;
    clients[1].data.player = 2;
    console.log('event: createroom: ', uniquekey);
    this.roomlist.set(
      uniquekey,
      this.gameService.createGame(
        {
          roomid: uniquekey,
          player1: clients[0].data.user_id,
          player2: clients[1].data.user_id,
        },
        this.socketHandler,
      ),
    );
    console.log('room size : ', this.roomlist.size);
  }

  @SubscribeMessage('ready')
  async start(@ConnectedSocket() client: Socket) {
    const players = await this.fetchPlayer(client.data.roomid);
    if (players.length != 2) return;
    client.data.ready = !client.data.ready;
    console.log(
      'client uid: ',
      client.data.user_id,
      'ready for the match: ',
      client.data.ready,
    );
    if (players.every((player) => player.data.ready)) {
      players.forEach((player) => player.emit('start', client.data.roomid));
      console.log('Game is starting in room :', client.data.roomid);
      this.roomlist.get(client.data.roomid).gameUpdate();
    }
  }

  @SubscribeMessage('join')
  async createRoom(@ConnectedSocket() client: Socket) {
    if (client.data.roomid != '') {
      client.join(client.data.roomid);
      console.log(
        'user id: ',
        client.data.user_id,
        'get assigned with room: ',
        client.data.roomid,
      );
    }

    const player_in_room = await this.fetchPlayer(client.data.roomid);
    console.log(
      'player in thisroom: ',
      client.data.roomid,
      ': ',
      player_in_room.length,
    );
    if (player_in_room.length === 2) {
      player_in_room[0].data.player = 1;
      player_in_room[1].data.player = 2;
      console.log('event: createroom: ', client.data.roomid);
      this.roomlist.set(
        client.data.roomid,
        this.gameService.createGame(client.data.roomid, this.socketHandler),
      );
      console.log('room size : ', this.roomlist.size);
    }
  }

  // @SubscribeMessage('check')
  // async checkGameStatus() {
  //   const players = await this.server.fetchSockets();
  //   console.log('game server totalconnection:', players.length);
  // }

  // @SubscribeMessage('reset')
  // reset(@ConnectedSocket() client: Socket) {
  //   this.roomlist.get(client.data.roomid).gameReset();
  // }

  @SubscribeMessage('Player')
  MovePaddle(
    @MessageBody() movement: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (client.data.player === 0) return;
    if (movement === 'w')
      this.roomlist
        .get(client.data.roomid)
        .gameSetPaddlePosition(client.data.player, -1);
    if (movement === 's')
      this.roomlist
        .get(client.data.roomid)
        .gameSetPaddlePosition(client.data.player, 1);
    if (movement === ' ')
      this.roomlist.get(client.data.roomid).gameStart(client.data.player);
  }

  @SubscribeMessage('spectator')
  async SpectateGame(
    @MessageBody() friend_id: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.player = 0;
    const friend = await this.fetchPlayerwithUID(friend_id);
    if (friend) {
      if (this.roomlist[friend.data.roomid]) client.join(friend.data.roomid);
      else this.server.to(client.id).emit('error');
    } else this.server.to(client.id).emit('error');
  }

  @SubscribeMessage('load')
  SetLoaded(@MessageBody() loaded: boolean, @ConnectedSocket() client: Socket) {
    this.roomlist
      .get(client.data.roomid)
      .gameSetLoaded(client.data.player, loaded);
  }
  async fetchPlayer(roomid: string) {
    return this.server.in(roomid).fetchSockets();
  }

  async fetchPlayerwithUID(user_id: string) {
    const players = this.server.fetchSockets();
    return (await players).find((player) => player.data.user_id === user_id);
  }
  async fetchPlayerCount(roomid: string) {
    return (await this.fetchPlayer(roomid)).length;
  }

  socketHandler = (roomid: string, message: string, data: any) => {
    this.server.to(roomid).emit(message, data);
  };
}
