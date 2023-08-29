import { Socket } from 'socket.io-client';
import { gameData } from '../GameRender';
import { MatchInfo } from '@/types/GameTypes';
import { Circle } from '@mui/icons-material';

export default class GameMainScene extends Phaser.Scene {
  private ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private paddle1:
    | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    | undefined;
  private paddle2:
    | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    | undefined;
  private p1name: string;
  private p2name: string;
  private p1scoretext: Phaser.GameObjects.BitmapText | undefined;
  private p2scoretext: Phaser.GameObjects.BitmapText | undefined;
  private score: { player1: number; player2: number };
  private windowsize: { width: number; height: number };
  private Socket: Socket | null;
  private prevDirectionX: number | undefined;
  private prevDirectionY: number | undefined;
  private soundEffect:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
    | undefined;
  private outofboundEffect:
    | Phaser.GameObjects.Particles.ParticleEmitter
    | undefined;
  private keyloop: () => void;
  private prediction: (timestamp: number) => gameData;
  constructor(
    gameSocket: Socket | null,
    keyloop: () => void,
    prediction: (timestamp: number) => gameData,
    matchInfo: MatchInfo | null,
  ) {
    super({ key: 'MainScene' });
    this.Socket = gameSocket;
    this.keyloop = keyloop;
    this.prediction = prediction;
    this.score = { player1: 0, player2: 0 };
    this.windowsize = { width: 0, height: 0 };
    this.p1name = matchInfo ? matchInfo.player1.nickname : '';
    this.p2name = matchInfo ? matchInfo.player2.nickname : '';
  }

  preload() {
    const game = this;
    game.load.audio('laser', '/assets/collision.ogg');
    game.load.audio('banger', '/assets/bgm0.mp3');
    game.load.video('background', '/assets/background1.mp4', true);
    game.load.multiatlas('ballsprite', '/assets/ballsprite.json', 'assets');
    game.load.image('red', '/assets/neonpurple.png');
    game.load.image('star', '/assets/star.png');
    game.load.bitmapFont(
      'font',
      '/assets/scorefont_0.png',
      '/assets/scorefont.fnt',
    );

    game.load.bitmapFont(
      'cyberware',
      '/assets/Cyberware_0.png',
      '/assets/Cyberware.fnt',
    );
    game.load.image('paddle1', '/assets/redpaddle.png');
    game.load.image('paddle2', '/assets/bluepaddle.png');
    game.load.image('frametest', '/assets/testframe.png');
    game.load.image('glowframe', '/assets/namebox.png');
    game.load.image('normalframe', '/assets/namebox_normal.png');
  }

