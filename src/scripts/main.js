/* eslint-disable no-use-before-define */
'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
const Game = require('../modules/Game.class');
const game = new Game();

const boardElement = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const startMessage = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  const rows = boardElement.querySelectorAll('tr');

  state.forEach((row, rIdx) => {
    const cells = rows[rIdx].querySelectorAll('td');

    row.forEach((value, cIdx) => {
      const cell = cells[cIdx];

      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  scoreElement.textContent = game.getScore();

  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  messageWin.classList.toggle('hidden', status !== 'win');
  messageLose.classList.toggle('hidden', status !== 'lose');
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  // eslint-disable-next-line curly
  if (moved) render();
});

startBtn.addEventListener('click', () => {
  game.start();
  startBtn.textContent = 'Restart';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  startMessage.classList.add('hidden');

  scoreElement.textContent = '0';
  render();
});

render();
