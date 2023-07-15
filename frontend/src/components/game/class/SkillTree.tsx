import { SkillNodes } from './SkillNodes';

interface coordinate{
  x: number,
  y: number,
}
export class SkillTree {
  private iconlist: Array<{skillframe: string, skills: Array<string>}>;
  private skilltreeNode: Array<SkillNodes>;
  private scene: Phaser.Scene;
  private startingpoint: coordinate;;
  constructor(
    iconlist: Array<{skillframe: string, skills: Array<string>}>,
    scene: Phaser.Scene,
    startingpoint : coordinate
  ) {
    // this.skilltreedata = skilltreedata;
    this.iconlist = iconlist;
    this.skilltreeNode = [];
    this.scene = scene;
    this.startingpoint = startingpoint;
    this.createTree();
  }

  findGrid(index: number){
    const x = index / 2;
    const y = index % 2;
    const prevHeight = index - 1 >= 0 ? this.skilltreeNode[index - 1].getSize().y : 1;
    const prevWidth = index - 1 >= 0 ? this.skilltreeNode[index - 1].getSize().x : 1;
    return ({x: x * prevHeight * this.startingpoint.x, y: y * prevWidth * this.startingpoint.y})
  }
  createTree() {
    this.iconlist.forEach((map, index) => {
      const coordinate = this.findGrid(index);
        this.skilltreeNode.push(new SkillNodes(coordinate.x, coordinate.y , map.skillframe, map.skills[0], map.skills[1], this.scene))
    })
  }
}
