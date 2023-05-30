'use client';
import { checkCustomRoutes } from 'next/dist/lib/load-custom-routes';
import Phaser from 'phaser';
import { useEffect } from 'react';

class Example extends Phaser.Scene {
  constructor() {
    super();
  }

  private dog: { key: string }[] = [];
  preload() {
    this.load.setBaseURL('http://localhost:3000');
    for (let i = 0; i < 25; i++) {
      this.load.image('ball' + i, '/ball/' + i + '.png');
      this.dog.push({ key: 'ball' + i });
    }
  }

  create() {
    const particles = this.add.particles(0, 0, 'red', {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
    });

    const ball = this.physics.add.sprite(100, 100, 'ball0');
    ball.setVelocity(200, 200);
    ball.setBounce(1, 1);
    ball.setCollideWorldBounds(true);
    particles.startFollow(ball);
    // ball.setScale(0.5, 0.5);

    this.anims.create({
      key: 'ballani',
      frames: this.dog,
      frameRate: 60,
      repeat: -1,
    });

    ball.anims.play('ballani', true);
  }
}

const startGame = () => {
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
      default: 'arcade',
      arcade: {},
    },
    scene: Example,
  };

  const game = new Phaser.Game(config);

  return null;
};

export default startGame;
