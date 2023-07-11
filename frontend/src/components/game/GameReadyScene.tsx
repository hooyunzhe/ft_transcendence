import { MutableRefObject } from 'react';
import { Button } from './GameButton';

export default class GameReadyScene extends Phaser.Scene {
  private ready: MutableRefObject<boolean>;
  constructor(gameReady: MutableRefObject<boolean>) {
    super({ key: 'GameReadyScene' });
    this.ready = gameReady;
  }

  preload() {
    this.load.image('greenbutton', '/assets/ready_button_green.png');
    this.load.image('redbutton', '/assets/ready_button_red.png');
  }

  create() {
    const readybutton1 = new Button(
      200,
      500,
      'Ready',
      this,
      'greenbutton',
      'redbutton',
      500,
    );

    const readybutton2 = new Button(
      600,
      500,
      'Ready',
      this,
      'greenbutton',
      'redbutton',
      500,
    );
  }
  update() {
    if (this.ready.current == true) this.scene.start('MainScene');
  }
}
