'use client';
import Ball from './ball';
import React, { useState, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import Gameload from './game';

const Pong = () => {
  const [started, setStarted] = useState(false);
  const GameSocket = io('http://localhost:4242/gateway/game');
  const startGame = () => {
    GameSocket.emit('GameStart');
  };
  return (
    <div style={{ overflow: 'hidden' }}>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default Pong;
