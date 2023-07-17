import { SkillTree } from './SkillTree';

export default class GameSkillSelection {
  constructor(
    gameWidth: number,
    gameHeight: number,
    scene: Phaser.Scene,
    texture: string,
  ) {
    scene.add
      .graphics()
      .fillStyle(0xff00ff, 0.5)
      .fillRect(gameWidth * 0.03, 10, gameWidth * 0.3, gameHeight * 0.7)
      .setAlpha(0.5);
    scene.add
      .graphics()
      .fillStyle(0xffff00, 0.5)
      .fillRect(gameWidth * 0.35, 10, gameWidth * 0.3, gameHeight * 0.7)
      .setAlpha(0.5);
    scene.add
      .graphics()
      .fillStyle(0x00ffff, 0.5)
      .fillRect(gameWidth * 0.67, 10, gameWidth * 0.3, gameHeight * 0.7)
      .setAlpha(0.5);
    const skilltree1 = new SkillTree(
      [
        [{ frame: texture, name: 'SKILL1', description: 'DO 1' }],
        [{ frame: texture, name: 'SKILL2', description: 'DO 2' }],
        [{ frame: texture, name: 'SKILL3', description: 'DO 3' }],
        [{ frame: texture, name: 'SKILL4', description: 'DO 4' }],
      ],
      scene,
      { x: gameWidth * 0.08, y: 100 },
      { x: gameWidth * 0.1, y: gameWidth * 0.1 },
    );
    const skilltree2 = new SkillTree(
      [
        [
          { frame: texture, name: 'SKILL1', description: 'DO 1' },
          { frame: texture, name: 'SKILL2', description: 'DO 2' },
        ],
        [{ frame: texture, name: 'SKILL3', description: 'DO 3' }],
        [{ frame: texture, name: 'SKILL4', description: 'DO 4' }],
      ],
      scene,
      { x: gameWidth * 0.4, y: 100 },
      { x: gameWidth * 0.1, y: gameWidth * 0.1 },
    );
    const skilltree3 = new SkillTree(
      [
        [{ frame: texture, name: 'SKILL1', description: 'DO 1' }],
        [],
        [
          { frame: texture, name: 'SKILL2', description: 'DO 2' },
          { frame: texture, name: 'SKILL3', description: 'DO 3' },
          { frame: texture, name: 'SKILL4', description: 'DO 4' },
        ],
      ],
      scene,
      { x: gameWidth * 0.72, y: 100 },
      { x: gameWidth * 0.1, y: gameWidth * 0.1 },
    );
  }
}