  create() {
    this.windowsize = {
      width: Number(this.game.config.width),
      height: Number(this.game.config.height),
    };
    const videoSprite = this.add.video(
      this.windowsize.width * 0.5,
      this.windowsize.height * 0.5,
      'background',
    );

    this.scale.displaySize.setAspectRatio(
      window.innerWidth / window.innerHeight,
    );
    videoSprite.setScale(
      Number(this.game.config.width) / 1920,
      Number(this.game.config.height) / 1080,
    );
    videoSprite.play(true);
    const game = this;
    const music = this.sound.add('banger', { loop: true }).setVolume(0.5);
    music.play();
    this.p1scoretext = game.add
      .bitmapText(
        this.windowsize.width * 0.48,
        this.windowsize.height * 0.05,
        'font',
        '00',
        64,
      )
      .setOrigin(0.5)
      .setTint(0xffffff);
    this.p2scoretext = game.add
      .bitmapText(
        this.windowsize.width * 0.52,
        this.windowsize.height * 0.05,
        'font',
        '00',
        64,
      )
      .setOrigin(0.5)
      .setTint(0xffffff);

    const dx = this.prevDirectionX !== undefined ? this.prevDirectionX : 0;
    const dy = this.prevDirectionY !== undefined ? this.prevDirectionY : 0;

    const particles = game.add.particles(0, 0, 'red', {
      quantity: 20,
      speed: { min: -100, max: 100 },
      accelerationY: 1000 * dy,
      accelerationX: 1000 * dx,
      scale: { start: 1, end: 0.1 },
      lifespan: { min: 300, max: 1000 },
      blendMode: 'ADD',
      frequency: 150,
      followOffset: { x: 0, y: 0 },
      rotate: { min: -180, max: 180 },
    });

    const player1frame = this.add
      .image(
        this.windowsize.width * 0.35,
        this.windowsize.height * 0.05,
        'glowframe',
      )
      .setOrigin(0.5, 0.5)
      .setDisplaySize(
        this.windowsize.width * 0.4,
        this.windowsize.height * 0.2,
      );
    const player2frame = this.add
      .image(
        this.windowsize.width * 0.65,
        this.windowsize.height * 0.05,
        'glowframe',
      )
      .setOrigin(0.5, 0.5)
      .setDisplaySize(this.windowsize.width * 0.4, this.windowsize.height * 0.2)
      .setFlipX(true);

    const p1glow = player1frame.postFX.addShine(0.2, 0.2, 5);
    const p2glow = player2frame.postFX.addShine(0.2, 0.2, 5);

    // this.tweens.add({
    //   targets: p1glow,
    //   outerStrength: 2,
    //   yoyo: true,
    //   loop: -1,
    //   ease: 'sine.inout',
    // });

    // this.tweens.add({
    //   targets: p2glow,
    //   outerStrength: 2,
    //   yoyo: true,
    //   loop: -1,
    //   ease: 'sine.inout',
    // });

    const textstyle = {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#d3d3d3', // Text color in hexadecimal
      backgroundColor: 'transparent', // Background color (transparent in this case)
      align: 'center', // Text alignment: 'left', 'center', 'right'
      stroke: '#5114ed', // Stroke color
      strokeThickness: 2, // Stroke thickness in pixels
      // shadow: {
      //   offsetX: 2,
      //   offsetY: 2,
      //   color: '#2b38ed',
      //   blur: 5,
      //   stroke: true,
      //   fill: true,
      // },
    };
    const p1text = this.add
      .text(player1frame.x, player1frame.y, this.trimName('DONG'), textstyle)
      .setOrigin(0.5, 0.5);

    const p2text = this.add
      .text(player2frame.x, player2frame.y, this.trimName('BEEEEEE'), textstyle)
      .setOrigin(0.5, 0.5);
    // const player2 = this.add
    //   .image(
    //     this.windowsize.width * 0.95,
    //     this.windowsize.height * 0.05,
    //     'frame2',
    //   )
    //   .setOrigin(0.5, 0.5);

    // const p2text = this.add
    //   .text(
    //     this.windowsize.width * 0.955,
    //     this.windowsize.height * 0.05,
    //     'P2',
    //     {
    //       fontFamily: 'Arial',
    //       fontSize: 96,
    //       color: '#ffffff', // Text color in hexadecimal
    //       backgroundColor: 'transparent', // Background color (transparent in this case)
    //       align: 'right', // Text alignment: 'left', 'center', 'right'
    //       stroke: '#0000ff', // Stroke color
    //       strokeThickness: 5, // Stroke thickness in pixels
    //       shadow: {
    //         offsetX: 2,
    //         offsetY: 2,
    //         color: '#0000ff',
    //         blur: 5,
    //         stroke: true,
    //         fill: true,
    //       },
    //     },
    //   )
    //   .setOrigin(0.5, 0.5);
    // const p2text = this.add
    //   .bitmapText(
    //     this.windowsize.width * 0.95,
    //     this.windowsize.height * 0.05,
    //     'cyberware',
    //     'P2',
    //     96,
    //   )
    //   .setOrigin(0.5, 0.5)
    //   .setTint(0x0000ff, 0);

    // const testframe = this.add
    //   .image(
    //     this.windowsize.width * 0.95,
    //     this.windowsize.height * 0.05,
    //     'frametest',
    //   )
    //   .setOrigin(0.5, 0.5)
    //   .setDisplaySize(
    //     this.windowsize.width * 0.2,
    //     this.windowsize.height * 0.2,
    //   );
    this.soundEffect = this.sound.add('laser');
    // if (!ball) return;
    this.ball = game.physics.add
      .sprite(
        this.windowsize.width * 0.5,
        this.windowsize.height * 0.5,
        'ballsprite',
        '0.png',
      )
      .setScale(1.5, 1.5);
    particles.startFollow(this.ball);
    // wisp.startFollow(this.ball);
    this.paddle1 = game.physics.add
      .sprite(
        this.windowsize.width * 0.05,
        this.windowsize.height * 0.5,
        'paddle1',
      )
      .setScale(2, 2);
    this.paddle2 = game.physics.add
      .sprite(
        this.windowsize.width * 0.95,
        this.windowsize.height * 0.5,
        'paddle2',
      )
      .setScale(2, 2);

    const redglow = this.paddle1.preFX?.addGlow(0xff4444, 0, 0, false, 0.1, 3);
    const blueglow = this.paddle2.preFX?.addGlow(
      0x34646ff,
      0,
      0,
      false,
      0.1,
      3,
    );

    this.tweens.add({
      targets: blueglow,
      outerStrength: 2,
      yoyo: true,
      loop: -1,
      ease: 'sine.inout',
    });
    this.tweens.add({
      targets: redglow,
      outerStrength: 2,
      yoyo: true,
      loop: -1,
      ease: 'sine.inout',
    });

    const frames = game.anims.generateFrameNames('ballsprite', {
      start: 0,
      end: 215,
      zeroPad: 0,
      suffix: '.png',
    });

    game.anims.create({
      key: 'ballPulse',
      frames: frames,
      frameRate: 60,
      repeat: -1,
    });

    this.ball.anims.play('ballPulse', true);

    this.outofboundEffect = this.add.particles(0, 0, 'star', {
      quantity: 10,
      speed: 100,
      scale: { start: 1, end: 0.0 },
      lifespan: 300,
      blendMode: 'ADD',
      frequency: 50,
      followOffset: { x: 0, y: 0 },
      rotate: { min: -180, max: 180 },
      active: false,
    });

    this.outofboundEffect.startFollow(this.ball);
    // Add text inside the rhombus

    // Add text inside the rhombus

    // circle.setPipeline('simpleTexture');
    this.Socket?.on('victory', (player: number) => {
      this.scene.start('victory', { player: player });
    });
    return () => {
      if (this.Socket) {
        this.Socket.off('game');
        this.Socket.off('victory');
      }
    };
  }

