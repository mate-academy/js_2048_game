'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

function renderBoard() {
  const board = game.getState();
  const rows = [...document.querySelectorAll('.field-row')];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = rows[row].children[col];
      const value = board[row][col];

      if (cell.textContent !== value && value !== 0) {
        cell.style.animation = 'tile-pop 0.3s ease';

        cell.addEventListener('animationend', () => {
          cell.style.animation = '';
        });
      }

      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  const gameScore = document.querySelector('.game-score');
  const winMessage = document.querySelector('.message-win');

  gameScore.textContent = game.getScore();

  const loseMessage = document.querySelector('.message-lose');

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'playing') {
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }
}

const start = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
let started = false;

start.addEventListener('click', (e) => {
  if (!started) {
    game.start();
    started = true;
    startMessage.classList.add('hidden');
    start.classList.add('hidden');
    start.classList.remove('start');
    start.classList.add('restart');
    start.classList.remove('hidden');
    start.textContent = 'Restart';

    renderBoard();
  } else {
    game.restart();
    undoSum = 0;
    game.history = [];

    if (!undoMessage.classList.contains('hidden')) {
      undoMessage.classList.add('hidden');
    }
    renderBoard();
  }
});

window.addEventListener('keydown', (e) => {
  if (!started) {
    return;
  }
  e.preventDefault();

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;

    default:
      return;
  }
  renderBoard();
});

const gameField = document.querySelector('.game-field');
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

gameField.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

gameField.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
  endY = e.touches[0].clientY;
});

gameField.addEventListener("touchend", () => {
  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 30) {
      handleSwipe("right");
    } else if (diffX < -30) {
      handleSwipe("left");
    }
  } else {
    if (diffY > 30) {
      handleSwipe("down");
    } else if (diffY < -30) {
      handleSwipe("up");
    }
  }
  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;
});

function handleSwipe(direction) {
  switch (direction) {
    case "up":
      game.moveUp();
      break;
    case "down":
      game.moveDown();
      break;
    case "left":

      game.moveLeft();
      break;
    case "right":
      game.moveRight();
      break;
  }
}
let undoSum = 0;
const undoMessage = document.querySelector('.message-undo');

const undo = document.querySelector('.undo');

undo.addEventListener('click', (e) => {
  undoSum++;

  if (undoSum < 4) {
    game.undo();
    renderBoard();
  } else {
    undoMessage.classList.remove('hidden');

    setTimeout(() => {
      undoMessage.classList.add('hidden');
    }, 5000);
  }
});
