'use strict';

const Game = require('./game.js');

const game = new Game();
const cellElements = document.querySelectorAll('.field-cell');

const score = document.querySelector('.game-score');
const controlButton = document.querySelector('.button');
const message = document.querySelectorAll('.message');

controlButton.addEventListener('click', () => {
  if (controlButton.classList.contains('start')) {
    controlButton.classList.remove('start');
    controlButton.classList.add('restart');
    controlButton.textContent = 'Restart';
    message[2].classList.add('hidden');
    getGameField();
  } else if (controlButton.classList.contains('restart')) {
    if (!message[0].classList.remove('hidden')) {
      message[0].classList.add('hidden');
    }

    if (!message[1].classList.remove('hidden')) {
      message[1].classList.add('hidden');
    }
    game.resetGame();
    getGameField();
  }
});

document.addEventListener('keydown', (click) => {
  switch (click.key) {
    case 'ArrowUp':
      game.moveUp();
      getGameField();
      break;

    case 'ArrowDown':
      game.moveDown();
      getGameField();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      getGameField();
      break;

    case 'ArrowRight':
      game.moveRight();
      getGameField();
      break;

    default:
      throw new Error('Control the game with the arrows on the keyboard');
  }
});

function getGameField() {
  game.field.forEach((row, iR) => {
    row.forEach((cellValue, iC) => {
      const cellElement = cellElements[iR * 4 + iC];

      cellElement.textContent = cellValue === 0 ? '' : cellValue;
      cellElement.className = `field-cell field-cell--${cellValue}`;
    });
  });

  score.textContent = game.score;

  if (game.isGameOver()) {
    message[0].classList.remove('hidden');
  } else if (game.isGameWin()) {
    message[1].classList.remove('hidden');
  }
}
