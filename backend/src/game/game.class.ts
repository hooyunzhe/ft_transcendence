import { Server } from 'socket.io';
import { MatchInfo } from './game.service';
import { CreateMatchDto } from 'src/match/dto/create-match.dto';

interface Coor {
  x: number;
  y: number;
}

class Player {
  player: number;
  cooldown: NodeJS.Timer;
  paddleSize: number = 1;
  paddleSpeed: number = 1;
  ballSpeed: number = 1;
  activated: boolean = false;
  activeSkill: (player: number) => boolean | null = null;

  constructor(classes: number, player: number, activeSkill?: (player: number) => boolean)
  {
    this.activeSkill = activeSkill;
    this.player = player;
    switch (classes) {
      case 1:
          this.paddleSize = 1.2;
        break;
      case 2:
          this.paddleSpeed = 1.2;
        break;
      case 3:
          this.ballSpeed = 1.2;
        break;
      default:
        break;
    }

  }

}

class RectObj {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    player?: number,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 1;
    this.velocityY = 1;
    this.player = player;
  }

  left() {
    return this.x - this.width / 2;
  }

  right() {
    return this.x + this.width / 2;
  }

  top() {
    return this.y - this.height / 2;
  }

  bottom() {
    return this.y + this.height / 2;
  }

  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  player: number;
}

export class GameClass {
  matchHandler: (matchDto: CreateMatchDto) => void;
  socketHandler: (roomid: string, message: string, data: any) => void;
  timeFactor: number = 1;
  windowSize: Coor;
  direction: Coor;
  ball: RectObj; 
  playerClass : {player1: Player, player2: Player}
  paddleClass : {paddle1: RectObj, paddle2: RectObj}
  velocity: number;
  score: { player1: number; player2: number };
  matchinfo: MatchInfo;
  server: Server;
  intervalID: NodeJS.Timer = null;
  ServingPaddle: Number = 1;
  refreshMilisec: number = 16;
  loaded: { player1: boolean; player2: boolean } = {
    player1: false,
    player2: false,
  };
  started: boolean = false;
  slowed: boolean = false;
  inverted: boolean = false;

  constructor(
    matchinfo: MatchInfo,
    socketHandler: (roomid: string, message: string, data: any) => void,
    matchHandler: (matchDto: CreateMatchDto) => void,
  ) {
    this.windowSize = {
      x: 1920,
      y: 1080,
    };
    this.direction = {
      x: 0,
      y: 0,
    };

    this.velocity = 15;
    this.score = {
      player1: 0,
      player2: 0,
    };
    this.paddleClass.paddle1 = new RectObj(
      this.windowSize.x * 0.05,
      this.windowSize.y / 2,
      20,
      160,
      1,
    );
    this.paddleClass.paddle2 = new RectObj(
      this.windowSize.x * 0.95,
      this.windowSize.y / 2,
      20,
      160,
      2,
    );

    this.ball = new RectObj(
      10 + (this.paddleClass.paddle1.right() + 30),
      this.windowSize.y / 2,
      60,
      60,
    );
    this.matchinfo = matchinfo;
    this.socketHandler = socketHandler;
    this.matchHandler = matchHandler;
  }

  gameStart(player: number) {
    if (!this.started && this.loaded.player1 && this.loaded.player2) {
      if (player === this.ServingPaddle) {
        this.direction = {
          x: (this.ball.x - this.windowSize.x / 2) / this.windowSize.x,
          y: (this.windowSize.y / 2 - this.ball.y) / this.windowSize.y,
        };
        console.log(this.direction);
        this.started = true;
      }
    }
  }
  gameReset() {
    switch (this.ServingPaddle) {
      case 2:
        this.ball.x = this.paddleClass.paddle2.left() - this.ball.width / 2 - 10;
        break;
      default:
        this.ball.x = 10 + (this.paddleClass.paddle1.right() + this.ball.width / 2);
        break;
    }

    this.started = false;
    this.ball.y = this.windowSize.y / 2;
    this.paddleClass.paddle1.y = this.windowSize.y / 2;
    this.paddleClass.paddle2.y = this.windowSize.y / 2;
    this.direction = {
      x: 0,
      y: 0,
    };
  }

  gamePaddleConstruct(
    paddle1size: { width: number; height: number },
    paddle2size: { width: number; height: number },
  ) {
    this.paddleClass.paddle1 = new RectObj(
      15,
      this.windowSize.y / 2,
      paddle1size.width,
      paddle1size.height,
    );
    this.paddleClass.paddle2 = new RectObj(
      this.windowSize.x - 15,
      this.windowSize.y / 2,
      paddle2size.width,
      paddle2size.height,
    );
    console.log(paddle1size.width, paddle2size.width);
  }

