'use strict';

// Uncomment the next lines to use your game instance in the browser

/* import Game from '../modules/Game.class';

const game = new Game(); */

// Write your code here
import Game from '../modules/Game.class.js';

const game = new Game();
const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const mainBtn = document.querySelector('.button.start');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

function render() {
  const board = game.getState().flat();
  const appStatus = game.getStatus();

  cells.forEach((cell, i) => {
    const val = board[i];

    cell.textContent = val === 0 ? '' : val;
    cell.className = 'field-cell';

    if (val) {
      cell.classList.add(`field-cell--${val}`);
    }
  });

  scoreEl.textContent = game.getScore();

  if (appStatus === 'playing') {
    startMsg.classList.add('hidden');
    loseMsg.classList.add('hidden');
    mainBtn.textContent = 'Restart';
    mainBtn.classList.replace('start', 'restart');
  } else if (appStatus === 'win') {
    winMsg.classList.remove('hidden');
  } else if (appStatus === 'loss') {
    loseMsg.classList.remove('hidden');
  }
}

mainBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    render();
  }
});
