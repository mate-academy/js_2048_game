'use strict';

// Uncomment the next lines to use your game instance in the browser
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

function render() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  const scoreElement = document.querySelector('.game-score');

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  document.querySelector('.message-start').classList.add('hidden');

  const winMsg = document.querySelector('.message-win');
  const loseMsg = document.querySelector('.message-lose');

  if (gameStatus === 'win') {
    winMsg.classList.remove('hidden');
    loseMsg.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    loseMsg.classList.remove('hidden');
    winMsg.classList.add('hidden');
  } else {
    winMsg.classList.add('hidden');
    loseMsg.classList.add('hidden');
  }

  const button = document.querySelector('.button');

  if (
    gameStatus === 'playing' ||
    gameStatus === 'win' ||
    gameStatus === 'lose'
  ) {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
}

// Write your code here
