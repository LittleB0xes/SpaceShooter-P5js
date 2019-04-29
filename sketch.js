
const MAX_ENEMY = 8;
const MAX_LIFE = 3;

let spaceShip;
let boss;
let enemies = [];
let bullets = [];
let bonus = [];
let explosions = [];
let enemyBullets = [];
let explosionAnim = [];
let bonusImg = [];
let spaceShipImg;
let bossImg = [];
let bulletImg;
let bulletEnemyImg;
let enemyImg1;
let enemyImg1b;
let enemyImg2;
let enemyImg3;
let state = 0;
let stars = [];

function preload() {
	spaceShipImg = loadImage('assets/spaceShip.png');
	bulletImg = loadImage('assets/bullet.png');
	bulletEnemyImg = loadImage('assets/bullet2.png');
	enemyImg1 = loadImage('assets/enemy1.png');
	enemyImg1b = loadImage('assets/enemy1b.png');
	enemyImg2 = loadImage('assets/enemy2.png');
	enemyImg3 = loadImage('assets/enemy3.png');
	myFont = loadFont('assets/8-bit-pusab.ttf');
	for (let i = 1; i<7; i++) {
		explosionAnim.push(loadImage('assets/expl'+i+'.png'));
	}
	bonusImg[0] = loadImage('assets/bonus0.png');
	bossImg[0] = loadImage('assets/boss0.png');

	
}

function setup() {
	frameRate(30);
	createCanvas(400,600);

	spaceShip = new SpaceShip(MAX_LIFE);
	for (let i=0; i<MAX_ENEMY; i++) {
		enemies[i] = new Enemy();
	}
	for (let i = 0; i<150; i++) {
		stars[i] = new Star(random(0, width), random(-height, height));
	}
}

