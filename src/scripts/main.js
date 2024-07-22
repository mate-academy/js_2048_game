'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    game.start();
    button.classList.replace('start', 'restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
    button.classList.replace('restart', 'start');
    button.textContent = 'Start';
    score.textContent = 0;
  }

  showMessage();
});

document.addEventListener('keyup', (e) => {
  if (game.getStatus() !== 'playing' && game.getStatus() !== 'win') {
    return;
  }

  switch (e.code) {
    case 'ArrowRight':
      game.moveRight();
      game.setTwo();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      game.setTwo();
      break;
    case 'ArrowUp':
      game.moveUp();
      game.setTwo();
      break;
    case 'ArrowDown':
      game.moveDown();
      game.setTwo();
      break;
  }

  score.textContent = game.getScore();
  showMessage();
});

function showMessage() {
  const st = game.getStatus();

  if (st === 'playing') {
    messageStart.classList.add('hidden');
  } else if (st === 'win') {
    messageWin.classList.remove('hidden');
  } else if (st === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (st === 'idle') {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}
