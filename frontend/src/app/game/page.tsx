'use client';

import startGame from '@/components/game';
import { useEffect } from 'react';
import Pong from '../../components/pong';
export default function Game() {
  useEffect(() => {
    startGame(), [window.innerWidth];
  });
  return <div></div>;
}
