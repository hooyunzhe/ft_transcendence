export class Button {
  private button: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;
  private buttonClickable: Boolean;
  constructor(
    x: number,
    y: number,
    label: string,
    scene: Phaser.Scene,
    ready: string,
    unready: string,
    timeout: number,
    callback1: () => void,
    callback2: () => void,
  ) {
    this.buttonClickable = true;
    this.button = scene.add
      .image(x, y, unready)
      .setOrigin(0.5)
      .setScale(0.1)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.text.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => this.text.setStyle({ fill: '#FFF' }))
      .on('pointerdown', () => {
        if (this.buttonClickable) {
          this.buttonClickable = false;
          if (this.button.texture.key === ready) {
            this.button.setTexture(unready);
            callback2();
          } else {
            this.button.setTexture(ready);
            callback1();
          }
        }
        setTimeout(() => {
          this.buttonClickable = true;
        }, timeout);
      });
    this.text = scene.add.text(x, y, label).setOrigin(0.5).setPadding(10);
  }
}
