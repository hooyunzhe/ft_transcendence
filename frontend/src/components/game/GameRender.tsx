'use client';
import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import GameMainScene from './scenes/GameMainScene';
import GameReadyScene from './scenes/GameReadyScene';
import GameMatchFoundScene from './scenes/GameMatchFoundScene';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions } from '@/lib/stores/useGameStore';

export default function GameRender() {
  const gameSocket = useGameSocket();
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
      },
      parent: "maingame",

      scene: [new GameMatchFoundScene(), new GameMainScene(gameSocket)],
    };

    const gameSession = new Phaser.Game(config);

    return () => {
      gameSession.destroy(true, true);
    };
  }, [gameSocket]);
  return (
    <div id="maingame"
    style={{

   
    }}
  >
      {/* The Phaser canvas will be automatically added here */}
    </div>
  );
};