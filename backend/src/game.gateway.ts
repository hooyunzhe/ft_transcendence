import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway()
export class GameGateway {
	@WebSocketServer()
	server;

	@SubscribeMessage('game')
	handleGame(@MessageBody() game: string): void {
		this.server.emit('game')
		console.log(game);
	}
}