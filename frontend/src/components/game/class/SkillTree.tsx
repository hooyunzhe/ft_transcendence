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

    const prevWidth = index - 1 >= 0 ? this.skilltreeNode[index - 1].getSize().x : 1;
    const prevHeight = index - 1 >= 0 ? this.skilltreeNode[index - 1].getSize().y : 1;
    const x = Math.floor(index % 2) * prevWidth;
    const y = Math.floor(index / 2) * prevHeight;
    return ({x: x + this.startingpoint.x, y: y + this.startingpoint.y})
  }
  createTree() {
    this.iconlist.forEach((map, index) => {
      const coordinate = this.findGrid(index);
      console.log("x: ", coordinate.x, "| y: ", coordinate.y, "index: ", index);
        this.skilltreeNode.push(new SkillNodes(coordinate.x, coordinate.y , map.skillframe, map.skills[0], map.skills[1], this.scene))
    })
  }
}
