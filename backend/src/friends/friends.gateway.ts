import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class FriendsGateway {
  @SubscribeMessage('connection')
  handleConnection(): string {
    return 'client connected!';
  }

  @SubscribeMessage('test')
  test(): string {
    return 'works!';
  }
}
