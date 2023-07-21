import { SkillNodes } from './SkillNodes';

interface coordinate {
  x: number;
  y: number;
}

export interface Skill {
  frame: string;
  name: string;
  description: string;
}

export interface skillHierachy {
  level: number;
  index: number;
}
type classType = 'Str' | 'Agi' | 'Int';
export class SkillTree {
  private skillList: Array<Array<Skill>>;
  private skilltreeNode: Array<SkillNodes>;
  private scene: Phaser.Scene;
  private startingpoint: coordinate;
  private size: coordinate;
  private classType: classType;
  constructor(
    skillList: Array<Array<Skill>>,
    scene: Phaser.Scene,
    startingpoint: coordinate,
    size: coordinate,
    callback: (level: Array<boolean>, classtype: classType) => void,
    setSkillState: (
      classType: classType,
      level: number,
      index: number,
      action: boolean,
    ) => boolean,
    classType: classType,
  ) {
    // this.skilltreedata = skilltreedata;
    this.skillList = skillList;
    this.skilltreeNode = [];
    this.scene = scene;
    this.startingpoint = startingpoint;
    this.size = size;
    this.classType = classType;
    this.createTree(callback, setSkillState);
  }

  getPosition(structure: number, levelIndex: number, index: number) {
    if (index + 1 === structure && structure != 3) index += 1;
    const x = Math.floor(index % 3) * this.size.x;
    const y = levelIndex * this.size.y;
    return { x: x + this.startingpoint.x, y: y + this.startingpoint.y };
  }
  createTree(
    callback: (level: Array<boolean>, classType: classType) => void,
    setSkillState: (
      classType: classType,
      level: number,
      index: number,
      action: boolean,
    ) => boolean,
  ) {
    this.skillList.forEach((level, levelIndex) => {
      const structure = level.length;
      const levels: Array<boolean> = [];
      level.forEach((skill, index) => {
        levels.push(false);
        const coordinate = this.getPosition(structure, levelIndex, index);
        this.skilltreeNode.push(
          new SkillNodes(
            coordinate.x,
            coordinate.y,
            skill,
            this.scene,
            this.classType,
            { level: levelIndex, index: index },
            setSkillState,
          ),
        );
      });
      callback(levels, this.classType);
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
