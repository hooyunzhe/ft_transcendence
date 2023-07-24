import { Socket } from "socket.io-client";

export default function emitToSocket(socket: Socket | null, message: string, data: any) {
  if (socket) {
    if (socket.connected) {
      socket.emit(message, data);
    } else {
      console.log('Failed to emit as socket is disconnected');
    }
  } else {
    console.log('Failed to emit as socket is not initialized');
  }
}