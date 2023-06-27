
import { Assets, Spritesheet } from 'pixi.js';

export default async function AssetLoader() {

  Promise.all([
    Assets.add('red', '/ball/bubble.png'),
    Assets.add('paddle1', '/ball/paddle1.png'),
    Assets.add('paddle2', '/ball/paddle2.png'),
  Assets.load('/ball/ballsprite.json'),
    Assets.load('red'),
    Assets.load('paddle1'),
    Assets.load('paddle2'),
  ],)
} 