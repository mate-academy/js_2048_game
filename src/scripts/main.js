'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const startBut = document.querySelector('.button');
const score = document.querySelector('.game-score');
const rows = document.querySelectorAll('.field-row');

// Write your code here
// ArrowUp
// main.js:12 ArrowDown
// main.js:12 ArrowRight
// main.js:12 ArrowLeft
document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
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
    default:
      return;
  }

  drowNewState();
  score.innerText = game.getScore();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
});

startBut.addEventListener('click', (e) => {
  if (startBut.classList.contains('start')) {
    game.start();
    document.querySelector('.message-start').classList.add('hidden');
    startBut.classList.remove('start');
    startBut.classList.add('restart');
    startBut.innerText = 'Restart';
  }

  if (startBut.classList.contains('restart')) {
    const cells = document.querySelectorAll('.field-cell');
    const messages = document
      .querySelector('.message-container')
      .querySelectorAll('.message');

    messages.forEach((m) => {
      if (!m.classList.contains('hidden')) {
        m.classList.add('hidden');
      }
    });

    cells.forEach((c) => {
      if (c.innerText !== '') {
        c.classList.remove(`field-cell--${c.innerText}`);
        c.innerText = '';
      }
    });

    game.restart();
  }

  const row = rows[game.getLastPosition().x];
  const cell = row.querySelectorAll('.field-cell')[game.getLastPosition().y];
  const number = game.getLastNumber();

  cell.classList.add(`field-cell--${number}`);
  cell.innerText = number;
});

function drowNewState() {
  const state = game.getState();

  rows.forEach((row, i) => {
    row.querySelectorAll('.field-cell').forEach((cell, j) => {
      if (state[i][j] === 0) {
        if (cell.innerText !== '') {
          cell.classList.remove(`field-cell--${cell.innerText}`);
          cell.innerText = '';
        }
      } else {
        cell.classList.remove(`field-cell--${cell.innerText}`);
        cell.classList.add(`field-cell--${state[i][j]}`);
        cell.innerText = state[i][j];
      }
    });
  });
}
