import { Sprite, Projectile } from "./entities.js";
import { getDistanceBetweenTwoPoints } from "./utils.js";

const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let player1;
let enemies = new Array();
let projectiles = new Array();
const mouse = {
  x: undefined,
  y: undefined,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

addEventListener("click", (event) => {
  const x = innerWidth / 2;
  const y = innerHeight / 2;
  const radius = 5;

  const alpha = Math.atan2(event.clientY - y, event.clientX - x);
  const sinOfAngle = Math.sin(alpha);
  const cosOfAngle = Math.cos(alpha);

  const velocity = {
    dx: cosOfAngle,
    dy: sinOfAngle,
  };

  const projectile = new Projectile(x, y, velocity, radius, "red");

  projectiles.push(projectile);
  console.log(projectiles);
});

// Objects

// Implementation
const image = new Image();

function init() {
  enemies = [];

  const enemyimg = new Image();
  enemyimg.src =
    "https://i.pinimg.com/originals/82/9d/ac/829dac4271fc6271be9b12c911a55497.jpg";
  const image = new Image();
  image.src = "player.png";

  player1 = new Sprite(image, innerWidth / 2, innerHeight / 2, 50, 50);
  // initialize enemies

  for (let index = 0; index < 30; index++) {
    enemies.push(
      new Sprite(
        enemyimg,
        Math.random() * innerWidth,
        Math.random() * innerHeight,
        50,
        50
      )
    );
  }

  // restart player coordinates
  player1.x = innerWidth / 2;
  player1.y = innerHeight / 2;
  player1.image = image;
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player1.update();

  if (projectiles.length > 0) {
    projectiles.forEach((projectile, index) => {
      if (
        projectile.x > innerWidth ||
        projectile.x < 0 ||
        projectile.y > innerHeight ||
        projectile.y < 0
      ) {
        projectiles.splice(index, 1);
      } else {
        projectile.update();
      }
    });
  }
  enemies.forEach((enemy, index) => {
    enemy.update();
  });
}

init();
animate();
