'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const score = document.querySelector('.game-score');
const buttonStart = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function boardDrawing() {
  const board = game.getState();
  const sco = game.getScore();

  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const cellIndex = rowIndex * 4 + colIndex;
      const cellValue = board[rowIndex][colIndex];

      if (cellValue === 0) {
        cells[cellIndex].className = 'field-cell';
        cells[cellIndex].textContent = '';
      } else {
        cells[cellIndex].textContent = cellValue;
        cells[cellIndex].className = 'field-cell';
        cells[cellIndex].classList.add(`field-cell--${cellValue}`);
      }
    }
  }

  score.textContent = sco;
}
// Write your code here

document.addEventListener('keydown', (even) => {
  if (even.key === 'ArrowLeft') {
    game.moveLeft();
    game.checkForLose();
  } else if (even.key === 'ArrowRight') {
    game.moveRight();
    game.checkForLose();
  } else if (even.key === 'ArrowUp') {
    game.moveUp();
    game.checkForLose();
  } else if (even.key === 'ArrowDown') {
    game.moveDown();
    game.checkForLose();
  }

  const statu = game.getStatus();

  if (statu === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statu === 'lose') {
    messageLose.classList.remove('hidden');
  }

  boardDrawing();
});

buttonStart.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
  } else {
    game.restart();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
  boardDrawing();

  buttonStart.textContent = 'restart';
  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');
});
