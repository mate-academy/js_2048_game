'use strict';
import Game from '../modules/Game.class';
// Uncomment the next lines to use your game instance in the browser

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const score = game.getScore();
  const currentStatus = game.getStatus();

  scoreEl.textContent = score;

  // Flatten board and update each cell
  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell'; // reset classes

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  msgStart.classList.add('hidden');
  msgWin.classList.toggle('hidden', currentStatus !== 'win');
  msgLose.classList.toggle('hidden', currentStatus !== 'lose');

  if (currentStatus === 'win' || currentStatus === 'lose') {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }
}

startBtn.addEventListener('click', () => {
  game.restart();
  render();
});

document.addEventListener('keydown', () => {
  const currentStatus = game.getStatus();

  if (currentStatus !== 'playing') {
    return;
  }

  const key = event.key;

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
    switch (key) {
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
  }
});
