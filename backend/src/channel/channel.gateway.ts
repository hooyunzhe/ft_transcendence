import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChannelMember } from "src/channel-member/entities/channel-member.entity";
import { ChangeChannelNameEmitBodyParams, ChangeChannelTypeEmitBodyParams, JoinRoomEmitBodyParams } from "./params/emit-body-params";
import { Channel } from "./entities/channel.entity";
import { Message } from "src/message/entities/message.entity";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/channel',
})
export class ChannelMemberGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('socketConnected');
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data : JoinRoomEmitBodyParams, @ConnectedSocket() client: Socket) {
    client.join(String(data.id));
  }

  @SubscribeMessage('newChannel')
  newChannel(@MessageBody() data: Channel, @ConnectedSocket() client: Socket) {
    client.to([String(data.id), String(data.id)]).emit('newChannel', data)  
  }

  @SubscribeMessage('changeChannelName')
  changeChannelName(@MessageBody() data: ChangeChannelNameEmitBodyParams, @ConnectedSocket() client: Socket) {
    client.to([String(data.id), String(data.id)]).emit('changeChangeName', data);
  }

  @SubscribeMessage('changeChannelType')
  changeChannelType(@MessageBody() data: ChangeChannelTypeEmitBodyParams, @ConnectedSocket() client: Socket) {
    client.to([String(data.id), String(data.id)]).emit('changeChangeType', data);

  }

  @SubscribeMessage('deleteChannel')
  deleteChannel(@MessageBody() data: Channel, @ConnectedSocket() client: Socket) {
    client.leave(String(data.id));
    client.to([String(data.id), String(data.id)]).emit('deleteChannel', data);
  }

  @SubscribeMessage('newMember')
  newMember(@MessageBody() data: ChannelMember,
  @ConnectedSocket() client: Socket){

    client.to([String(data.channel.id), String(data.user.id)]).emit('newMember', data);
  }

  @SubscribeMessage('changeMemberRole')
  changeMemberRole(@MessageBody() data: ChannelMember,
  @ConnectedSocket() client: Socket){
    client.to(String(data.channel.id)).emit('changeMemberRole', data);
  }
  
  @SubscribeMessage('changeMemberStatus')
  changeMemberStatus(@MessageBody() data: ChannelMember,
  @ConnectedSocket() client: Socket){
    client.to(String(data.channel.id)).emit('changeMemberStatus', data);
  }

  @SubscribeMessage('kickMember')
  kickMember(@MessageBody() data: ChannelMember,
  @ConnectedSocket() client: Socket){
    client.leave(String(data.channel.id))
    client.to(String(data.channel.id)).emit('kickMember', data);
  }

  @SubscribeMessage('newMessage')
  newMessage(@MessageBody() data: Message, @ConnectedSocket() client : Socket){
    client.to(String(data.user.id)).emit('newMessage', data);
  }

  // editMessage (maybe?)
  // deleteMessage (maybe?)

}