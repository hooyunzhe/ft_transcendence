import { SkillNodes } from './SkillNodes';

export class SkillTree {
  private skilltreedata: Array<boolean>;
  private iconlist: Array<Map<string, Array<number>>>;
  private skilltreeNode: Array<SkillNodes>;
  constructor(
    skilltreedata: Array<boolean>,
    iconlist: Array<Map<string, Array<number>>>,
    scene: Phaser.Scene,
  ) {
    this.skilltreedata = skilltreedata;
    this.iconlist = iconlist;
    this.skilltreeNode = [];
  }

  createBorder(x) {}
  createTree() {
    const newNode = SkillNodes();
  }
}
