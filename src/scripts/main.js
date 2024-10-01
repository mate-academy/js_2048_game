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

const observer = new MutationObserver(() => {
  const arrayOfRows = Array.from(rows);

  const grid = arrayOfRows.map(
    (row) =>
      Array.from(row.querySelectorAll('td')).map(
        (cell) => cell.textContent.trim(),
        // eslint-disable-next-line no-console
      ),
    // eslint-disable-next-line no-console
  );

  game.isMovePossible(grid);

  const gameStatus = game.gameStatus;

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
});

observer.observe(tbody, {
  childList: true,
  subtree: true,
});

document.addEventListener('keydown', (evnt) => {
  evnt.preventDefault();

  if (game.getStatus() === 'playing') {
    switch (evnt.key) {
      case 'ArrowLeft':
        createCellIfGameStarted(game.moveLeft(rows));
        break;

      case 'ArrowRight':
        createCellIfGameStarted(game.moveRight(rows));
        break;

      case 'ArrowUp':
        createCellIfGameStarted(game.moveUp(rows));
        break;

      case 'ArrowDown':
        createCellIfGameStarted(game.moveDown(rows));
        break;

      default:
        break;
    }
  }

  score.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
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
}
