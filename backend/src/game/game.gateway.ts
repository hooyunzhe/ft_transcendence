import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Interval } from '@nestjs/schedule';
import { Server } from 'http';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/game',
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  
  
    constructor(private game: GameService) {};
  
    afterInit() {
      setInterval(() => {
        this.game.UpdateEvent(this.server);
      }, 50)
    }
}
