export class SkillNodes {
  private skillNodes: Phaser.GameObjects.Image;
  private description: Phaser.GameObjects.Text;
  private title: Phaser.GameObjects.Text;
  constructor(
    x: number,
    y: number,
    icon: string,
    title: string,
    description: string,
    scene: Phaser.Scene,
  ) {
    this.skillNodes = scene.add
      .image(x, y, icon)
      // .setOrigin(0.5)
      .setTintFill(255, 255, 255, 255)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.title.setVisible(true);
        this.description.setVisible(true);
      })
      .on('pointerout', () => {
        this.title.setVisible(false);
        this.description.setVisible(false);
      })
      .setDepth(0);

    this.title = scene.add
      .text(x, y, title, { fontFamily: 'Impact', fontSize: '24px' })
      .setBackgroundColor('#AAA')
      .setVisible(false)
      .setAlpha(0.7)
      .setDepth(1);
    this.description = scene.add
      .text(x, y + this.title.height, description, {
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
