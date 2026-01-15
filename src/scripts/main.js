'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    game.start();
    messageStart.classList.add('hidden');
    changeBoard();
  } else {
    game.restart();
    messageStart.classList.add('hidden');
    changeBoard();
  }
});

document.addEventListener('keydown', (e) => {
  if (button.textContent === 'Start') {
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  changeBoard();
});

function changeBoard() {
  const allCells = document.querySelectorAll('.field-cell');
  const board = game.getState();

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const value = board[i][j];
      const index = i * board[0].length + j;

      allCells[index].classList.forEach((className) => {
        if (className.startsWith('field-cell--')) {
          allCells[index].classList.remove(className);
        }
      });

      if (value === 0) {
        allCells[index].textContent = '';
      }

      if (value !== 0) {
        allCells[index].textContent = value;
        allCells[index].classList.add('field-cell--' + value);
      }
    }
  }

  score.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
}
