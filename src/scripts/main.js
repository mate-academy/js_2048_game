'use strict';

import Game from '../modules/Game.class.js';
import Status from '../utils/Status.js';

const startButton = document.querySelector('.start');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const tableBody = document.querySelector('tbody');
const score = document.querySelector('.game-score');

const game = new Game();

let previousState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function updateTable() {
  const gameState = game.getState();

  [...tableBody.rows].forEach((row, i) => {
    [...row.cells].forEach((col, j) => {
      const cell = gameState[i][j];

      if (cell !== previousState[i][j]) {
        col.innerText = cell !== 0 ? cell : '';

        col.classList.forEach((cn) => {
          if (cn.startsWith('field-cell--')) {
            col.classList.remove(cn);
          }
        });

        col.classList.add(`field-cell--${cell}`);
      }
    });
  });

  previousState = gameState.map((row) => row.slice());
}

function generateMessage(currentStatus) {
  switch (currentStatus) {
    case Status.WON:
      messageWin.classList.remove('hidden');
      break;
    case Status.LOST:
      messageLose.classList.remove('hidden');
      break;
    default:
      break;
  }
}

startButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');

    startButton.classList.add('restart');
    startButton.innerText = 'Restart';

    messageStart.style.display = 'none';
  } else {
    if (!messageWin.classList.contains('hidden')) {
      messageWin.classList.add('hidden');
    }

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.remove('hidden');
    }

    game.setState([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    game.setScore(0);
  }

  game.generateRandEl();
  game.generateRandEl();

  score.innerText = game.getScore();
  updateTable();

  previousState = game.getState().map((row) => [...row]);
});

window.addEventListener('keydown', (e) => {
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
      break;
  }

  if (
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowUp' ||
    e.key === 'ArrowDown'
  ) {
    if (startButton.classList.contains('restart')) {
      updateTable();

      game.generateRandEl();
      score.innerText = game.getScore();

      const currentStatus = game.getStatus();

      if (currentStatus === Status.LOST || currentStatus === Status.WON) {
        generateMessage(currentStatus);
      }
    }
  }
});
