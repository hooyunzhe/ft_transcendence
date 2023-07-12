export default class extends Phaser.Scene {
  private countDowned: boolean;

  constructor() {
    super({ key: 'countdown' });
    this.countDowned = false;
  }
  preload() {}
  create() {
    const text = this.add.text(
      Number(this.game.config.width) / 50,
      Number(this.game.config.width) / 50,
      '5',
      {
        fontFamily: 'Lucida Grande',
        fontSize: '128px',
      },
    );
  }
  update() {
    if (this.countDowned == true) 
  }
}
