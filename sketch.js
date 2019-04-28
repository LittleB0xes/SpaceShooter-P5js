
const MAX_ENEMY = 13;

let spaceShip;
let enemies = [];
let bullets = [];
let enemyBullets = [];
let spaceShipImg;
let bulletImg;
let bulletEnemyImg;
let enemyImg1;
let enemyImg2;
let enemyImg3;
let state = 0;
let stars = [];

function preload() {
	spaceShipImg = loadImage('assets/spaceShip.png');
	bulletImg = loadImage('assets/bullet.png');
	bulletEnemyImg = loadImage('assets/bullet2.png');
	enemyImg1 = loadImage('assets/enemy1.png');
	enemyImg2 = loadImage('assets/enemy2.png');
	enemyImg3 = loadImage('assets/enemy3.png');
	myFont = loadFont('assets/8-bit-pusab.ttf');
}

function setup() {
	//frameRate(60);
	createCanvas(400,600);

	spaceShip = new SpaceShip();
	for (i=0; i<MAX_ENEMY; i++) {
		enemies[i] = new Enemy();
	}
	for (let i = 0; i<150; i++) {
		stars[i] = new Star(random(0, width), random(-height, height));
	}
}

function intersectWith(object1, object2) {
	distance = dist(object1.x, object1.y, object2.x, object2.y);
	if (distance < object1.radius + object2.radius) {
		return true;
	} else {
		return false;
	}
}
function mouvementOfStars() {
	for (star of stars) {
			star.move();
			star.show();
		}
}

function draw() {
	if (state == 0) {
		// Final Screen
		background(0);
		mouvementOfStars();
		fill(255);
		textFont(myFont);
		textSize(28);
		textStyle(BOLD);
		textAlign(CENTER);
		text("SpaceShooter", width / 2,150);
		textSize(12);
		text("Press 'Return' to start", width / 2,300);
		text("Arrows to move", width / 2,350);
		text("Space bar to fire", width / 2,400);

		text("By LittleBoxes - 2019", width / 2,height - 30);
	} else if (state == 1) {
		background(0);
		

		//Score and Life
		
		mouvementOfStars();
		spaceShip.show();
		spaceShip.move();
		if (spaceShip.life == 0) {
			state = 99;
		}

		//Enemy's move
		for (enemy of enemies) {
			enemy.move();
			enemy.show();
		}

		fill(255);
		textFont(myFont);
		textStyle(BOLD);
		text(spaceShip.score, 30,30);
		text("Life : " + spaceShip.life, 300,30);


		// Enemy out of screen
		for (let i = 0; i < enemies.length; i++) {
			if (intersectWith(spaceShip, enemies[i])) {
				background(255,0,0);
				spaceShip.life -=1;
				enemies[i].reborn();
			}
			if (enemies[i].y >height) {
				enemies[i].reborn();
			}
		}
		// Bullet's move
		for (let i = 0; i < bullets.length; i++) {
			bullets[i].move();
			bullets[i].show();
			for (let j = 0; j < enemies.length; j++) {
				if (intersectWith(bullets[i], enemies[j])) {
					bullets[i].y = - 10;
					enemies[j].life -=1;
					if (enemies[j].life == 0) {
						enemies[j].reborn();
						spaceShip.score += enemies[j].point;
					}
					
				}
			}
		}

		// Enemy's bullet
		for (bullet of enemyBullets) {
			bullet.move();
			bullet.show();
			if (intersectWith(bullet, spaceShip)) {
				// Go out of the screen
				bullet.y = height +10;
				spaceShip.life -=1;
				background(255,0,0);
			}
		}

		// Remove bullet when it's out of screen
		for (i = 0; i < bullets.length; i++) {
			if (bullets[i].y < 0) {
				bullets.splice(i, 1);
			}
		}
		for (i = 0; i < enemyBullets.length; i++) {
			if (enemyBullets[i].y > height) {
				enemyBullets.splice(i, 1);
			}
		}

	} else if (state = 99) {
		// Final Screen
		background(0);
		mouvementOfStars();
		for (enemy of enemies) {
			enemy.move();
			enemy.show();
		}
		fill(255);
		textFont(myFont);
		textSize(12);
		text(spaceShip.score, 30,30);
		textSize(32);
		textStyle(BOLD);
		textAlign(CENTER);
		text("GAME OVER", width / 2,150);
		textSize(12);
		text("Press 'Return' to restart", width / 2,300);


	}
	
		
}

