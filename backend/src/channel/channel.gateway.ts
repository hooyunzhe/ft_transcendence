import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Channel } from './entities/channel.entity';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { Message } from 'src/message/entities/message.entity';
import {
  ChangeChannelMemberRoleEmitBodyParams,
  ChangeChannelMemberStatusEmitBodyParams,
  ChangeChannelNameEmitBodyParams,
  ChangeChannelTypeEmitBodyParams,
  EditMessageEmitBodyParams,
} from './params/emit-body-params';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/channel',
})
export class ChannelGateway implements OnGatewayConnection {
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
    client.join(`user_${client.data.user_id}`);
  }

  emitToChannel(client: Socket, channelID: number, message: string, arg: any) {
    client.to(`channel_${channelID}`).emit(message, arg);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data: number, @ConnectedSocket() client: Socket) {
    client.join(`channel_${data}`);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() data: number, @ConnectedSocket() client: Socket) {
    client.leave(`channel_${data}`);
  }

  @SubscribeMessage('newChannel')
  newChannel(@MessageBody() data: Channel, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('newChannel', data);
  }

  @SubscribeMessage('changeChannelName')
  changeChannelName(
    @MessageBody() data: ChangeChannelNameEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToChannel(client, data.id, 'changeChannelName', data);
  }

  @SubscribeMessage('changeChannelType')
  changeChannelType(
    @MessageBody() data: ChangeChannelTypeEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToChannel(client, data.id, 'changeChannelType', data);
  }

  @SubscribeMessage('deleteChannel')
  deleteChannel(
    @MessageBody() data: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('deleteChannel', data);
    client.leave(`channel_${data}`);
  }

  @SubscribeMessage('newMember')
  newMember(
    @MessageBody() data: ChannelMember,
    @ConnectedSocket() client: Socket,
  ) {
    client
      .to([`channel_${data.channel.id}`, `user_${data.user.id}`])
      .emit('newMember', data);
  }

  @SubscribeMessage('changeRole')
  changeMemberRole(
    @MessageBody() data: ChangeChannelMemberRoleEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToChannel(client, data.channelID, 'changeRole', data);
  }

  @SubscribeMessage('changeStatus')
  changeMemberStatus(
    @MessageBody() data: ChangeChannelMemberStatusEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToChannel(client, data.channelID, 'changeStatus', data);
  }

  @SubscribeMessage('kickMember')
  kickMember(
    @MessageBody() data: ChannelMember,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToChannel(client, data.channel.id, 'kickMember', data);
  }

  @SubscribeMessage('newMessage')
  newMessage(@MessageBody() data: Message, @ConnectedSocket() client: Socket) {
    this.emitToChannel(client, data.channel.id, 'newMessage', data);
  }

  @SubscribeMessage('editMessage')
  editMessage(
    @MessageBody() data: EditMessageEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToChannel(client, data.channelID, 'editMessage', data);
  }

  @SubscribeMessage('deleteMessage')
  deleteMessage(
    @MessageBody() data: Message,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(String(data.channel.id)).emit('deleteMessage', data);
    this.emitToChannel(client, data.channel.id, 'deleteMessage', data);
  }

  @SubscribeMessage('startTyping')
  startTyping(
    @MessageBody() data: ChannelMember,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToChannel(client, data.channel.id, 'startTyping', data);
  }

  @SubscribeMessage('stopTyping')
  stopTyping(
    @MessageBody() data: ChannelMember,
    @ConnectedSocket() client: Socket,
  ) {
    this.emitToChannel(client, data.channel.id, 'stopTyping', data);
  }
}
