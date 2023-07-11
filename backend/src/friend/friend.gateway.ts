import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Friend } from './entities/friend.entity';
import { FriendEmitBodyParams } from './params/emit-body-params';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/friends',
})
export class FriendGateway {
  @WebSocketServer()
  server: Server;

  getIDs(friendship: Friend): string[] {
    return [
      String(friendship.outgoing_friend.id),
      String(friendship.incoming_friend.id),
    ];
  }

  @SubscribeMessage('newRequest')
  newRequest(@MessageBody() newRequestBodyParams: FriendEmitBodyParams) {
    this.server
      .to(this.getIDs(newRequestBodyParams.friendship))
      .emit('newRequest', newRequestBodyParams.friendship);
  }

  @SubscribeMessage('deleteRequest')
  deleteRequest(@MessageBody() deleteRequestBodyParams: FriendEmitBodyParams) {
    this.server
      .to(this.getIDs(deleteRequestBodyParams.friendship))
      .emit(
        'deleteRequest',
        deleteRequestBodyParams.friendship.outgoing_friend,
      );
  }

  @SubscribeMessage('acceptRequest')
  acceptRequest(@MessageBody() acceptRequestBodyParams: FriendEmitBodyParams) {
    this.server
      .to(this.getIDs(acceptRequestBodyParams.friendship))
      .emit(
        'acceptRequest',
        acceptRequestBodyParams.friendship.outgoing_friend,
      );
  }

  @SubscribeMessage('rejectRequest')
  rejectRequest(@MessageBody() rejectRequestBodyParams: FriendEmitBodyParams) {
    this.server
      .to(this.getIDs(rejectRequestBodyParams.friendship))
      .emit(
        'rejectRequest',
        rejectRequestBodyParams.friendship.outgoing_friend,
      );
  }
}
