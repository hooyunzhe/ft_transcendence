import { MutableRefObject, useRef } from 'react';
import { Socket } from 'socket.io-client';

export default class GameMainScene extends Phaser.Scene {
  private ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private paddle1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private paddle2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;

  private Socket: Socket | null;
  private keyloop: () => void
  constructor(gameSocket: Socket | null, keyloop:  () => void) {
    super({ key: 'MainScene' });
    this.Socket = gameSocket;
    this.keyloop = keyloop;
  }

  preload() {
    const game = this;
    game.load.video('background', '/assets/background1.mp4', true);
    game.load.multiatlas('ballsprite', '/assets/ballsprite.json', 'assets');
    game.load.image('red', '/assets/bubble.png');
    game.load.image('test', '/assets/test3.png');
    game.load.image('paddle1', '/assets/paddle1.png');
    game.load.image('paddle2', '/assets/paddle2.png');
  }

  create() {


    const videoSprite = this.add.video(Number(this.game.config.width) /2 , Number(this.game.config.height) /2, 'background');

    this.scale.displaySize.setAspectRatio( window.innerWidth/window.innerHeight);
    this.scale.refresh();
    videoSprite.setScale(Number(this.game.config.width) / 3840, Number(this.game.config.height) / 2160);
    videoSprite.play(true);
    const game = this;

    const particles = game.add.particles(0, 0, 'test', {
      speed: { min: -100, max: 100 },
      scale: { start: 0.01, end: 0 },
      lifespan: 2000,
      blendMode: 'ADD',

      followOffset: { x: 0, y: 0 },
      rotate: { min: -180, max: 180 },
    });

    particles.setFrequency(50, 1);

    // if (!ball) return;
    this.ball = game.physics.add.sprite(
      400,
      300,
      'ballsprite',
      '0.png',
    );
    particles.startFollow(this.ball);
    const gameState = game.add.text(400, 50, '', { align: 'center' });
    gameState.setOrigin(0.5);
    this.paddle1 = game.physics.add.sprite(15, 300, 'paddle1');
    this.paddle2 = game.physics.add.sprite(785, 300, 'paddle2');


    const handleCollision1 = () => {
      if (!this.paddle1) return;
      const paddlebloom1 = this.paddle1.postFX.addBloom(
        0xffffff,
        0.8,
        0.8,
        1,
        3,
      );
      // const effect = this.paddle1.current.postFX.addDisplacement('red', this.paddle1.current.x + this.paddle1.current.width / 2, this.ball.current.y)
      game.time.addEvent({
        delay: 150,
        callback: () => {
          this.paddle1?.postFX.remove(paddlebloom1);
          paddlebloom1.destroy();
        },
      });
    };
    const handleCollision2 = () => {
      {
        if (!this.paddle2) return;
        const paddlebloom2 = this.paddle2.postFX.addBloom(
          0xffffff,
          0.8,
          0.8,
          1,
          3,
        );
        // const effect = this.paddle1.postFX.addDisplacement('red', this.paddle1.x + this.paddle1.width / 2, this.ball.y)
        game.time.addEvent({
          delay: 150,
          callback: () => {
            this.paddle2?.postFX.remove(paddlebloom2);
            paddlebloom2.destroy();
          },
        });
      }
    };
    game.physics.add.collider(
      this.ball,
      this.paddle1,
      handleCollision1,
    );
    game.physics.add.collider(
      this.ball,
      this.paddle2,
      handleCollision2,
    );

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

    //   // useEffect(() => {
    if (this.Socket)
    this.Socket.on(
      'game',
      (data: {
        ball: { x: number; y: number };
        paddle1: { x: number; y: number };
        paddle2: { x: number; y: number };
        score: { player1: number; player2: number };
      }) => {
  
        if (this.ball) {
          this.ball.x = data.ball.x;
          this.ball.y = data.ball.y;
        }
        if (this.paddle1) this.paddle1.y = data.paddle1.y;
        if (this.paddle2) this.paddle2.y = data.paddle2.y;
      },
    );
    this.Socket?.on('victory', (player: number) => {
      this.scene.start('victory', { player: player})
    })
    return () => {
      if (this.Socket)
      this.Socket.off('game');
    };
  }
  update() {
    this.keyloop();
  }


  
  
}
