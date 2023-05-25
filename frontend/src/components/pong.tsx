'use client';
import Ball from './ball';
import React, { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';

interface Ball {
  x: number;
  y: number;
}

const Pong = () => {
  const [ball, setBall] = useState<Ball>({ x: 50, y: 50 });
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 1, y: -1 });
  const [socket, setSocket] = useState<Socket | null>(null);

  const updateBallPosition = (prevBall: Ball) => {
    const { x, y } = prevBall;
    const newBall = {
      x: x + dir.x,
      y: y + dir.y,
    };

    setBall(newBall);
    if (socket) {
      socket.emit('ballPositionUpdate', newBall);
    }
  };

  useEffect(() => {

    const socket = io('http://localhost:8000');
    setSocket(socket);
    socket.on('ballPositionUpdate', (updatedBall: Ball) => {
    
      setBall(updatedBall);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateBallPosition(ball);
    }, 50);

    return () => {
      clearInterval(timer); 
    };
  }, [ball]);

  return (
    <div style={{ overflow: 'hidden' }}>
      <Ball x={ball.x} y={ball.y} />
    </div>
  );
};

export default Pong;