import { MutableRefObject } from 'react';
import { Button } from './GameButton';

export default class GameReadyScene extends Phaser.Scene {
  private ready: MutableRefObject<boolean>;
  constructor(gameReady: MutableRefObject<boolean>) {
    super({ key: 'GameReadyScene' });
    this.ready = gameReady;
  }

  preload() {
    this.load.image('background', '/assets/background.png');
    this.load.bitmapFont('integral', '/assets/integral.otf');
    this.load.image('greenbutton', '/assets/ready_button_green.png');
    this.load.image('redbutton', '/assets/ready_button_red.png');
  }

  create() {
    const background = this.add.image(0, 0, 'background').setOrigin(0);
    background.displayHeight = Number(this.game.config.height);
    background.displayWidth = Number(this.game.config.width);
    const Vtext = this.add
      .text(375, 275, 'V', {
        fontFamily: 'Futura',
        fontSize: '128px',
      })
      .setOrigin(0.5)
      .setScale(1);
    const redGradient = Vtext.context.createLinearGradient(
      0,
      0,
      Vtext.width,
      Vtext.height,
    );

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
    redGradient.addColorStop(0, '#e7372a');
    redGradient.addColorStop(1, '#53110e');
    Vtext.setFill(redGradient);

    const Stext = this.add
      .text(425, 325, 'S', {
        fontFamily: 'Futura',
        fontSize: '128px',
      })
      .setOrigin(0.5)
      .setScale(1);
    const blueGradient = Stext.context.createLinearGradient(
      0,
      0,
      Stext.width,
      Stext.height,
    );
    blueGradient.addColorStop(0, '#0e1153');
    blueGradient.addColorStop(1, '#2a37e7');
    Stext.setFill(blueGradient);
  }

  update() {
    if (this.ready.current == true) this.scene.start('MainScene');
  }
}
