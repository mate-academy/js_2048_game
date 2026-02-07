'use strict';

// Uncomment the next lines to use your game instance in the browser console
import Game from '../modules/Game.class.js';

const game = new Game();

document.addEventListener('keydown', (e) => {
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

  render();
});

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

function render() {
  const state = game.getState().flat();

  const currentStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value > 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  if (currentStatus === 'playing') {
    startMsg.classList.add('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  }

  if (currentStatus === 'win') {
    winMsg.classList.remove('hidden');
  }

  if (currentStatus === 'lose') {
    loseMsg.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    winMsg.classList.add('hidden');
    loseMsg.classList.add('hidden');
  }
  render();
});
