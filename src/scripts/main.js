'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const score = document.querySelector('.game-score');
const button = document.querySelector('.start');
const mesStart = document.querySelector('.message-start');
const mesLose = document.querySelector('.message-lose');
const mesWin = document.querySelector('.message-win');

button.addEventListener('click', (e) => {
  if (game.getStatus() === 'idle') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    mesStart.classList.add('hidden');
    game.start();
  } else if (
    game.getStatus() === 'playing' ||
    game.getStatus() === 'lose' ||
    game.getStatus() === 'win'
  ) {
    mesWin.classList.add('hidden');
    mesLose.classList.add('hidden');
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    mesStart.classList.remove('hidden');
    game.restart();
    score.textContent = game.getScore();
  }
});

document.addEventListener('keydown', (e) => {
  if (
    game.getStatus() === 'idle' ||
    game.getStatus() === 'win' ||
    game.getStatus() === 'lose'
  ) {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowRight':
      moved = game.moveRight();
      break;

    case 'ArrowLeft':
      moved = game.moveLeft();
      break;

    case 'ArrowUp':
      moved = game.moveUp();
      break;

    case 'ArrowDown':
      moved = game.moveDown();
      break;

    default:
      return;
  }

  if (moved) {
    game.addTile();
    score.textContent = game.getScore();
    game.reload();

    if (game.checkWin()) {
      mesWin.classList.remove('hidden');

      return;
    }

    if (game.checkLose()) {
      mesLose.classList.remove('hidden');
    }
  }
});
