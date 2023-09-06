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
    client.join(String(client.data.user_id));
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data: number, @ConnectedSocket() client: Socket) {
    client.join(String(data));
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() data: number, @ConnectedSocket() client: Socket) {
    client.leave(String(data));
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
    client.to(String(data.id)).emit('changeChannelName', data);
  }

  @SubscribeMessage('changeChannelType')
  changeChannelType(
    @MessageBody() data: ChangeChannelTypeEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(String(data.id)).emit('changeChannelType', data);
  }

  @SubscribeMessage('deleteChannel')
  deleteChannel(
    @MessageBody() data: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('deleteChannel', data);
    client.leave(String(data));
  }

  @SubscribeMessage('newMember')
  newMember(
    @MessageBody() data: ChannelMember,
    @ConnectedSocket() client: Socket,
  ) {
    client
      .to([String(data.channel.id), String(data.user.id)])
      .emit('newMember', data);
  }

  @SubscribeMessage('changeRole')
  changeMemberRole(
    @MessageBody() data: ChangeChannelMemberRoleEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(String(data.channelID)).emit('changeRole', data);
  }

  @SubscribeMessage('changeStatus')
  changeMemberStatus(
    @MessageBody() data: ChangeChannelMemberStatusEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(String(data.channelID)).emit('changeStatus', data);
  }

  @SubscribeMessage('kickMember')
  kickMember(
    @MessageBody() data: ChannelMember,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(String(data.channel.id)).emit('kickMember', data);
  }

  @SubscribeMessage('newMessage')
  newMessage(@MessageBody() data: Message, @ConnectedSocket() client: Socket) {
    client.to(String(data.channel.id)).emit('newMessage', data);
  }

  @SubscribeMessage('editMessage')
  editMessage(
    @MessageBody() data: EditMessageEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(String(data.channelID)).emit('editMessage', data);
  }

  @SubscribeMessage('deleteMessage')
  deleteMessage(
    @MessageBody() data: Message,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(String(data.channel.id)).emit('deleteMessage', data);
  }

  @SubscribeMessage('startTyping')
  startTyping(
    @MessageBody() data: ChannelMember,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(String(data.channel.id)).emit('startTyping', data);
  }

  @SubscribeMessage('stopTyping')
  stopTyping(
    @MessageBody() data: ChannelMember,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(String(data.channel.id)).emit('stopTyping', data);
  }
}
