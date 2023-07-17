import { SkillNodes } from './SkillNodes';

interface coordinate {
  x: number;
  y: number;
}

interface Skill {
  frame: string;
  name: string;
  description: string;
}

export class SkillTree {
  private skillList: Array<Array<Skill>>;
  private skilltreeNode: Array<SkillNodes>;
  private scene: Phaser.Scene;
  private startingpoint: coordinate;
  private size: coordinate;
  constructor(
    skillList: Array<Array<Skill>>,
    scene: Phaser.Scene,
    startingpoint: coordinate,
    size: coordinate,
  ) {
    // this.skilltreedata = skilltreedata;
    this.skillList = skillList;
    this.skilltreeNode = [];
    this.scene = scene;
    this.startingpoint = startingpoint;
    this.size = size;
    this.createTree();
  }

  getPosition(structure: number, levelIndex: number, index: number) {
    if (index + 1 === structure && structure != 3) index += 1;
    const x = Math.floor(index % 3) * this.size.x;
    const y = levelIndex * this.size.y;

    // switch (structure) {
    //   case 1:

    //     break;

    //   default:
    //     break;
    // }

    return { x: x + this.startingpoint.x, y: y + this.startingpoint.y };
  }
  createTree() {
    this.skillList.forEach((level, levelIndex) => {
      const structure = level.length;
      level.forEach((skill, index) => {
        const coordinate = this.getPosition(structure, levelIndex, index);
        this.skilltreeNode.push(
          new SkillNodes(
            coordinate.x,
            coordinate.y,
            skill.frame,
            skill.name,
            skill.description,
            this.scene,
          ),
        );
      });
    });
  }

  //   console.log('x: ', coordinate.x, '| y: ', coordinate.y, 'index: ', index);
  //   this.skilltreeNode.push(
  //     new SkillNodes(
  //       coordinate.x,
  //       coordinate.y,
  //       map.skillframe,
  //       map.skills[0],
  //       map.skills[1],
  //       this.scene,
  //     ),
  //   );
  // });
}
