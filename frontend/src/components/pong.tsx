'use client';
import Ball from './ball';
import React, { useState, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';

const Pong = () => {

  return (
    <div style={{ overflow: 'hidden' }}>
      <Ball />
    </div>
  );
};

export default Pong;
