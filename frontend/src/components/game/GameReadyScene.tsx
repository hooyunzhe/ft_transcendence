import { MutableRefObject } from 'react';

export default class GameReadyScene extends Phaser.Scene {
  private ready: MutableRefObject<boolean>;
  constructor(gameReady: MutableRefObject<boolean>) {
    super({ key: 'GameReadyScene' });
    this.ready = gameReady;
  }

  preload() {
    this.load.image('background', '/assets/background.png');
    this.load.bitmapFont('integral', '/assets/integral.otf')
  }

  create() {
    const background = this.add.image(0, 0, 'background').setOrigin(0);
    background.displayHeight = Number(this.game.config.height);
    background.displayWidth = Number(this.game.config.width);
    // const Vtext = this.add
    //   .text(375, 275, 'V', {
    //     fontFamily: 'integral',
    //     fontSize: '128px',
    //   })
    //   .setOrigin(0.5)
    //   .setScale(1);
    // const redGradient = Vtext.context.createLinearGradient(
    //   0,
    //   0,
    //   Vtext.width,
    //   Vtext.height,
    // );
        const Vtext = this.add
      .bitmapText(375, 275, 'integral', 'V', 128, 0.5)
    // const redGradient = Vtext.context.createLinearGradient(
    //   0,
    //   0,
    //   Vtext.width,
    //   Vtext.height,
    // );
    // redGradient.addColorStop(0, '#e7372a');
    // redGradient.addColorStop(1, '#53110e');
    // Vtext.setFill(redGradient);

    const Stext = this.add
      .text(425, 325, 'S', {
        fontFamily: 'Arial',
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
