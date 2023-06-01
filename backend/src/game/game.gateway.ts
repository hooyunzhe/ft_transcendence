import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Interval } from '@nestjs/schedule';
import { Server } from 'http';
import { GameService } from './game.service';
import { start } from 'repl';

interface Coor {
  x: number;
  y: number;
}
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/game',
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  private id;
  game =  new GameService();
  @SubscribeMessage('initialize')
  Init(){
  this.id = setInterval(()=>{
    this.game.gameUpdate(this.server);
  });
}

  @SubscribeMessage('Start')
  start(){
    this.game.gameStart();
  }

  @SubscribeMessage('Reset')
  reset(){
    this.game.gameReset();
  }
  
  @SubscribeMessage('Stop')
  Stop(){
    clearInterval(this.id);
  }
}
