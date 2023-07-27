import { classSkill, skillState } from '../scenes/GameReadyScene';
import { SkillTree } from './SkillTree';



type classType = 'Str' | 'Agi' | 'Int';
export default class GameSkillSelection {
  private skillState: classSkill;
  constructor(
    gameWidth: number,
    gameHeight: number,
    scene: Phaser.Scene,
    texture: string,
    setSkillState:(
      classType: classType,
      level: number,
      name: string,
      action: boolean,
    state: boolean,
    ) => boolean,
  ) {
    this.skillState = { Str: [], Agi: [], Int: [] };
    scene.add
      .graphics()
      .fillStyle(0xfe4773, 0.5)
      .fillRect(gameWidth * 0.03, 10, gameWidth * 0.3, gameHeight * 0.7)
      .setAlpha(0.5);
    scene.add
      .graphics()
      .fillStyle(0x8f30a1, 0.5)
      .fillRect(gameWidth * 0.35, 10, gameWidth * 0.3, gameHeight * 0.7)
      .setAlpha(0.5);
    scene.add
      .graphics()
      .fillStyle(0x2e6d92, 0.5)
      .fillRect(gameWidth * 0.67, 10, gameWidth * 0.3, gameHeight * 0.7)
      .setAlpha(0.5);
    const skilltree1 = new SkillTree(
      [
        [{ frame: texture, name: 'SKILL1', description: 'DO 1' }],
        [{ frame: texture, name: 'SKILL2', description: 'DO 2' }],
        [{ frame: texture, name: 'SKILL3', description: 'DO 3' }],
        [
          { frame: texture, name: 'SKILL4', description: 'DO 4' },
          { frame: texture, name: 'SKILL5', description: 'DO 5' },
        ],
      ],
      scene,
      { x: gameWidth * 0.08, y: 100 },
      { x: gameWidth * 0.1, y: gameWidth * 0.1 },
      this.setSkill,
      setSkillState,
      'Str',
    );
    const skilltree2 = new SkillTree(
      [
        [
          { frame: texture, name: 'SKILL1', description: 'DO 1' },
          { frame: texture, name: 'SKILL2', description: 'DO 2' },
        ],
        [{ frame: texture, name: 'SKILL3', description: 'DO 3' }],
        [{ frame: texture, name: 'SKILL4', description: 'DO 4' }],
        [{ frame: texture, name: 'SKILL5', description: 'DO 5' }],
      ],
      scene,
      { x: gameWidth * 0.4, y: 100 },
      { x: gameWidth * 0.1, y: gameWidth * 0.1 },
      this.setSkill,
      setSkillState,
      'Agi',
    );
    const skilltree3 = new SkillTree(
      [
        [{ frame: texture, name: 'SKILL1', description: 'DO 1' }],
        [
          { frame: texture, name: 'SKILL2', description: 'DO 2' },
          { frame: texture, name: 'SKILL3', description: 'DO 3' },
          { frame: texture, name: 'SKILL4', description: 'DO 4' },
        ],
        [{ frame: texture, name: 'SKILL5', description: 'DO 5' }],
      ],
      scene,
      { x: gameWidth * 0.72, y: 100 },
      { x: gameWidth * 0.1, y: gameWidth * 0.1 },
      this.setSkill,
      setSkillState,
      'Int',
    );
  }
  setSkill = (level: Array<skillState>, skillClass: classType) => {
    this.skillState[skillClass].push(level);
  };

  printTreeState() {
    console.log(this.skillState);
  }

  getSkillState() {
    return this.skillState;
  }
}