function draw() {
	background(5,0,12);
	if (state == 0) {
		// Final Screen
		
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
		
		

		//Score and Life
		
		mouvementOfStars();
		spaceShip.show();
		spaceShip.move();
		if (spaceShip.life <= 0) {
			state = 99;
		}


		//Enemy's move
		for (enemy of enemies) {
			enemy.move();
			if (enemy.fire()) {
				enemyBullets.push(new EnemyBullet(enemy.x, enemy.y, enemy.radius));
			}
			
			enemy.show();
		}


		// Bonus
		if (random(1,100) <= 2) {
			bonus.push(new Bonus);
		}
		for (i = 0; i < bonus.length; i++) {
			bonus[i].move();
			bonus[i].show();
			if (intersectWith(bonus[i], spaceShip)) {
				bonus[i].effect(spaceShip);
				bonus[i].y = -10;
			}
			if (bonus[i].y < 0) {
				bonus.splice(1, i);
			}
		}


		//Eplosion draw
		for (let i = 0; i < explosions.length; i++) {
			//explosion(explosions[i].x, explosions[i].y, explosions[i].z);
			if (explosions[i].z + 6 > frameCount) {
				//console.log('explose');
				explosion(explosions[i].x, explosions[i].y, explosions[i].z);
			} else {
				explosions.splice(i,1);
			}
			
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
		bulletMove();
	
		// Enemy's bullet
		bulletEnemyMove();
		

		
		

	} else if (state = 99) {
		// Final Screen
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

function intersectWith(object1, object2) {
	let distance = dist(object1.x, object1.y, object2.x, object2.y);
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

function explosion(x,y, startFrame) {
	image(explosionAnim[(frameCount - startFrame) % 6], x, y);
}

function bulletMove() {
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].move();
		bullets[i].show();
		for (let j = 0; j < enemies.length; j++) {
			if (intersectWith(bullets[i], enemies[j])) {
				bullets[i].y = - 10;
				enemies[j].life -=1;
				if (enemies[j].life == 0) {
					explosions.push(createVector(enemies[j].x,enemies[j].y, frameCount));
					enemies[j].reborn();
					spaceShip.score += enemies[j].point;
				}
				
			}
		}
	}
	// Remove bullet when it's out of screen
	for (i = 0; i < bullets.length; i++) {
		if (bullets[i].y < 0) {
			bullets.splice(i, 1);
		}
	}
}

function bulletEnemyMove(){
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
	for (i = 0; i < enemyBullets.length; i++) {
		if (enemyBullets[i].y > height) {
			enemyBullets.splice(i, 1);
		}
	}
}

class SpaceShip {
	constructor(life) {
		this.x = width / 2;
		this.y = height - 30;
		this.speed = 10;
		this.direction = 0;
		this.upDown = 0;
		this.life = life;
		this.score = 0;
		this.radius = 22;
	}

	show() {
		image(spaceShipImg, this.x-this.radius, this.y-this.radius);
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

class Bonus {
	constructor(type = 0) { //random ensuite
		this.x = random(10, width - 10);
		this.y = -10;
		this.speed = 6;
		this.type = type;
		this.radius = 9;
	}

	move(){
		this.y += this.speed;
	}

	show() {
		image(bonusImg[0], this.x - this.radius, this.y - this.radius);
	}

	effect(player) {
		player.life +=1;

	}
}

class Bullet {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY - 10;
		this.speed = 12;
		this.radius = 4;
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
		this.speedBullet = 15;
		this.radius = 6;
	}

	show() {
		image(bulletEnemyImg, this.x-3, this.y-3);
	}
	move() {
		this.y += this.speedBullet;
	}
}

class Enemy{
	constructor() {
		this.reborn();
		/*this.x = random(10, width -10);
		this.y = random(-10, -400);
		
		let enemyLottery = random(1,10);
		this.image = {}
		if (enemyLottery >= 1 && enemyLottery < 4 ) {
			this.type = 1;
			this.speed = random(4,8);
			this.image = enemyImg1;
			this.life = 2;
			this.point = 2;
			this.radius = 20;
			this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
		} else if (enemyLottery >= 4 && enemyLottery < 9 ) {
			this.type = 2;
			this.speed = random(8,12);
			this.image = enemyImg2;
			this.life = 1;
			this.point = 1;
			this.radius = 18;
		} else if (enemyLottery >= 9 && enemyLottery <= 10 ) {
			this.type = 3;
			this.speed = random(6,10);
			this.image = enemyImg3;
			this.life = 1;
			this.point = 3;
			this.radius = 17;
		}*/
	}

	reborn() {
		this.x = random(10, width -10);
		this.y = random(-40, -400);
		
		let enemyLottery = random(1,10);
		this.image = {}
		if (enemyLottery >= 1 && enemyLottery < 4 ) {
			this.type = 1;
			this.speed = random(4,8);
			this.image = enemyImg1;
			this.life = 2;
			this.point = 2;
			this.radius = 20;
			this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
		} else if (enemyLottery >= 4 && enemyLottery < 9 ) {
			this.type = 2;
			this.speed = random(8,12);
			this.image = enemyImg2;
			this.life = 1;
			this.point = 1;
			this.radius = 18;
		} else if (enemyLottery >= 9 && enemyLottery <= 10 ) {
			this.type = 3;
			this.speed = random(6,10);
			this.image = enemyImg3;
			this.life = 1;
			this.point = 3;
			this.radius = 17;
		}
	}

	move() {
		if (this.type == 1 && this.life == 1) {
			this.image = enemyImg1b;
			this.y +=this.speed;
			this.x += this.speed * this.dirPostHit;
		}else if (this.type == 3) {
			this.y +=this.speed;
			this.x = 0.5 * width * (1+  cos(5 * this.y / width ));
			/*if (random(0,25) < 1 && this.y > 0) {
				enemyBullets.push(new EnemyBullet(this.x, this.y, this.radius));
			}*/
		} else {
			this.y +=this.speed;
		}
	}

	fire() {
		if (this.type == 3) {
			if (random(0,25) < 1 && this.y > 0) {
				return true;
			}
		}
		return false;
	}

	show() {
		image(this.image, this.x-15, this.y-15);
	}
}

class Boss {
	constructor() {

	}
	show() {

	}
	move() {

	}
}

class Star {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY;
		this.speed =  random(1,4);
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
  		fill(20 * this.speed /2 ,0,125 * this.speed /2);
		ellipse(this.x,this.y, this.speed , this.speed);
	}
}