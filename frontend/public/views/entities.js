import { context, isMultiplayer } from "./index.js";

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
    context.fillStyle = !isMultiplayer ? this.color : `rgb(${this.color})`;
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

export class Enemy {
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
    context.fillStyle = `rgb(${this.color})`;
    context.fill();
    context.closePath();
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

export class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    context.fillStyle = isMultiplayer ? `rgb(${this.color})` : this.color;
    context.fill();
    context.closePath();
  }

  update() {
    this.draw();
  }
}

export class Particle {
  constructor(x, y, radius, color, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.alpha = 1;
  }
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    context.fill();
    context.closePath();
  }
  update() {
    this.draw();
    this.alpha -= 0.01;
    this.x += this.dx;
    this.y += this.dy;
  }
}
