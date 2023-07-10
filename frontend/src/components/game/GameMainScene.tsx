import { MutableRefObject, useRef } from 'react';
import { Socket } from 'socket.io-client';

export default class GameMainScene extends Phaser.Scene {
  private ball: MutableRefObject<
    Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined
  >;
  private paddle1: MutableRefObject<
    Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined
  >;
  private paddle2: MutableRefObject<
    Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined
  >;

  private Socket: Socket;
  constructor(gameSocket: Socket) {
    super({ key: 'MainScene' });
    this.Socket = gameSocket;
    this.ball = useRef<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();
    this.paddle1 = useRef<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();
    this.paddle2 = useRef<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();
  }
  // const score = {
  //   player1: 0,
  //   player2: 0,
  // };

  private keyState: { [key: string]: boolean } = {};
  preload() {
    const game = this;
    game.load.multiatlas('ballsprite', '/assets/ballsprite.json', 'ball');
    game.load.image('red', '/assets/bubble.png');
    game.load.image('test', '/assets/test3.png');
    game.load.image('paddle1', '/assets/paddle1.png');
    game.load.image('paddle2', '/assets/paddle2.png');
  }

  create() {
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
    this.ball.current = game.physics.add.sprite(
      400,
      300,
      'ballsprite',
      '0.png',
    );
    particles.startFollow(this.ball.current);
    const gameState = game.add.text(400, 50, '', { align: 'center' });
    gameState.setOrigin(0.5);
    this.paddle1.current = game.physics.add.sprite(15, 300, 'paddle1');
    this.paddle2.current = game.physics.add.sprite(785, 300, 'paddle2');

    const keyState: { [key: string]: boolean } = {};
    // const paddle1 = game.add.graphics();
    // const paddle1 = useRef<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();
    // const paddle2 = useRef<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();

    const handleCollision1 = () => {
      if (!this.paddle1.current) return;
      const paddlebloom1 = this.paddle1.current.postFX.addBloom(
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
          this.paddle1.current?.postFX.remove(paddlebloom1);
          paddlebloom1.destroy();
        },
      });
    };
    const handleCollision2 = () => {
      {
        if (!this.paddle2.current) return;
        const paddlebloom2 = this.paddle2.current.postFX.addBloom(
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
            this.paddle2.current?.postFX.remove(paddlebloom2);
            paddlebloom2.destroy();
          },
        });
      }
    };
    game.physics.add.collider(
      this.ball.current,
      this.paddle1.current,
      handleCollision1,
    );
    game.physics.add.collider(
      this.ball.current,
      this.paddle2.current,
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

    this.ball.current.anims.play('ballPulse', true);
    this.Socket.on(
      'game',
      (data: {
        ball: { x: number; y: number };
        paddle1: { x: number; y: number };
        paddle2: { x: number; y: number };
        score: { player1: number; player2: number };
      }) => {
        // GameCoordinateProps = ball;
        if (this.ball.current) {
          this.ball.current.x = data.ball.x;
          this.ball.current.y = data.ball.y;
        }
        if (this.paddle1.current) this.paddle1.current.y = data.paddle1.y;
        if (this.paddle2.current) this.paddle2.current.y = data.paddle2.y;
        // score.player1 = data.score.player1;
        // score.player2 = data.score.player2;
      },
    );
    return () => {
      this.Socket.off('game');
    };
  }
  update() {
    this.keyLoop();
  }
  private keyLoop = () => {
    if (this.keyState['w']) {
      this.Socket.emit('Player', 'w');
    }
    if (this.keyState['s']) {
      this.Socket.emit('Player', 's');
    }
  };
}
