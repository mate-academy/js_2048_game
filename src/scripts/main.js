'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

const footerTextStart = document.querySelector('.message-start');
const footerTextWin = document.querySelector('.message-win');
const footerTextLose = document.querySelector('.message-lose');
const mainButton = document.querySelector('button');
const cells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');

const renderBoard = () => {
  const board = game.getState();

  gameScore.textContent = game.getScore();

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cell = cells[i * 4 + j];
      const value = board[i][j];

      if (value === 0) {
        cell.textContent = '';
        cell.className = 'field-cell';
      } else {
        cell.textContent = value;
        cell.className = `field-cell field-cell--${value}`;
      }
    }
  }
};

const checkStatusGame = () => {
  const currentStatus = game.getStatus();

  if (currentStatus === game.statuses.win) {
    footerTextWin.classList.remove('hidden');
  }

  if (currentStatus === game.statuses.lose) {
    footerTextLose.classList.remove('hidden');
  }
};

mainButton.addEventListener('click', (e) => {
  if (game.getStatus() === game.statuses.idle) {
    game.start();
    renderBoard();
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.textContent = 'Restart';

    footerTextStart.classList.add('hidden');
  } else {
    game.restart();
    renderBoard();
    footerTextWin.classList.add('hidden');
    footerTextLose.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  event.preventDefault();

  if (game.getStatus() === game.statuses.playing) {
    switch (event.key) {
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

    renderBoard();
    checkStatusGame();
  }
});
