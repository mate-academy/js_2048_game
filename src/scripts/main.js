'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('button');
const startInfo = document.querySelector('.message-start');
const score = document.querySelector('.game-score');
const loseInfo = document.querySelector('.message-lose');
const winInfo = document.querySelector('.message-win');

button.addEventListener('click', (eventi) => {
  if (game.status === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  if (game.status !== 'idle') {
    button.classList.remove('start');
    button.textContent = 'Restart';
    button.classList.add('restart');
  }

  startInfo.classList.add('hidden');
  loseInfo.classList.add('hidden');
  winInfo.classList.add('hidden');

  showBoard();
});

function showBoard() {
  const board = game.getState();

  const allTails = document.querySelectorAll('.field-cell');

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const value = board[y][x];
      const index = y * 4 + x;
      const cell = allTails[index];

      if (value !== 0) {
        cell.textContent = value;
        cell.className = `field-cell field-cell--${value}`;
      } else {
        cell.textContent = '';
        cell.className = 'field-cell';
      }
    }
  }

  score.textContent = game.getScore();
}
showBoard();

function checkGameStatus() {
  if (game.status === 'lose') {
    loseInfo.classList.remove('hidden');
  }

  if (game.status === 'win') {
    winInfo.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (eventi) => {
  if (eventi.key === 'ArrowLeft') {
    game.moveLeft();
    checkGameStatus();
    showBoard();
  }

  if (eventi.key === 'ArrowRight') {
    game.moveRight();
    checkGameStatus();
    showBoard();
  }

  if (eventi.key === 'ArrowUp') {
    game.moveUp();
    checkGameStatus();
    showBoard();
  }

  if (eventi.key === 'ArrowDown') {
    game.moveDown();
    checkGameStatus();
    showBoard();
  }
});
