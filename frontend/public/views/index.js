import { Projectile, Player, Enemy, Particle } from "./entities.js";
import {
  getDistanceBetweenTwoPoints,
  getRandomInt,
  moveToPoint,
  randomColor,
} from "./utils.js";

// TODO:
//
// - Add sprite to player
//
//

const $score = document.querySelector("#scoreNum");
const $uiscore = document.querySelector("#uIscoreNum");
const $ui = document.querySelector("#ui");
const $startGameBtn = document.querySelector("#startGame");
const $statusOfGame = document.querySelector("#statusOfGame");
const $canvas = document.querySelector("canvas");
export const context = $canvas.getContext("2d");

// Adjust canvas to be full screen
$canvas.width = innerWidth;
$canvas.height = innerHeight;

// Objects
let player1;
let enemies = new Array();
let projectiles = new Array();
let particles = new Array();
let score = 0;
let animationFrame;
let isGameRunning = false;
let isGameWin;
let numberOfEnemies = 2;
let switcher = 0;

const mouse = {
  x: undefined,
  y: undefined,
};

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  // Adjust canvas size on resize to be full screen
  $canvas.width = innerWidth;
  $canvas.height = innerHeight;

  if (isGameRunning) {
    init();
  }
});

addEventListener("click", (event) => {
  // Verify game is running
  if (isGameRunning) {
    // Click event spawns new projectile
    const x = innerWidth / 2;
    const y = innerHeight / 2;
    const radius = 5;
    // moveToPoint func it's the pythagoras theorem to get the distance btw the click and the player position
    // Creates a smooth animation
    const velocity = moveToPoint(event.clientX, x, event.clientY, y);

    const projectile = new Projectile(
      x,
      y,
      velocity,
      radius,
      player1.color,
      false
    );

    projectiles.push(projectile);
  }
});

// Implementation
function init() {
  // Init is called on resize, enemies are spawned again and enemies array must be restarted
  projectiles = [];
  particles = [];

  $score.innerHTML = score;
  $uiscore.innerHTML = score;

  // Initialize player
  player1 = new Player(innerWidth / 2, innerHeight / 2, 30, "purple");

  // initialize enemies

  for (let index = 0; index < numberOfEnemies; index++) {
    let radius = getRandomInt(20, 40);
    let x = 0;
    let y = 0;
    if (switcher === 0) {
      x = getRandomInt(0, innerWidth);
      y = Math.random() < 0.5 ? 0 : innerHeight;
    } else if (switcher === 1) {
      y = getRandomInt(0, innerWidth);
      x = Math.random() < 0.5 ? 0 : innerWidth;
    }

    // it will get inside else most of times.

    const velocityOfEnemy = moveToPoint(player1.x, x, player1.y, y);
    enemies.push(
      new Enemy(x, y, velocityOfEnemy, radius, randomColor(), false)
    );
    switcher === 0 ? (switcher = 1) : (switcher = 0);
  }

  // restart player coordinates
  player1.x = innerWidth / 2;
  player1.y = innerHeight / 2;
}

// Animation Loop
function animate() {
  animationFrame = requestAnimationFrame(animate);
  context.clearRect(0, 0, $canvas.width, $canvas.height);

  // animate player
  player1.update();

  // animate projectiles
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
            // if distance btw projectile and enemy < enemy radius it has collided
            getDistanceBetweenTwoPoints(
              projectile.x,
              projectile.y,
              enemy.x,
              enemy.y
            ) <= enemy.radius
          ) {
            for (let i = 0; i <= enemy.radius; i++) {
              let dx = (Math.random() - 0.5) * (Math.random() * 6);
              let dy = (Math.random() - 0.5) * (Math.random() * 6);
              let radius = Math.random() * 3;
              let particle = new Particle(
                projectile.x,
                projectile.y,
                radius,
                enemy.color,
                dx,
                dy
              );
              /* Adds new items like particle*/
              particles.push(particle);
            }

            // if enemy radius < 20 delete enemy and projectile from screen
            if (enemy.radius <= 20) {
              projectile.collided = true;
              enemy.collided = true;
              score += 250;
              $score.innerHTML = score;
              $uiscore.innerHTML = score;

              setTimeout(() => {
                enemies.splice(enemyIndex, 1);
                projectiles.splice(projectileIndex, 1);
              }, 0);
              // if enemy radius > 20, reduce its radius, delete projectile from screen
            } else {
              enemy.radius -= 10;
              score += 100;
              $score.innerHTML = score;
              $uiscore.innerHTML = score;

              setTimeout(() => {
                projectiles.splice(projectileIndex, 1);
              }, 0);
            }
          }
        });
        projectile.update();
      }
    });
  }

  particles.forEach((particle, i) => {
    if (particle.alpha <= 0) {
      particles.splice(i, 1);
    } else particle.update();
  });

  // animate enemies
  enemies.forEach((enemy) => {
    // if enemy collide with player is game lose
    if (
      getDistanceBetweenTwoPoints(
        player1.x - player1.radius,
        player1.y - player1.radius,
        enemy.x - enemy.radius,
        enemy.y - enemy.radius
      ) <=
      enemy.radius + player1.radius
    ) {
      isGameRunning = false;
      projectiles = [];
      enemies = [];
    } else {
      enemy.update();
    }
  });

  // If there's no enemies is game win
  if (enemies.length === 0 || !isGameRunning) {
    cancelAnimationFrame(animationFrame);
    if (enemies.length === 0) isGameWin = true;
    if (!isGameRunning) isGameWin = false;
    $ui.style.display = "flex";
    if (isGameWin) {
      score = score;
      numberOfEnemies += 2;
      $statusOfGame.innerHTML = "You win!";
    } else {
      score = 0;
      numberOfEnemies = 2;
      $statusOfGame.innerHTML = "Game lose, try again";
      enemies = [];
    }
  }
}

$startGameBtn.addEventListener("click", () => {
  $ui.style.display = "none";
  isGameRunning = true;
  init();
  animate();
});
