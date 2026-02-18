// @ts-nocheck
'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button');
const messegeLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const oldState = game.getState().map((row) => row.slice());

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

  const newState = game.getState();

  const changed = !matricesEqual(oldState, newState);

  if (changed) {
    renderMatrix(newState);
    updateGame();
  }

  function matricesEqual(openMatrix, closeMatrix) {
    if (openMatrix.length !== closeMatrix.length) {
      return false;
    }

    for (let i = 0; i < game.matrixSize; i++) {
      for (let j = 0; j < game.matrixSize; j++) {
        if (openMatrix[i][j] !== closeMatrix[i][j]) {
          return false;
        }
      }
    }

    return true;
  }
});

startButton.addEventListener('click', () => {
  messegeLose?.classList.add('hidden');
  messageStart?.classList.add('hidden');

  if (game.getStatus() === 'playing') {
    game.restart();
  } else {
    game.start();
  }

  startButton.textContent = 'Restart';
  startButton.classList.remove('hidden');
  startButton.classList.add('restart');

  renderMatrix(game.getState());
  updateGame();
});

function updateGame() {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');

  messegeLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (messageWin) {
    messageWin.classList.toggle('hidden', gameStatus !== 'win');
  }
}

function renderMatrix(matrix) {
  const cells = document.querySelectorAll('.field-cell');

  if (cells.length !== Math.pow(game.matrixSize, 2)) {
    return;
  }

  matrix.flat().forEach((value, index) => {
    const cell = cells[index];

    if (!cell) {
      return;
    }

    cell.textContent = value || '';
    cell.className = `field-cell ${value ? ' field-cell--' + value : ''}`;
  });
  renderScore(game.getScore());
}

function renderScore(score) {
  const scoreElement = document.querySelector('.game-score');

  if (scoreElement) {
    scoreElement.textContent = score;
  }
}
