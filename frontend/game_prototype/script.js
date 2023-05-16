import Ball from "./ball.js";
import { Paddle } from "./Paddle.js";

const ball = new Ball(document.getElementById("ball"))
const Player1Paddle = new Paddle(document.getElementById("paddle-player-1"))
const Player2Paddle = new Paddle(document.getElementById("paddle-player-2"))
const player1ScoreElem = document.getElementById("player-1-score");
const player2ScoreElem = document.getElementById("player-2-score");
let lastTime
function update(time){
	if (lastTime != null)
	{
		const delta = time - lastTime;
		ball.update(delta, [Player1Paddle.rect(), Player2Paddle.rect()]);
		// movePaddle();
		if (isLose()) handleLose();
	}
	lastTime = time;

	window.requestAnimationFrame(update);
}

let paddleVelocity = 0.01; // Variable to track paddle movement velocity

// Adjust paddle position based on velocity
function movePaddle() {
  Player1Paddle.position += paddleVelocity;
  
  // Limit paddle position within desired range (e.g., 0 to 100)
  Player1Paddle.position = Math.max(0, Math.min(100, Player1Paddle.position));
}
// document.addEventListener("mousemove", e => {
// 	Player1Paddle.position = e.y / window.innerHeight * 100;

// })

document.addEventListener("keydown", e => {
  if (e.key === "w") {
    Player1Paddle.position -= 10;
  } else if (e.key === "s") {
    Player1Paddle.position += 10;
  }

	if (e.key === "ArrowUp") {
    Player2Paddle.position -= 10;
  } else if (e.key === "ArrowDown") {
    Player2Paddle.position += 10;
  }
});

function isLose() {
	const rect = ball.rect();
	return rect.right >= window.innerWidth|| rect.left <= 0

}

function handleLose() {
	const rect = ball.rect()
	if (rect.right >= window.innerWidth){
		player1ScoreElem.textContent = parseInt(player1ScoreElem.textContent) + 1;
	}
	else
	{
		player2ScoreElem.textContent = parseInt(player2ScoreElem.textContent) + 1;
	}
	if (parseInt(player1ScoreElem.textContent) >= 5 || parseInt(player2ScoreElem.textContent) >= 5)
	{
		player1ScoreElem.textContent = "0";
		player2ScoreElem.textContent = "0";
	}
	ball.reset()
	Player1Paddle.reset();
	Player2Paddle.reset();
}
window.requestAnimationFrame(update);