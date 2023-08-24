'use client';
import Phaser from 'phaser';
import { useEffect } from 'react';
import GameMainScene from './scenes/GameMainScene';
import GameReadyScene from './scenes/GameReadyScene';
import GameMatchFoundScene from './scenes/GameMatchFoundScene';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions } from '@/lib/stores/useGameStore';

export default function GameRender() {
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
        autoCenter: Phaser.Scale.Center.CENTER_VERTICALLY,
      },
      scene: [new GameMatchFoundScene()],
    };

    const gameSession = new Phaser.Game(config);

    return () => {
      gameSession.destroy(true, true);
    };
  }, []);

  return null;
}
