import { Skill, skillHierachy } from './SkillTree';

export type classType = 'Str' | 'Agi' | 'Int';
export class SkillNodes {
  private skillNodes: Phaser.GameObjects.Image;
  private description: Phaser.GameObjects.Text;
  private title: Phaser.GameObjects.Text;
  private state: boolean;
  private buttonClickable: boolean;
  private skillHierachy: skillHierachy;
  private classType;
  constructor(
    x: number,
    y: number,
    skill: Skill,
    scene: Phaser.Scene,
    classType: classType,
    skillHierachy: skillHierachy,
    callback: (
      classType: classType,
      level: number,
      index: number,
      action: boolean,
    ) => boolean,
  ) {
    this.state = false;
    this.buttonClickable = true;
    this.skillHierachy = skillHierachy;
    this.classType = classType;
    this.skillNodes = scene.add
      .image(x, y, skill.frame)
      // .setOrigin(0.5)
      .setTintFill(0x8f30a1, 0x8f30a1, 0x8f30a1, 0x8f30a1)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.title.setVisible(true);
        this.description.setVisible(true);
      })
      .on('pointerout', () => {
        this.title.setVisible(false);
        this.description.setVisible(false);
      })
      .on('pointerdown', () => {
        if (this.buttonClickable) {
          this.buttonClickable = false;
          if (this.state === true) {
            // callback2();
            this.state = callback(
              this.classType,
              this.skillHierachy.level,
              this.skillHierachy.index,
              false,
            );
            if (this.state === false)
              this.skillNodes.setTintFill(
                0x8f30a1,
                0x8f30a1,
                0x8f30a1,
                0x8f30a1,
              );
          } else {
            this.state = callback(
              this.classType,
              this.skillHierachy.level,
              this.skillHierachy.index,
              true,
            );
            if (this.state === true)
              this.skillNodes.setTintFill(255, 255, 255, 255);
          }
        }
        setTimeout(() => {
          this.buttonClickable = true;
        }, 100);
      })
      .setDepth(0);

    this.title = scene.add
      .text(x, y, skill.name, { fontFamily: 'Impact', fontSize: '24px' })
      .setBackgroundColor('#AAA')
      .setVisible(false)
      .setAlpha(0.7)
      .setDepth(1);
    this.description = scene.add
      .text(x, y + this.title.height, skill.description, {
        fontFamily: 'Century Gothic',
        fontSize: '24px',
      })
      .setBackgroundColor('#AAA')
      .setVisible(false)
      .setAlpha(0.7)
      .setDepth(1);
  }

  getSize() {
    return { x: this.skillNodes.width, y: this.skillNodes.height };
  }
}