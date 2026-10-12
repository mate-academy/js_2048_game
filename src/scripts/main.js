'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const start = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function render() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    row.forEach((number, columnIndex) => {
      const cell = cells[rowIndex * 4 + columnIndex];

      cell.textContent = number === 0 ? '' : number;

      cell.classList.forEach((className) => {
        if (className.startsWith('field-cell--')) {
          cell.classList.remove(className);
        }
      });

      if (number !== 0) {
        cell.classList.add(`field-cell--${number}`);
      }
    });
  });

  gameScore.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

start.addEventListener('click', () => {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (game.getStatus() === 'playing') {
    game.restart();
    game.start();
  } else {
    game.start();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  const previousState = JSON.stringify(game.getState());

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  const isArrowKey =
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowUp' ||
    e.key === 'ArrowDown';

  if (isArrowKey) {
    if (previousState !== JSON.stringify(game.getState())) {
      start.textContent = 'Restart';
      start.classList.add('restart');
    }
    render();
  }
});
