import { gameSocket } from '@/lib/socket';
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Container, createRoot, Sprite, Stage, Text } from '@pixi/react';

interface RenderProps {
  gameSocket: Socket;
}

export default function Render() {
  return (
    <Stage>
      <Container>
        {/* Add your Pixi.js display objects here */}
        <Sprite image='./cyberpong.png' />
      </Container>
    </Stage>
  );
}
