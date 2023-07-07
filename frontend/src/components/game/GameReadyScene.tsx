import { MutableRefObject } from 'react';

export default class GameReadyScene extends Phaser.Scene {
  private ready: MutableRefObject<boolean>;
  constructor(gameReady: MutableRefObject<boolean>) {
    super({ key: 'GameReadyScene' });
    this.ready = gameReady;
  }
  create() {
    const background = this.add.image(0, 0, 'background').setOrigin(0);
    background.displayHeight = Number(this.game.config.height);
    background.displayWidth = Number(this.game.config.width);
  }
  preload() {
    this.load.image('background', '/ball/background.png');
  }
  update() {
    if (this.ready.current == true) this.scene.start('MainScene');
  }
}
