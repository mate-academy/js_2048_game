'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

function renderScore(score) {
  const scoreEl = document.querySelector('.game-score');

  scoreEl.textContent = score;
}

const youWin = document.querySelector('.message-win');
const youLose = document.querySelector('.message-lose');

function renderMessage(stat) {
  if (stat === 'win') {
    youWin.classList.remove('hidden');
  }

  if (stat === 'lose') {
    youLose.classList.remove('hidden');
  }
}

const begin = document.querySelector('.message-start');

const startBut = document.querySelector('.button');
let hasStarted = false;

startBut.addEventListener('click', () => {
  if (startBut.classList.contains('restart')) {
    youLose.classList.add('hidden');
    youWin.classList.add('hidden');
    hasStarted = false;
  } else {
    begin.classList.add('hidden');
  }

  game.start();
  renderScore(game.getScore());
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    default:
      return;
  }

  game.isWon();
  game.isLose();

  if (moved) {
    renderScore(game.getScore());
    renderMessage(game.getStatus());
  }

  if (moved && !hasStarted) {
    startBut.classList.remove('start');
    startBut.classList.add('restart');
    startBut.textContent = 'Restart';
    hasStarted = true;
  }

  if (game.getStatus() !== 'playing') {
  }
});