  trimName(name: string) {
    if (name.length >= 10) return (name.substring(0, 9) + '..').toUpperCase();
    else return name.toUpperCase();
  }

  outofboundEffectTrigger = () => {
    if (this.outofboundEffect) {
      this.outofboundEffect.active = true;
      this.outofboundEffect.start();
      setTimeout(() => {
        if (this.outofboundEffect) {
          this.outofboundEffect.active = false;
          this.outofboundEffect.stop();
        }
      }, 1000);
    }
  };

  handleCollision1 = () => {
    if (!this.paddle1) return;
    if (this.soundEffect) this.soundEffect.play();
    const paddlebloom1 = this.paddle1.postFX.addBloom(0xffffff, 0.8, 0.8, 1, 3);
    // const effect = this.paddle1.current.postFX.addDisplacement('red', this.paddle1.current.x + this.paddle1.current.width / 2, this.ball.current.y)
    this.time.addEvent({
      delay: 150,
      callback: () => {
        this.paddle1?.postFX.remove(paddlebloom1);
        paddlebloom1.destroy();
      },
    });
  };
  handleCollision2 = () => {
    {
      if (!this.paddle2) return;
      if (this.soundEffect) this.soundEffect.play();
      const paddlebloom2 = this.paddle2.postFX.addBloom(
        0xffffff,
        0.8,
        0.8,
        1,
        3,
      );
      // const effect = this.paddle1.postFX.addDisplacement('red', this.paddle1.x + this.paddle1.width / 2, this.ball.y)
      this.time.addEvent({
        delay: 150,
        callback: () => {
          this.paddle2?.postFX.remove(paddlebloom2);
          paddlebloom2.destroy();
        },
      });
    }
  };
  scoreNumber = (score: number) => {
    if (score < 10) return '0' + score;
    else return `${score}`;
  };

  updatePosition = () => {
    const data = this.prediction(Date.now());
    if (data) {
      if (this.ball) {
        if (data.ball.x <= 0 || data.ball.x >= this.windowsize.width)
          this.outofboundEffectTrigger();
        this.ball.x = data.ball.x;
        this.ball.y = data.ball.y;
      }
      if (this.paddle1) this.paddle1.y = data.paddle1.y;
      if (this.paddle2) this.paddle2.y = data.paddle2.y;
      if (this.prevDirectionX) {
        if (this.prevDirectionX < 0 && data.balldirection.x > 0)
          this.handleCollision1();
        else if (this.prevDirectionX > 0 && data.balldirection.x < 0)
          this.handleCollision2();
      }
      this.prevDirectionX = data.balldirection.x;
      this.prevDirectionY = data.balldirection.y;
      this.score = data.score;
    }
  };

  updateScore = () => {
    this.updatePlayerScore(this.p1scoretext, this.score.player1);
    this.updatePlayerScore(this.p2scoretext, this.score.player2);
  };

  updatePlayerScore = (
    scoreText: Phaser.GameObjects.BitmapText | undefined,
    playerScore: number,
  ) => {
    if (scoreText) {
      const score = this.scoreNumber(playerScore);
      if (scoreText.text !== score) {
        const barrel = scoreText.preFX?.addBarrel(2);
        scoreText.setText(score);
        setTimeout(() => {
          if (barrel) {
            scoreText.preFX?.remove(barrel);
            barrel.destroy();
          }
        }, 1000);
      }
    }
  };
  update() {
    this.keyloop();
    this.updatePosition();
    this.updateScore();
    // console.log(this.p1data.avatar);
  }
}
