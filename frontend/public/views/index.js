import { Projectile, Player, Enemy, Particle } from "./entities.js";
import {
  getDistanceBetweenTwoPoints,
  getRandomInt,
  moveToPoint,
  randomColor,
} from "./utils.js";

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
let player;
let enemies = new Array();
let projectiles = new Array();
let particles = new Array();
let score = 0;
let animationFrame;
let isGameRunning = false;
let isGameWin;
let numberOfEnemies = 2;
let switcher = 0;
let username = null;
let color = null;
export let isMultiplayer = false;
let partyId;
let turn;

const mouse = {
  x: undefined,
  y: undefined,
};

const loseGame = (partyId, turn) => {
  context.clearRect(0, 0, $canvas.width, $canvas.height);
  const event = new CustomEvent("lose", {
    detail: {
      partyId,
      turn,
    },
  });
  document.dispatchEvent(event);
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("start", (event) => {
    isMultiplayer = true;
    username = event.detail.username;
    partyId = event.detail.partyId;
    color = event.detail.color;
    turn = event.detail.turn;
    $ui.style.display = "none";
    isGameRunning = true;
    init();
    animate();
  });
});

// Event Listeners
addEventListener("mousemove", (event) => {
  if (isGameRunning) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }
});

addEventListener("resize", () => {
  // Adjust canvas size on resize to be full screen

  $canvas.width = innerWidth;
  $canvas.height = innerHeight;
  init();
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
      player.color,
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

  player = new Player(
    innerWidth / 2,
    innerHeight / 2,
    20,
    isMultiplayer ? color : "white"
  );

  // initialize enemies

  for (let index = 0; index < numberOfEnemies; index++) {
    let radius = getRandomInt(20, 40);
    let x = 0;
    let y = 0;
    if (switcher === 0) {
      // FIXME:
      // - The enemies are being spawn way too far from player
      x = getRandomInt(0, innerWidth);
      y = Math.random() < 0.5 ? 0 : innerHeight;
    } else if (switcher === 1) {
      y = getRandomInt(0, innerWidth);
      x = Math.random() < 0.5 ? 0 : innerWidth;
    }

    const velocityOfEnemy = moveToPoint(player.x, x, player.y, y);
    enemies.push(
      new Enemy(x, y, velocityOfEnemy, radius, randomColor(), false)
    );
    switcher === 0 ? (switcher = 1) : (switcher = 0);
  }

  // restart player coordinates
  player.x = innerWidth / 2;
  player.y = innerHeight / 2;
}

// Animation Loop
function animate() {
  animationFrame = requestAnimationFrame(animate);
  context.clearRect(0, 0, $canvas.width, $canvas.height);

  // animate player
  player.update();

  if (isMultiplayer) {
    context.fillText(
      username,
      player.x + player.radius + 5,
      player.y + player.radius + 10
    );
  }

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
            // Explosion animation
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

  // Particles update
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
        player.x - player.radius,
        player.y - player.radius,
        enemy.x - enemy.radius,
        enemy.y - enemy.radius
      ) <=
      enemy.radius + player.radius
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
    if (!isGameRunning) {
      isGameWin = false;
    }
    if (!isMultiplayer) {
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
    } else {
      if (isGameWin) {
        score = score;
        numberOfEnemies += 2;
        setTimeout(() => {
          init();
          animate();
        }, 1000);
      } else {
        score = 0;
        numberOfEnemies = 2;
        enemies = [];
        loseGame(partyId, turn);
      }
    }
  }
}

$startGameBtn.addEventListener("click", () => {
  $ui.style.display = "none";
  isGameRunning = true;
  isMultiplayer = false;
  init();
  animate();
});
