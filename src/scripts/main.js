'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const rows = Array.from(document.querySelectorAll('.field-row'));
const cells = rows.map((row) => {
  return Array.from(row.querySelectorAll('.field-cell'));
});

const loseSMS = document.querySelector('.message-lose');
const winSMS = document.querySelector('.message-win');

document.addEventListener('keydown', (e) => {
  const previousBoard = game.getState();

  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
    }

    if (game.isBoardChanged(previousBoard, game.board)) {
      const newCells = game.addNewCell(game.getRandomCell(1));

      updateTable(game, cells, 'new', newCells);
    }

    if (game.getStatus() === 'win') {
      winSMS.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      loseSMS.classList.remove('hidden');
    }
  }
});

const startSMS = document.querySelector('.message-start');

const button = document.querySelector('.controls .button');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    const newCells = game.start();

    updateTable(game, cells, 'new', newCells);
    startSMS.classList.add('hidden');
    button.textContent = 'Restart';
  }

  if (button.classList.contains('restart')) {
    game.restart();
    updateTable(game, cells);
    startSMS.classList.remove('hidden');
    winSMS.classList.add('hidden');
    loseSMS.classList.add('hidden');
    button.textContent = 'Start';
  }

  button.classList.toggle('start');
  button.classList.toggle('restart');
});

function updateTable(gameInstance, td, animationType = null, coords = []) {
  const board = gameInstance.getState();

  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = td[rowIndex][colIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      if (
        animationType === 'new' &&
        coords.some((c) => c.row === rowIndex && c.col === colIndex)
      ) {
        cell.classList.add('field-cell--new');
      }

      cell.addEventListener(
        'animationend',
        () => {
          cell.classList.remove('field-cell--new', 'field-cell--move');
        },
        { once: true },
      );
    });
  });

  const score = gameInstance.getScore();

  document.querySelector('.game-score').textContent = score;
}
