'use strict';

const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const button = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function showMessage() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'playing') {
    messageStart.classList.add('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

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
  showMessage();
});
