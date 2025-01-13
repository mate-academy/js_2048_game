'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const gameField = document.querySelector('tbody');
const score = document.querySelector('.game-score');
const button = document.querySelector('button');
const rows = gameField.querySelectorAll('tr');
const cells = document.querySelectorAll('td');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function styleCell(cell) {
  cell.classList.add(`field-cell--${cell.textContent}`);
}

function updateScore() {
  score.textContent = game.score;
}

function clearCell(cell) {
  if (cell.classList.contains(`field-cell--${cell.textContent}`)) {
    cell.classList.remove(`field-cell--${cell.textContent}`);
  }
  cell.textContent = '';
}

function updateBoard() {
  for (let i = 0; i < game.board.length; i++) {
    const cellsInRow = rows[i].querySelectorAll('td');

    for (let n = 0; n < game.board[i].length; n++) {
      if (game.board[i][n] !== 0) {
        clearCell(cellsInRow[n]);
        cellsInRow[n].textContent = game.board[i][n];
        styleCell(cellsInRow[n]);
      } else {
        clearCell(cellsInRow[n]);
      }
    }

    updateScore();
  }
}

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    game.start();
    updateBoard();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    messageStart.classList.add('hidden');
  } else if (button.textContent === 'Restart') {
    game.restart();
    updateBoard();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
    messageStart.classList.remove('hidden');

    cells.forEach((cell) => {
      clearCell(cell);
    });
  }
});

window.addEventListener('keydown', (ev) => {
  ev.preventDefault();

  switch (ev.key) {
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

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }

  updateBoard();
});
