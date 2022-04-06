import { Projectile, Player } from "./entities.js";
import { getDistanceBetweenTwoPoints, moveToPoint } from "./utils.js";

const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");

// Adjust canvas to be full screen
canvas.width = innerWidth;
canvas.height = innerHeight;

// Objects
let player1;
let enemies = new Array();
let projectiles = new Array();
let animationFrame;
let numberOfEnemies = 10;

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
  // Adjust canvas size on resize to be full screen
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

addEventListener("click", (event) => {
  // If there's no enemies is game lose
  if (enemies.length > 0) {
    // Click event spawns new projectile
    const x = innerWidth / 2;
    const y = innerHeight / 2;
    const radius = 5;
    // moveToPoint func it's the pythagoras theorem to get the distance btw the click and the player position
    // Creates a smooth animation
    const velocity = moveToPoint(event.clientX, x, event.clientY, y);

    const projectile = new Projectile(x, y, velocity, radius, "red", false);

    projectiles.push(projectile);
  }
});

// Implementation
function init() {
  // Init is called on resize, enemies are spawened again and enemies array must be restarted
  enemies = [];

  // Initialize player
  player1 = new Player(innerWidth / 2, innerHeight / 2, 30, "purple");

  // initialize enemies
  //FIXME:
  // - Spawn enemies within x = 0 | x = innerWidth & y = 0 | y = innerHeight

  for (let index = 0; index < numberOfEnemies; index++) {
    const x = Math.random() * innerWidth;
    const y = Math.floor(Math.random() - 0.5) === 0 ? 0 : innerHeight;
    const velocityOfEnemy = moveToPoint(player1.x, x, player1.y, y);
    enemies.push(new Projectile(x, y, velocityOfEnemy, 20, "green", false));
  }

  // restart player coordinates
  player1.x = innerWidth / 2;
  player1.y = innerHeight / 2;
}

// Animation Loop
function animate() {
  animationFrame = requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // animate player
  player1.update();

  // animete projectiles
  if (projectiles.length > 0) {
    projectiles.forEach((projectile, projectileIndex) => {
      // if projectiles go off screen, delete them from array
      if (
        projectile.x > innerWidth ||
        projectile.x < 0 ||
        projectile.y > innerHeight ||
        projectile.y < 0
      ) {
        projectiles.splice(projectileIndex, 1);
      } else {
        // Verify collision of shoot on every enemy
        enemies.forEach((enemy, enemyIndex) => {
          if (
            getDistanceBetweenTwoPoints(
              projectile.x,
              projectile.y,
              enemy.x,
              enemy.y
            ) <= enemy.radius
          ) {
            projectile.collided = true;
            enemy.collided = true;

            setTimeout(() => {
              enemies.splice(enemyIndex, 1);
              projectiles.splice(projectileIndex, 1);
            }, 0);
          }
        });
        projectile.update();
      }
    });
  }

  // animate enemies
  enemies.forEach((enemy, index) => {
    // if enemy collide with player is game lose
    if (
      getDistanceBetweenTwoPoints(
        player1.x + player1.radius,
        player1.y + player1.radius,
        enemy.x + enemy.radius,
        enemy.y + enemy.radius
      ) <= player1.radius
    ) {
      cancelAnimationFrame(animationFrame);
      projectiles = [];
      enemies = [];
    } else {
      enemy.update();
    }
  });

  // If there's no enemies is game win
  if (enemies.length <= 0) cancelAnimationFrame(animationFrame);
}

init();
animate();