  gameRefresh() {
    this.ball.x += this.direction.x * this.velocity * this.timeFactor;
    this.ball.y += this.direction.y * this.velocity * this.timeFactor;
    if (this.ball.top() <= 0 || this.ball.bottom() >= this.windowSize.y)
      this.direction.y *= -1;
    if (this.ball.right() < 0) {
      this.gameHandleVictory(2);
    }
    if (this.ball.left() > this.windowSize.x) {
      this.gameHandleVictory(1);
    }
    if (
      (this.gameCollision(this.ball, this.paddleClass.paddle1) && this.direction.x < 0) ||
      (this.gameCollision(this.ball, this.paddleClass.paddle2) && this.direction.x > 0)
    ) {
      this.direction.x *= -1;
    }
    this.socketHandler(this.matchinfo.roomid, 'game', {
      ball: {
        x: this.ball.x,
        y: this.ball.y,
      },
      balldirection: {
        x: this.direction.x,
        y: this.direction.y,
      },
      timestamp: Date.now(),
      paddle1: { x: this.paddleClass.paddle1.x, y: this.paddleClass.paddle1.y },
      paddle2: { x: this.paddleClass.paddle2.x, y: this.paddleClass.paddle2.y },
      score: this.score,
    });
  }

  gameUpdate() {
    this.intervalID = setInterval(() => {
      this.gameRefresh();
    }, 16);
  }

  gameHandleVictory(player: number) {
    this.score[`player${player}`]++;
    if (this.score[`player${player}`] >= 3) {
      this.socketHandler(this.matchinfo.roomid, 'victory', player);

      this.matchHandler({
        p1_id: this.matchinfo.player1,
        p2_id: this.matchinfo.player2,
        winner_id: this.matchinfo[`player${player}`],
        p1_score: this.score.player1,
        p2_score: this.score.player2,
        p1_skills: '1231',
        p2_skills: '1231',
      });
    }
    this.ServingPaddle = player;
    console.log(
      'Player 1: ',
      this.score.player1,
      ' | Player 2: ',
      this.score.player2,
    );
    this.gameReset();
    this.socketHandler(this.matchinfo.roomid, 'reset', player);
    this.loaded = { player1: false, player2: false };
  }

  stickEffect(paddle: RectObj) {
    if (this.started === false && paddle.player === this.ServingPaddle)
      this.ball.y = paddle.y;
  }

  gameSetPosition(x: number, y: number) {
    this.ball.x = x;
    this.ball.y = y;
  }

  gameSetPaddlePosition(player: number, direction: number) {
    if (this.loaded.player1 && this.loaded.player2) {
     this.gameMovePaddle(this.paddleClass[`paddle${player}`], 10 * direction * this.timeFactor * this.playerClass[`player${player}`].paddleSpeed);
    }
  }

  activeStickyPaddle = (player: number) => {
    if (Math.abs(this.paddleClass[`paddle${player}`] - this.ball.x) < 30)
      this.ball.y = this.paddleClass[`paddle${player}`].y;

  }

  activeSlowTime = (player: number) => {
    if (!this.slowed)
    {
      this.timeFactor = 0.5
      this.slowed = true;
      const timer = setTimeout(() => {
        this.timeFactor = 1;
        this.slowed = false;
      }, 5000);

      return (() => {
        clearTimeout (timer);
      }
    )}
  }

  activeInvertPaddle = (player: number) => {
    let opponent: number;

    switch (player) {
      case 1:
        opponent = 2;
        break;
    
      default:
        opponent = 1;
        break;
    }
    if (this.playerClass[`player${opponent}`].paddleSpeed > 0 && !this.inverted)
    {
      this.inverted = true;
      this.playerClass[`player${opponent}`].paddleSpeed * -1;
      const timer = setTimeout(() => {
        this.inverted = false;
        this.playerClass[`player${opponent}`].paddleSpeed * -1;
      }, 5000)

      return (() => {
        clearTimeout(timer);
      })
    }
  }

  gameSetClass(player: number, classes: number)
  {
    switch (classes) {
      case 1:
        this.playerClass[`player${player}`] = new Player(classes, player);
        break;
      case 2:
        this.playerClass[`player${player}`] = new Player(classes, player);
        break;
      case 3:
        this.playerClass[`player${player}`] = new Player(classes, player);
        break;
      default:
        this.playerClass[`player${player}`] = new Player(0, null);
        break;
    }
    
  }

  gameActiveSkill(player: number)
  {
    if (this.started && this.playerClass[`player${player}`].activeSkill())
    {
      if (this.playerClass[`player${player}`].activeSkill(player))
      {
        this.playerClass[`player${player}`].activated = true
        this.playerClass[`player${player}`].cooldown = setTimeout(() => {
          this.playerClass[`player${player}`].activated = false;
      }, 30000);

      return (() => clearTimeout( this.playerClass[`player${player}`].cooldown));
      }
    }
  }
  gameSetLoaded(player: number, loaded: boolean) {
    this.loaded[`player${player}`] = loaded;
  }

  gameMovePaddle(obj: RectObj, dir: number) {
    if (obj.top() + dir >= 0 && obj.bottom() + dir <= this.windowSize.y) {
      obj.y += dir;
      this.stickEffect(obj);
    } else if (dir > 0) obj.y = this.windowSize.y - obj.height / 2;
    else if (dir < 0) obj.y = obj.height / 2;
  }

  gameCollision(obj1: RectObj, obj2: RectObj) {
    return (
      obj1.left() <= obj2.right() &&
      obj1.right() >= obj2.left() &&
      obj1.top() <= obj2.bottom() &&
      obj1.bottom() >= obj2.top()
    );
  }
}
