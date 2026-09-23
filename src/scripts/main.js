'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const mainButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let isFirstMoveMade = false;

function render() {
  const board = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cellElement = cells[cellIndex];
      const cellValue = board[r][c];

      if (cellElement) {
        cellElement.className = 'field-cell';

        cellElement.textContent = cellValue > 0 ? cellValue : '';

        if (cellValue > 0) {
          cellElement.classList.add(`field-cell--${cellValue}`);
        }
      }
      cellIndex++;
    }
  }

  if (winMessage) {
    winMessage.classList.add('hidden');
  }

  if (loseMessage) {
    loseMessage.classList.add('hidden');
  }

  if (gameStatus === 'win') {
    if (winMessage) {
      winMessage.classList.remove('hidden');
    }
  } else if (gameStatus === 'lose') {
    if (loseMessage) {
      loseMessage.classList.remove('hidden');
    }
  }

  if (mainButton) {
    if (isFirstMoveMade) {
      mainButton.textContent = 'Restart';
      mainButton.className = 'button restart';
    } else {
      mainButton.textContent = 'Start';
      mainButton.className = 'button start';
    }
  }
}

render();

if (mainButton) {
  mainButton.addEventListener('click', () => {
    if (!isFirstMoveMade && game.getStatus() === 'idle') {
      if (startMessage) {
        startMessage.classList.add('hidden');
      }

      game.start();
    } else {
      isFirstMoveMade = false;

      if (startMessage) {
        startMessage.classList.remove('hidden');
      }

      game.restart();
    }

    render();
  });
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'idle') {
    if (startMessage) {
      startMessage.classList.add('hidden');
    }
    game.start();
  }

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
    default:
      return;
  }

  if (moved) {
    isFirstMoveMade = true;
    render();
  }
});
