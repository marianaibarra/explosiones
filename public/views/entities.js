import { c } from "./index.js";

export class Sprite {
  constructor(image, x, y, height, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  draw() {
    c.drawImage(
      this.image,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
  }
}

export class Projectile {
  constructor(x, y, velocity, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.x += this.velocity.dx;
    this.y += this.velocity.dy;

    this.draw();
  }
}
