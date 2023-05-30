'use client';
import Phaser from 'phaser';
import { useEffect } from 'react';
import { start } from 'repl';

class Example extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.setBaseURL('http://localhost:3000');
    // this.load.image('ball', 'cyberpong.png');
    this.load.image('ball', './cyberpong.png');
    // this.load.setBaseURL('https://labs.phaser.io');
    // this.load.image('red', 'assets/particles/red.png');
    // this.load.image('ball', cyberpong);
  }

  create() {
    const particles = this.add.particles(0, 0, 'red', {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
    });

    const logo = this.physics.add.image(100, 100, 'ball');

    logo.setVelocity(500, 500);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    particles.startFollow(logo);
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
