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
  private p1data: { nickname: string; avatar: string };
  private p2data: { nickname: string; avatar: string };
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
    if (matchInfo) {
      this.p1data = matchInfo.player1;
      this.p2data = matchInfo.player2;
    }
  }

  preload() {
    const game = this;
    game.load.audio('laser', '/assets/collision.ogg');
    game.load.audio('banger', '/assets/bgm0.mp3');
    game.load.video('background', '/assets/background1.mp4', true);
    game.load.multiatlas('ballsprite', '/assets/ballsprite.json', 'assets');
    game.load.image('red', '/assets/neonpurple.png');
    game.load.image('test', '/assets/test3.png');
    game.load.bitmapFont(
      'font',
      '/assets/scorefont_0.png',
      '/assets/scorefont.fnt',
    );
    game.load.image('paddle1', '/assets/redpaddle.png');
    game.load.image('paddle2', '/assets/bluepaddle.png');
    // game.load.image('player1avatar', this.p1data.avatar);
    // game.load.image('player2avatar', this.p2data.avatar);
    game.load.image('redframe', '/assets/redneoncircle.png');
    game.load.image('blueframe', '/assets/blueneoncircle.png');
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
        this.windowsize.width * 0.45,
        this.windowsize.height * 0.05,
        'font',
        '00',
        64,
      )
      .setOrigin(0.5)
      .setTint(0xffffff);
    this.p2scoretext = game.add
      .bitmapText(
        this.windowsize.width * 0.55,
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
      frequency: 50,
      followOffset: { x: 0, y: 0 },
      rotate: { min: -180, max: 180 },
    });

    const redframe = this.add
      .image(0, 0, 'redframe')
      .setOrigin(0.2, 0.2)
      .setScale(0.2);
    // const wisp = this.add.particles(0, 0, 'red', {
    //   frame: 'white',
    //   color: [0x96e0da, 0x937ef3],
    //   colorEase: 'quart.out',
    //   lifespan: 1500,
    //   angle: { min: 1 * angle, max: 0.8 * angle },
    //   scale: { start: 1, end: 0, ease: 'sine.in' },
    //   speed: { min: 250, max: 350 },
    //   advance: 2000,
    //   blendMode: 'ADD',
    // });
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
    if (this.p1scoretext)
      this.p1scoretext.setText(this.scoreNumber(this.score.player1));
    if (this.p2scoretext)
      this.p2scoretext.setText(this.scoreNumber(this.score.player2));
  };
  update() {
    this.keyloop();
    this.updatePosition();
    this.updateScore();
    // console.log(this.p1data.avatar);
  }
}
