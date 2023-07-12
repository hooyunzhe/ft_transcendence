import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Button } from './GameButton';
import { Socket } from 'socket.io-client';

export default class GameReadyScene extends Phaser.Scene {
  private Socket: Socket;
  private Ready: Boolean;
  constructor(gameSocket: Socket) {
    super({ key: 'GameReadyScene' });
    this.Socket = gameSocket;
    this.Ready = false;
  }

  preload() {
    this.load.image('greenbutton', '/assets/ready_button_green.png');
    this.load.image('redbutton', '/assets/ready_button_red.png');
  }

  create() {
    const emitReady = () => {
      this.Socket.emit('ready');
      console.log('ready???');
    };

    const emitUnready = () => {
      this.Socket.emit('unready');
      console.log('unready');
    };
    const readybutton1 = new Button(
      Number(this.game.config.width) / 2,
      Number(this.game.config.height) * 0.8,
      'Ready',
      this,
      'greenbutton',
      'redbutton',
      1000,
      emitReady,
      emitUnready,
    );

    const createCountdown = () => {
      let start = 5;
      const text = this.add
        .text(
          Number(this.game.config.width) / 2,
          Number(this.game.config.height) / 2,
          String(start),
          {
            fontFamily: 'impact',
            fontSize: '128px',
          },
        )
        .setAlpha(0.5)
        .setOrigin(0.5);
      const inter = setInterval(() => {
        start--;
        text.setText(String(start));
        if (start == 0) {
          clearInterval(inter);
          this.Ready = true;
        }
      }, 1000);
    };

    this.Socket.on('start', () => {
      createCountdown();
    });

    return () => {
      this.Socket.off('start');
    };
  }
  update() {
    if (this.Ready === true) this.scene.start('MainScene');
  }
}
