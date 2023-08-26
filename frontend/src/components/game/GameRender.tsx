'use client';
import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';
import GameMainScene from './scenes/GameMainScene';
import GameMatchFoundScene from './scenes/GameVictory';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions } from '@/lib/stores/useGameStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { MatchState } from '@/types/GameTypes';
import { View } from '@/types/UtilTypes';
import { Backdrop, Box, Typography } from '@mui/material';
import GameVictoryScene from './scenes/GameVictory';

export default function GameRender() {
  const gameSocket = useGameSocket();
  const gameAction = useGameActions();
  const viewAction = useUtilActions();
  const [disconnected, setDisconnected] = useState(false);
  const   keyLoop = () => {
    if (gameAction.getKeyState('w')) {
      if (gameSocket)
      gameSocket.emit('Player', 'w');
    }
    if (gameAction.getKeyState('s')) {
      if (gameSocket)
      gameSocket.emit('Player', 's');
    }
    if (gameAction.getKeyState(' ')) {
      if (gameSocket)
      gameSocket.emit('Player', ' ');
    }
  };
  useEffect(() => {

    if (gameSocket)
      gameSocket.on("disc", () => {
        setDisconnected(true);
      const timer = setTimeout(() => {
        gameAction.setMatchState(MatchState.IDLE);
        viewAction.setCurrentView(View.GAME);
        gameSocket.disconnect();
      }, 3000)
      return () =>{
        clearTimeout(timer);
      }
    })
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

      scene: [game, new GameVictoryScene()],
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={disconnected}
      >
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">Opponent disconnected, returning to main menu...</Typography>
          {/* <Typography>Time elapsed: {searchTime} seconds</Typography> */}
        </Box>
      </Backdrop>
      {/* The Phaser canvas will be automatically added here */}
    </div>
  );
};