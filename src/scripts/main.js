'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const table = document.querySelector('.game-field');
const score = document.querySelector('.game-score');

const buttonStartRestart = document.querySelector('.start');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const rows = table.rows;

updateBoard();

buttonStartRestart.addEventListener('click', () => {
  if (buttonStartRestart.textContent === 'Start') {
    buttonStartRestart.classList.replace('start', 'restart');
    buttonStartRestart.textContent = 'Restart';
    game.start();
    updateBoard();
    messageStart.classList.add('hidden');

    document.addEventListener('keydown', handleKeyDown);
  } else {
    buttonStartRestart.classList.replace('restart', 'start');
    buttonStartRestart.textContent = 'Start';
    game.restart();
    updateBoard();
    score.textContent = 0;
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    document.removeEventListener('keydown', handleKeyDown);
  }
});

function updateBoard() {
  for (let row = 0; row < rows.length; row++) {
    for (let cell = 0; cell < rows[row].cells.length; cell++) {
      const currentCell = rows[row].cells[cell];

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

function handleKeyDown(e) {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateBoard();
  score.textContent = game.getScore();
  game.checkLose();

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }
}
