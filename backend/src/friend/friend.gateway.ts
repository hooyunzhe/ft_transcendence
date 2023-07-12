import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  FriendEmitBodyParams,
  InitConnectionEmitBodyParams,
  NewRequestEmitBodyParams,
} from './params/emit-body-params';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/friends',
})
export class FriendGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('socketConnected');
  }

  @SubscribeMessage('initConnection')
  initConnection(
    @MessageBody() initConnectionBodyParams: InitConnectionEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.user_id = initConnectionBodyParams.user_id;
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
    @MessageBody() deleteRequestBodyParams: FriendEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToRoom(
      deleteRequestBodyParams.friendship.incoming_friend.id,
      'deleteRequest',
      deleteRequestBodyParams.friendship.outgoing_friend,
    );
    this.emitToSelf(
      client,
      'deleteRequest',
      deleteRequestBodyParams.friendship.outgoing_friend,
    );
  }

  @SubscribeMessage('acceptRequest')
  acceptRequest(
    @MessageBody() acceptRequestBodyParams: FriendEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToRoom(
      acceptRequestBodyParams.friendship.incoming_friend.id,
      'acceptRequest',
      acceptRequestBodyParams.friendship.outgoing_friend,
    );
    this.emitToSelf(
      client,
      'acceptRequest',
      acceptRequestBodyParams.friendship.outgoing_friend,
    );
  }

  @SubscribeMessage('rejectRequest')
  rejectRequest(
    @MessageBody() rejectRequestBodyParams: FriendEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToRoom(
      rejectRequestBodyParams.friendship.incoming_friend.id,
      'rejectRequest',
      rejectRequestBodyParams.friendship.outgoing_friend,
    );
    this.emitToSelf(
      client,
      'rejectRequest',
      rejectRequestBodyParams.friendship.outgoing_friend,
    );
  }
}
