'use strict';

import Game from '../modules/Game.class';

const game = new Game();
const scoreDisplay = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const startButton = document.querySelector('.start');

function render() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const value = game.getState()[Math.floor(index / 4)][index % 4];

    cell.className = 'field-cell' + (value ? ` field-cell--${value}` : '');
    cell.textContent = value || '';
  });
  scoreDisplay.textContent = game.getScore();

  if (game.getStatus() === 'won') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lost') {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'running') {
    return;
  }

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
  render();
});

startButton.addEventListener('click', () => {
  game.start();
  messageStart.classList.add('hidden');
  startButton.textContent = 'Restart';
  render();
});

render();
