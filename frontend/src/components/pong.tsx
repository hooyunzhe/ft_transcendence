'use client';
import Ball from './ball';
import React, { useState, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';

const Pong = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  return (
    <div style={{ overflow: 'hidden' }}>
      <Ball />
    </div>
  );
};

export default Pong;
