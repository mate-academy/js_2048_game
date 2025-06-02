'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const table = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const startRestart = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const boardRows = table.rows;

updateBoard();

function updateBoard() {
  for (let row = 0; row < boardRows.length; row++) {
    for (let cell = 0; cell < boardRows[row].cells.length; cell++) {
      const currentCell = boardRows[row].cells[cell];

      currentCell.textContent = game.board[row][cell] || '';

      for (let i = 0; i < currentCell.classList.length; i++) {
        if (currentCell.classList[i].startsWith('field-cell--')) {
          currentCell.classList.remove(currentCell.classList[i]);

          break;
        }
      }

      currentCell.classList.add(`field-cell--${game.board[row][cell] || ''}`);
    }
  }
}

function handleKeys(e) {
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
  }

  updateBoard();
  score.textContent = game.getScore();
  game.gameLost();

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }
}

startRestart.addEventListener('click', () => {
  if (startRestart.textContent === 'Start') {
    startRestart.classList.replace('start', 'restart');
    startRestart.textContent = 'Restart';

    game.start();
    messageStart.classList.add('hidden');
    document.addEventListener('keydown', handleKeys);
  } else {
    startRestart.classList.replace('restart', 'start');
    startRestart.textContent = 'Start';
    game.restart();
    updateBoard();
    score.textContent = 0;

    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    document.removeEventListener('keydown', handleKeys);
  }
});
