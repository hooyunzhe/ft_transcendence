'use client';
import Ball from './ball';
import React, { useState, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';



const Pong = () => {
  const [started, setStarted] = useState(false);
  const GameSocket = io('http://localhost:4242/gateway/game');
  const startGame = () => {
    GameSocket.emit("game");
  };
  return (
    <div style={{ overflow: 'hidden' }}>
    <button onClick={startGame}>Start Game</button>
      <Ball />
    </div>
  );
};



export default Pong;
