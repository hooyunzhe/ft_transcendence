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
  ) {
    this.buttonClickable = true;
    this.button = scene.add
      .image(x, y, ready)
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
            this.text.setText('Ready');
          } else {
            this.button.setTexture(ready);
            this.text.setText('Unready');
          }
        }
        setTimeout(() => {
          this.buttonClickable = true;
        }, timeout);
      });
    this.text = scene.add.text(x, y, label).setOrigin(0.5).setPadding(10);
  }
}
