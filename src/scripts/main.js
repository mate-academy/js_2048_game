'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const [...cells] = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function hideMessages() {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
}

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    game.restart();
  }

  if (button.classList.contains('start')) {
    game.start();

    document.addEventListener('keydown', (key) => {
      if (game.status === Game.STATUS_PLAYING) {
        switch (key.key) {
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
        }

        displayOnField(game.state);
      }
    });

    button.classList.remove('start');
    button.textContent = 'Restart';
    button.classList.add('restart');
  }

  hideMessages();
  displayOnField(game.state);
});

function displayOnField(matrix) {
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    for (let cellIndex = 0; cellIndex < matrix[rowIndex].length; cellIndex++) {
      const matrixCell = matrix[rowIndex][cellIndex];
      const cell = cells[Game.GRID_SIZE * rowIndex + cellIndex];
      // instead of 0 we add empty string to the cell
      const value = matrixCell === 0 ? '' : matrixCell;

      if (cell.textContent !== value.toString()) {
        cell.textContent = value;
        cell.setAttribute('data-value', matrixCell);
      }
    }
  }

  score.textContent = game.score;

  switch (game.status) {
    case Game.STATUS_WIN:
      messageWin.classList.remove('hidden');
      break;

    case Game.STATUS_LOSE:
      messageLose.classList.remove('hidden');
      break;
  }
}
