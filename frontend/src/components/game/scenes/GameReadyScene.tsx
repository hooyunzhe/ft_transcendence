import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Button } from '../class/GameButton';
import { Socket } from 'socket.io-client';
import { SkillNodes, classType } from '../class/SkillNodes';
import { SkillTree } from '../class/SkillTree';
import SkillSelection from '../class/SkillSelection';
import GameSkillSelection from '../class/SkillSelection';

interface classSkill {
  Str: Array<Array<boolean>>;
  Agi: Array<Array<boolean>>;
  Int: Array<Array<boolean>>;
}

export default class GameReadyScene extends Phaser.Scene {
  private Socket: Socket;
  private Ready: Boolean;
  private skillState: classSkill;
  constructor(gameSocket: Socket) {
    super({ key: 'GameReadyScene' });
    this.Socket = gameSocket;
    this.Ready = false;
    this.skillState = { Str: [], Agi: [], Int: [] };
  }

  preload() {
    this.load.image('greenbutton', '/assets/ready_button_green.png');
    this.load.image('redbutton', '/assets/ready_button_red.png');
    this.load.svg('skillframe', '/assets/skillframe.svg', {
      width: Number(this.game.config.width) * 0.1,
      height: Number(this.game.config.height) * 0.1,
    });
  }

  create() {
    const emitReady = () => {
      this.Socket.emit('ready');
      console.log('ready???');
    };

    const emitUnready = () => {
      this.Socket.emit('unready');
      console.log('unready');
    };
    const readybutton1 = new Button(
      Number(this.game.config.width) / 2,
      Number(this.game.config.height) * 0.9,
      'Ready',
      this,
      'greenbutton',
      'redbutton',
      1000,
      emitReady,
      emitUnready,
    );

    // const skillNodes1 = new SkillNodes(
    //   100,
    //   100,
    //   'skillframe',
    //   'template_skill',
    //   'do this and that',
    //   this,
    // );
    // const skillTree1 = new SkillTree(
    //   [
    //     { skillframe: 'skillframe', skills: ['SKILL1', 'DO 1'] },
    //     { skillframe: 'skillframe', skills: ['SKILL2', 'DO 2'] },
    //     { skillframe: 'skillframe', skills: ['SKILL3', 'DO 3'] },
    //     { skillframe: 'skillframe', skills: ['SKILL4', 'DO 4'] },
    //   ],
    //   this,
    //   { x: 100, y: 100 },
    // );
    // const skillTree2 = new SkillTree(
    //   [
    //     { skillframe: 'skillframe', skills: ['SKILL1', 'DO 1'] },
    //     { skillframe: 'skillframe', skills: ['SKILL2', 'DO 2'] },
    //     { skillframe: 'skillframe', skills: ['SKILL3', 'DO 3'] },
    //     { skillframe: 'skillframe', skills: ['SKILL4', 'DO 4'] },
    //   ],
    //   this,
    //   { x: 300, y: 100 },
    // );
    const setSkillState = (
      classType: classType,
      level: number,
      index: number,
      action: boolean,
    ) => {
      switch (action) {
        case true: {
          if (level - 1 >= 0) {
            console.log(this.skillState[classType][level - 1], index);
            if (
              this.skillState[classType][level - 1].some(
                (value) => value === false,
              )
            )
              break;
          }
          this.skillState[classType][level][index] = action;
          break;
        }
        default:
          if (level + 1 <= this.skillState[classType].length - 1) {
            console.log(this.skillState[classType][level + 1], index);
            if (
              this.skillState[classType][level + 1].some(
                (value) => value === true,
              )
            )
              break;
          }
          this.skillState[classType][level][index] = action;
          break;
      }
      return this.skillState[classType][level][index];
    };

    const SkillSelection = new GameSkillSelection(
      Number(this.game.config.width),
      Number(this.game.config.height),
      this,
      'skillframe',
      setSkillState,
    );

    this.skillState = SkillSelection.getSkillState();
    SkillSelection.printTreeState();
    const createCountdown = () => {
      let start = 5;
      const text = this.add
        .text(
          Number(this.game.config.width) / 2,
          Number(this.game.config.height) / 2,
          String(start),
          {
            fontFamily: 'impact',
            fontSize: '128px',
          },
        )
        .setAlpha(0.5)
        .setOrigin(0.5)
        .setDepth(3);
      const inter = setInterval(() => {
        start--;
        text.setText(String(start));
        if (start == 0) {
          clearInterval(inter);
          this.Ready = true;
        }
      }, 1000);
    };

    this.Socket.on('start', () => {
      createCountdown();
    });

    return () => {
      this.Socket.off('start');
    };
  }
  update() {
    if (this.Ready === true) this.scene.start('MainScene');
  }
}
