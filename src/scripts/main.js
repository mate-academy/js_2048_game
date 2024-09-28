'use strict';

const Game = require('../modules/Game.class');

const controls = document.querySelector('.controls');
const score = controls.querySelector('.game-score');
const startButton = controls.querySelector('.button');

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');

const messages = document.querySelector('.message-container');
const loseMessage = messages.querySelector('.message-lose');
const winMessage = messages.querySelector('.message-win');
const startMessage = messages.querySelector('.message-start');

loseMessage.classList.add('hidden');
winMessage.classList.add('hidden');

const game = new Game();

game.getState(rows);

startButton.addEventListener('click', () => {
  if (
    startButton.hasAttribute('class', 'start') &&
    startButton.textContent === 'Start'
  ) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';

    const indexes = game.start(rows);

    game.changeMessage(startMessage);

    createCell(indexes);
  } else if (
    startButton.hasAttribute('class', 'restart') &&
    startButton.textContent === 'Restart'
  ) {
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';

    game.restart(rows);

    score.textContent = 0;
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');

    game.changeMessage(startMessage);
  }
});

function createCell(indexes) {
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');

    cells.forEach((cell, cellIndex) => {
      if (indexes.length === 2) {
        const firstIndex = indexes[0];
        const secondIndex = indexes[1];

        if (
          firstIndex.rowIndex === rowIndex &&
          firstIndex.cellIndex === cellIndex
        ) {
          cell.classList.add(`field-cell--${firstIndex.cellNumber}`);
          cell.textContent = firstIndex.cellNumber;
        }

        if (
          secondIndex.rowIndex === rowIndex &&
          secondIndex.cellIndex === cellIndex
        ) {
          cell.classList.add(`field-cell--${secondIndex.cellNumber}`);
          cell.textContent = secondIndex.cellNumber;
        }
      }
    });
  });
}

document.addEventListener('keydown', (evnt) => {
  evnt.preventDefault();

  if (game.getStatus() === 'playing') {
    switch (evnt.key) {
      case 'ArrowLeft':
        createCellIfGameStarted(game.moveLeft(rows));

        score.textContent = game.getScore();

        if (game.getStatus() === 'win') {
          winMessage.classList.remove('hidden');
        }

        break;

      case 'ArrowRight':
        createCellIfGameStarted(game.moveRight(rows));

        score.textContent = game.getScore();

        if (game.getStatus() === 'win') {
          winMessage.classList.remove('hidden');
        }

        break;

      case 'ArrowUp':
        createCellIfGameStarted(game.moveUp(rows));

        score.textContent = game.getScore();

        if (game.getStatus() === 'win') {
          winMessage.classList.remove('hidden');
        }

        break;

      case 'ArrowDown':
        createCellIfGameStarted(game.moveDown(rows));

        score.textContent = game.getScore();

        if (game.getStatus() === 'win') {
          winMessage.classList.remove('hidden');
        }

        break;

      default:
        break;
    }
  }
});

function createCellIfGameStarted(index) {
  if (index !== undefined) {
    const firstIndexes = index[0];

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');

      cells.forEach((cell, cellIndex) => {
        if (
          firstIndexes.rowIndex === rowIndex &&
          firstIndexes.cellIndex === cellIndex
        ) {
          cell.classList.add(`field-cell--${firstIndexes.cellNumber}`);
          cell.textContent = firstIndexes.cellNumber;
        }
      });
    });
  }

  const gameStatus = game.gameStatus;

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}
