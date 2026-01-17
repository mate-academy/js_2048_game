'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

// Write your code here
const board = document.querySelector('.game-field');

const matrix = Array.from(board.rows).map((row) => {
  return Array.from(row.cells).map((cell) => {
    cell.setAttribute('value', 0);

    return cell;
  });
});

let valueMatrix = Array.from(board.rows).map((row) => {
  return Array.from(row.cells).map((cell) => {
    return Number(cell.getAttribute('value'));
  });
});

const game = new Game(valueMatrix);
const btn = document.querySelector('.button');
const messageStart = document.querySelector('.message.message-start');
const messageWin = document.querySelector('.message.message-win');
const messageLose = document.querySelector('.message.message-lose');
const gameScore = document.querySelector('.game-score');

let btnClicked = false;

function setState() {
  valueMatrix = game.getState();

  matrix.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      cell.setAttribute('value', valueMatrix[rowIndex][cellIndex]);

      if (valueMatrix[rowIndex][cellIndex] !== 0) {
        cell.className = '';
        cell.classList.add('field-cell');
        cell.classList.add(`field-cell--${cell.getAttribute('value')}`);
        cell.textContent = valueMatrix[rowIndex][cellIndex];
      } else {
        cell.textContent = '';
        cell.className = '';
        cell.classList.add('field-cell');
        cell.setAttribute('value', 0);
      }
    });
  });
}

btn.addEventListener('click', () => {
  if (!btnClicked) {
    game.start();
    setState();

    messageStart.classList.add('hidden');

    btn.classList.remove('start');
    btn.classList.add('restart');
    btn.textContent = 'Restart';

    gameScore.textContent = Number(game.getScore());
  } else {
    game.restart();

    valueMatrix = game.clearState();

    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        cell.setAttribute('value', valueMatrix[rowIndex][cellIndex]);
        cell.textContent = '';
        cell.className = '';
        cell.classList.add('field-cell');
      });
    });

    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    btn.classList.add('start');
    btn.classList.remove('restart');
    btn.textContent = 'Start';

    gameScore.textContent = Number(game.getScore());
  }

  btnClicked = !btnClicked;
});

document.addEventListener('keydown', (e) => {
  if (btnClicked) {
    if (e.key === 'ArrowLeft') {
      game.moveLeft();
    }

    if (e.key === 'ArrowRight') {
      game.moveRight();
    }

    if (e.key === 'ArrowUp') {
      game.moveUp();
    }

    if (e.key === 'ArrowDown') {
      game.moveDown();
    }
    setState();

    gameScore.textContent = Number(game.getScore());

    const currentStatus = game.getStatus();

    if (currentStatus === 'win') {
      messageWin.classList.remove('hidden');
    }

    if (currentStatus === 'lose') {
      messageLose.classList.remove('hidden');
    }
  }
});
