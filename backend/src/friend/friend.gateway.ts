import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewRequestEmitBodyParams } from './params/emit-body-params';
import { Friend } from './entities/friend.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/friend',
})
export class FriendGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('socketConnected');
  }

  @SubscribeMessage('initConnection')
  initConnection(
    @MessageBody() user_id: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.user_id = user_id;
    client.join(String(client.data.user_id));
  }

  emitToRoom(id: number, message: string, arg: any) {
    this.server.to(String(id)).emit(message, arg);
  }

  emitToSelf(client: Socket, message: string, arg: any) {
    client.to(String(client.data.user_id)).emit(message, arg);
  }

  @SubscribeMessage('newRequest')
  newRequest(
    @MessageBody() newRequestBodyParams: NewRequestEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToRoom(
      newRequestBodyParams.incoming_request.outgoing_friend.id,
      'newRequest',
      newRequestBodyParams.incoming_request,
    );
    this.emitToSelf(
      client,
      'newRequest',
      newRequestBodyParams.outgoing_request,
    );
  }

  @SubscribeMessage('deleteRequest')
  deleteRequest(
    @MessageBody() request: Friend,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToRoom(
      request.incoming_friend.id,
      'deleteRequest',
      request.outgoing_friend,
    );
    this.emitToSelf(client, 'deleteRequest', request.outgoing_friend);
  }

  @SubscribeMessage('acceptRequest')
  acceptRequest(
    @MessageBody() request: Friend,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToRoom(
      request.incoming_friend.id,
      'acceptRequest',
      request.outgoing_friend,
    );
    this.emitToSelf(client, 'acceptRequest', request.outgoing_friend);
  }

  @SubscribeMessage('rejectRequest')
  rejectRequest(
    @MessageBody() request: Friend,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToRoom(
      request.incoming_friend.id,
      'rejectRequest',
      request.outgoing_friend,
    );
    this.emitToSelf(client, 'rejectRequest', request.outgoing_friend);
  }

  @SubscribeMessage('deleteFriend')
  deleteFriend(
    @MessageBody() request: Friend,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToRoom(
      request.incoming_friend.id,
      'deleteFriend',
      request.outgoing_friend,
    );
    this.emitToSelf(client, 'deleteFriend', request.outgoing_friend);
  }
}
