export default class GameVictoryScene extends Phaser.Scene {
  private winner: number = 0;
  constructor() {
    super({ key: 'victory' });
  }

  preload() {
    // this.load.image('background', '/assets/background.png');
    this.load.image('neonpink', '/assets/neonpink.png');
  }

  init (data: any)
  {
    this.winner = data.player;
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

    // const background = this.add.image(0, 0, 'background').setOrigin(0);
    // background.displayHeight = Number(this.game.config.height);
    // background.displayWidth = Number(this.game.config.width);
    const Player = this.add
      .text(Number(this.game.config.width )/2, 0 , 'PLAYER ' + this.winner, {
        fontFamily: 'Futura',
        fontSize: '128px',
      })
      .setOrigin(0.5)
      .setScale(1);
    this.tweens.add({
      targets: Player,
      y: 250,
      duration: 1000,
      ease: 'Bounce.easeOut',
    });

    const redGradient = Player.context.createLinearGradient(
      0,
      0,
      Player.width,
      Player.height,
    );

    redGradient.addColorStop(0, '#e7372a');
    redGradient.addColorStop(1, '#53110e');
    Player.setFill(redGradient);

    const Win = this.add
      .text(Number(this.game.config.width )/2, Number(this.game.config.height ), 'WIN', {
        fontFamily: 'Futura',
        fontSize: '128px',
      })
      .setOrigin(0.5)
      .setScale(1);
    const blueGradient = Win.context.createLinearGradient(
      0,
      0,
      Win.width,
      Win.height,
    );
    blueGradient.addColorStop(0, '#0e1153');
    blueGradient.addColorStop(1, '#2a37e7');
    Win.setFill(blueGradient);

    this.tweens.add({
      targets: Win,
      y: 350,
      duration: 1000,
      ease: 'Bounce.easeOut',
    });
    particle1.startFollow(Player);
  }

  update() {}
}
