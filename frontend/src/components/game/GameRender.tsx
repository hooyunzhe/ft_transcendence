'use client';
import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import GameMainScene from './scenes/GameMainScene';
import GameMatchFoundScene from './scenes/GameMatchFoundScene';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions } from '@/lib/stores/useGameStore';

export default function GameRender() {
  const gameSocket = useGameSocket();
  const gameAction = useGameActions();
 

  const   keyLoop = () => {
    if (gameAction.getKeyState('w')) {
      if (gameSocket)
      gameSocket.emit('Player', 'w');
    }
    if (gameAction.getKeyState('s')) {
      if (gameSocket)
      gameSocket.emit('Player', 's');
    }
  };
  useEffect(() => {
    const game = new GameMainScene(gameSocket, keyLoop);
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.AUTO,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    //     width: '100%',
    // height: '100%',
      },
      parent: "maingame",

      scene: [game],
    };


  
    window.addEventListener('keyup', setKeyStateFalse, true);
    window.addEventListener('keydown', setKeyStateTrue, true);

    const gameSession = new Phaser.Game(config);

    return () => {
      gameSession.destroy(true, true);
      gameSocket?.disconnect();
      window.removeEventListener('keyup', setKeyStateFalse, true);
      window.removeEventListener('keydown', setKeyStateTrue, true);
    };
  }, []);

  function setKeyStateFalse(event: KeyboardEvent) {
    gameAction.setKeyState(event.key, false);
    
  }
  
  function setKeyStateTrue(event: KeyboardEvent) {
    gameAction.setKeyState(event.key, true);
  }


  return (
    <div id="maingame"
    style={{

   
    }}
  >
      {/* The Phaser canvas will be automatically added here */}
    </div>
  );
};