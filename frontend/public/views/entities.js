import { context } from "./index.js";

export class Projectile {
  constructor(x, y, velocity, radius, color, collided) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.collided = collided;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }

  update() {
    if (this.collided) {
    } else {
      this.x += this.velocity.dx;
      this.y += this.velocity.dy;
    }

    this.draw();
  }
}

export class Enemy extends Projectile {
  constructor(x, y, velocity, radius, color, collided) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.collided = collided;
  }

  draw() {
    super.draw();
  }

  update() {
    if (this.collided) {
      this.radius -= 10;
    } else {
      this.x += this.velocity.dx;
      this.y += this.velocity.dy;
    }

    this.draw();
  }
}

export class Player extends Projectile {
  constructor(x, y, radius, color) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    super.draw();
  }

  update() {
    this.draw();
  }
}
