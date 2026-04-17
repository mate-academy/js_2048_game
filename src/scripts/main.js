'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

// Write your code here
const game = new Game();

const startBtn = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  scoreEl.textContent = game.getScore();

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (game.getStatus() === 'win') {
    msgWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    msgLose.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (ev.key) {
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

  if (startBtn.classList.contains('start')) {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }

  render();
});
