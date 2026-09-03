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

  switch (e.key) {
    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      break;

    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;
  }

  score.textContent = game.getScore();

  game.addTile();
  game.reload();

  if (game.checkWin()) {
    mesWin.classList.remove('hidden');

    return;
  }

  if (game.checkLose()) {
    mesLose.classList.remove('hidden');
  }
});
