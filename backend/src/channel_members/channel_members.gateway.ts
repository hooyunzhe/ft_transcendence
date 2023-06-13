// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { ChannelMembersService } from './channel_members.service';
// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
//   namespace: 'gateway/messages',
// })
// export class MessagesGateway implements OnGatewayConnection {
//   @WebSocketServer()
//   server: Server;

//   constructor(private readonly messagesService: ChannelMembersService) {}

//   handleConnection(@ConnectedSocket() client: Socket) {
//     client.join('temp_channel_id');
//   }

//   @SubscribeMessage('join')
//   joinRoom(@MessageBody('id') name: string, @ConnectedSocket() client: Socket) {
//     return this.channelMembersService.identify(name, client.id);
//   }

//   @SubscribeMessage('test')
//   test(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
//     this.server.to(client.id).emit('Yes', 'printing data');
//     return data;
//   }

//   @SubscribeMessage('newMessage')
//   sendMessage(
//     @MessageBody() data: Message,
//     @ConnectedSocket() client: Socket,
//   ): string {
//     console.log('Received Sent message from client!');
//     console.log(`You are sending to ${client.id}`);
//     this.server.to('temp_channel_id').emit('newMessage', data);
//     return 'message received';
//   }
// }
