export default class GameMatchFoundScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MatchFound' });
  }

  preload() {
    this.load.image('background', '/assets/background.png');
    this.load.image('neonpink', '/assets/neonpink.png');
  }

  create() {
    const particle1 = this.add.particles(0, 0, 'neonpink', {
      speed: { min: 50, max: 100 },
      lifespan: 1000,
      blendMode: 'ADD',
      quantity: 100,
      followOffset: { x: 0, y: 0 },
      rotate: { min: -180, max: 180 },
    });

    const background = this.add.image(0, 0, 'background').setOrigin(0);
    background.displayHeight = Number(this.game.config.height);
    background.displayWidth = Number(this.game.config.width);
    const Vtext = this.add
      .text(0, 275, 'V', {
        fontFamily: 'Futura',
        fontSize: '128px',
      })
      .setOrigin(0.5)
      .setScale(1);

    // 375, 425
    this.tweens.add({
      targets: Vtext,
      x: 375,
      duration: 1000,
      ease: 'Bounce.easeOut',
    });

    const redGradient = Vtext.context.createLinearGradient(
      0,
      0,
      Vtext.width,
      Vtext.height,
    );

    redGradient.addColorStop(0, '#e7372a');
    redGradient.addColorStop(1, '#53110e');
    Vtext.setFill(redGradient);

    const Stext = this.add
      .text(800, 325, 'S', {
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

    this.tweens.add({
      targets: Stext,
      x: 425,
      duration: 1000,
      ease: 'Bounce.easeOut',
    });
    particle1.startFollow(Vtext);
    setTimeout(() => this.scene.start('MainScene'), 3000);
  }

  update() {}
}
