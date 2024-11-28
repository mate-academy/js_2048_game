'use strict';

const Game = require('../modules/Game.class');
// eslint-disable-next-line no-unused-vars
const game = new Game();

const getButtonStart = document.querySelector('button');
const getCell = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');

let click = 0;

// eslint-disable-next-line no-shadow
getButtonStart.addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
    click++;

    getButtonStart.classList.add('start');

    if (click === 1) {
      game.start();
      renderField(game.state);

      const getMessage = document.querySelector('.message.message-start');

      getMessage.classList.add('hidden');
    } else if (click > 1) {
      game.restart();
      renderField(game.state);
    }
  }
});

function renderField(state) {
  getCell.forEach((cell) => {
    cell.textContent = '';

    cell.classList.remove(
      'field-cell--2',
      'field-cell--4',
      'field-cell--8',
      'field-cell--16',
      'field-cell--32',
      'field-cell--64',
      'field-cell--128',
      'field-cell--256',
      'field-cell--512',
      'field-cell--1024',
      'field-cell--2048',
    );
  });

  state.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const cellElement = getCell[rowIndex * 4 + cellIndex];

      if (cell !== 0) {
        cellElement.textContent = cell;
        cellElement.classList.add(`field-cell--${cell}`);
      }
    });
  });
}

document.addEventListener('keydown', function (e) {
  if (e) {
    if (
      e.key === 'ArrowRight' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown'
    ) {
      getButtonStart.classList.remove('start');
      getButtonStart.classList.add('restart');
      getButtonStart.textContent = 'Restart';
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

    renderField(game.state);
    scoreElement.textContent = game.getScore();
    game.getStatus();
  }
});
