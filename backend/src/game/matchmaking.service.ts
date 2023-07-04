import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class MatchmakingService {
  client_list: Socket[];
  constructor() {};

  handleMatchMaking(clients: Socket[]) {
    const uniquekey = clients[0].id;
    clients.forEach((client) => {
      client.emit('match', uniquekey);
    });
  }

}
