'use strict';
import Game from '../modules/Game.class.js';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
const game = new Game();
const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else if (game.getStatus() === 'playing') {
    const confirmRestart = confirm(
      'You already have a match in progress. Do you really want to restart?',
    );

    if (confirmRestart) {
      restartGame();
    }
  } else {
    restartGame();
  }

  startButton.classList.remove('highlight-restart');
  renderBoard();
});

// Listener teclado
window.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
      return;
  }

  renderBoard();
});

function renderBoard() {
  const board = game.getState();
  const flatBoard = board.flat();
  const cells = document.querySelectorAll('.field-cell');

  const scoreElement = document.querySelector('.game-score');
  const startMsg = document.querySelector('.message-start');
  const winMsg = document.querySelector('.message-win');
  const loseMsg = document.querySelector('.message-lose');

  if (game.getStatus() !== 'idle') {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  }

  if (scoreElement) {
    scoreElement.textContent = game.getScore();
  }

  if (game.getStatus() === 'playing') {
    if (startMsg) {
      startMsg.classList.add('hidden');
    }
    winMsg.classList.add('hidden');
    loseMsg.classList.add('hidden');
  } else if (game.getStatus() === 'win') {
    winMsg.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    loseMsg.classList.remove('hidden');
    startButton.classList.add('highlight-restart');
  }

  cells.forEach((cell, index) => {
    const value = flatBoard[index];
    const previousValue = cell.textContent;

    cell.textContent = value > 0 ? value : '';

    cell.classList.forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);

      if (!previousValue && value > 0) {
        cell.classList.add('tile-new');
      } else {
        cell.classList.remove('tile-new');
      }

      if (previousValue && String(previousValue) !== String(value)) {
        cell.classList.add('tile-merged');
      } else {
        cell.classList.remove('tile-merged');
      }
    } else {
      cell.classList.remove('tile-new', 'tile-merged');
    }
  });
}

function restartGame() {
  game.restart();
  startButton.textContent = 'Restart';
  startButton.classList.remove('highlight-restart');
  renderBoard();
}
