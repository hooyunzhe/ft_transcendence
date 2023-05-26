const INITIAL_VELOCITY = .025;
const VELOCITY_INC = 0.00001;

export default class Ball {
	constructor(ballElem) {
		this.ballElem = ballElem;
		this.reset();
	}

	rect() {
		return this.ballElem.getBoundingClientRect();
	}
	get x() {
		return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
	}

	set x(value) {
		this.ballElem.style.setProperty("--x", value);
	}

	get y() {
		return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
	}

	set y(value) {
		this.ballElem.style.setProperty("--y", value);
	}
	reset() {
		this.y = 50;
		this.x = 50;
		this.direction = { x: 0}
		while (Math.abs(this.direction.x) <= 0.2 || Math.abs(this.direction.x) >= 0.9) {
			const heading = randomNumberBetween(0, 2 * Math.PI);
			this.direction = { x: , y: Math.sin(heading) };
		}
		this.velocity = INITIAL_VELOCITY;
	}



	update(delta, paddlerects) {
		this.x += this.direction.x * this.velocity * delta
		this.y += this.direction.y * this.velocity * delta
		if (this.velocity < 0.05)
			this.velocity += VELOCITY_INC * delta;
		const rect = this.rect()

		if (rect.bottom >= window.innerHeight || rect.top <= 0) 
			this.direction.y *= -1;

		if (paddlerects.some(r => isCollision(r, rect))) {
			this.direction.x *= -1;
		}
	}
}


function randomNumberBetween(min, max) {
	return Math.random() * (max - min) + min;	
}

function isCollision(rect1, rect2) {
	return (
		rect1.left <= rect2.right && 
		rect1.right >= rect2.left && 
		rect1.top <= rect2.bottom && 
		rect1.bottom >= rect2.top
	)
}