function keyPressed() {
	if (state == 0) {
		if (keyCode === RETURN) {
			state = 1;
		}
	}else if(state ==1) {
		if (keyCode === LEFT_ARROW) {
			spaceShip.direction = -1;
		} else if (keyCode === RIGHT_ARROW) {
			spaceShip.direction = 1;
		}

		if (keyCode === UP_ARROW) {
			spaceShip.upDown = -1;
		} else if (keyCode === DOWN_ARROW) {
			spaceShip.upDown = 1;
		}

		if (key === ' ') {
			bullets.push(new Bullet(spaceShip.x, spaceShip.y));
		}
	} else if (state == 99) {
		if (keyCode === RETURN) {
			state = 1;
			enemies = [];
			bullets = [];
			enemyBullets = [];
			setup();
		}
	}
}

function keyReleased() {
	if (keyCode === LEFT_ARROW) {
		spaceShip.direction = 0;
	} else if (keyCode === RIGHT_ARROW) {
		spaceShip.direction = 0;
	}

	if (keyCode === UP_ARROW) {
		spaceShip.upDown = 0;
	} else if (keyCode === DOWN_ARROW) {
		spaceShip.upDown = 0;
	}
}

class SpaceShip {
	constructor(initX = width / 2, initY = height - 30) {
		this.x = initX;
		this.y = initY;
		this.speed = 5;
		this.direction = 0;
		this.upDown = 0;
		this.life = 3;
		this.score = 0;
		this.radius = 15;
	}

	show() {
		image(spaceShipImg, this.x-15, this.y-15);
	}

	move() {
		if (this.x >= 10 && this.x <= width - 10) {
			this.x += this.speed * this.direction;
		}  else if (this.x < 10) {
			this.x = 10;
		} else if (this.x > width - 10) {
			this.x = width -10;
		}

		if (this.y >= height - 300 && this.y <= height - 30) {
			this.y += this.speed * this.upDown;
		}  else if (this.y > height - 30) {
			this.y = height - 30;
		} else if (this.y < height - 300) {
			this.y = height - 300;
		}
	}
}

class Bullet {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY - 10;
		this.speed = 5;
		this.radius = 3;
	}

	show() {
		image(bulletImg, this.x-3, this.y-3);
	}
	move() {
		this.y -= this.speed;
	}
}

class EnemyBullet {
	constructor(initX, initY, offset = 15) {
		this.x = initX;
		this.y = initY - offset;
		this.speed = 5;
		this.radius = 3;
	}

	show() {
		image(bulletEnemyImg, this.x-3, this.y-3);
	}
	move() {
		this.y += this.speed;
	}
}

class Enemy{
	constructor() {
		this.x = random(10, width -10);
		this.y = random(-10, -400);
		
		let enemyLottery = random(1,10);
		this.image = {}
		if (enemyLottery >= 1 && enemyLottery < 4 ) {
			this.type = 1;
			this.speed = random(2,4);
			this.image = enemyImg1;
			this.life = 2;
			this.point = 2;
			this.radius = 15;
		} else if (enemyLottery >= 4 && enemyLottery < 9 ) {
			this.type = 2;
			this.speed = random(4,6);
			this.image = enemyImg2;
			this.life = 1;
			this.point = 1;
			this.radius = 15;
		} else if (enemyLottery >= 9 && enemyLottery <= 10 ) {
			this.type = 3;
			this.speed = random(3,5);
			this.image = enemyImg3;
			this.life = 1;
			this.point = 1;
			this.radius = 15;
		}
	}

	reborn() {
		this.x = random(10, width -10);
		this.y = random(-10, -400);
		
		let enemyLottery = random(1,10);
		this.image = {}
		if (enemyLottery >= 1 && enemyLottery < 4 ) {
			this.type = 1;
			this.speed = random(2,4);
			this.image = enemyImg1;
			this.life = 2;
			this.point = 2;
			this.radius = 15;
		} else if (enemyLottery >= 4 && enemyLottery < 9 ) {
			this.type = 2;
			this.speed = random(4,6);
			this.image = enemyImg2;
			this.life = 1;
			this.point = 1;
			this.radius = 15;
		} else if (enemyLottery >= 9 && enemyLottery <= 10 ) {
			this.type = 3;
			this.speed = random(3,5);
			this.image = enemyImg3;
			this.life = 1;
			this.point = 1;
			this.radius = 15;
		}
	}

	move() {
		if (this.type == 3) {
			this.y +=this.speed;
			this.x = 0.5 * width * (1+  cos(5 * this.y / width ));
			if (Math.round(random(1,50)) == 1 && this.y > 0) {
				enemyBullets.push(new EnemyBullet(this.x, this.y));
			}
		} else {
			this.y +=this.speed;
		}
	}

	show() {
		image(this.image, this.x-15, this.y-15);
	}
}

class Star {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY;
		this.speed =  random(0.5,2);
	}

	move() {
		this.y += this.speed;
		if (this.y > height) {
			this.y = random(-50,0);
			this.x = random(0, width);
		}
	}

	show() {
		noStroke();
  		fill(30,0,125 * this.speed);
		ellipse(this.x,this.y,2* this.speed ,2 * this.speed);
	}
}