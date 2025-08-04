/* eslint-disable object-curly-newline */
'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const scoreElement = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function updateButtonStyle() {
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  if (status === 'playing' && startBtn.textContent === 'Restart') {
    startBtn.classList.add('restart-active');
  } else {
    startBtn.classList.remove('restart-active');
  }
}

function renderGame() {
  game.render({ cells, scoreElement, messageWin, messageLose });
  updateButtonStyle();
}

document.addEventListener('keydown', (e) => {
  // eslint-disable-next-line curly
  if (game.getStatus() !== 'playing') return;

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
  }

  renderGame();
});

startBtn.addEventListener('click', () => {
  game.restart();
  game.start();
  renderGame();

  messageStart.classList.add('hidden');
  startBtn.textContent = 'Restart';
  startBtn.style.textAlign = 'center';
});
