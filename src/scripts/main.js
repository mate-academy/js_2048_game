'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const score = document.querySelector('.game-score');
const button = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function renderBoard() {
  const board = game.getState();
  let index = 0;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const value = board[row][col];
      const cell = cells[index];

      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      index++;
    }
  }
  score.textContent = game.getScore();
}

function updateControls() {
  const gameStatus = game.getStatus();

  button.classList.remove('start', 'restart');

  if (gameStatus === 'start') {
    button.textContent = 'Start';
    button.classList.add('start');
  } else if (gameStatus === 'playing') {
    button.textContent = 'Restart';
    button.classList.add('restart');
  } else {
    button.textContent = 'Play Again';
    button.classList.add('restart');
  }
}

function updateMessages() {
  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (game.getStatus() === 'win') {
    msgWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    msgLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
      game.moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
      game.moveRight();
      break;
    case 'ArrowUp':
    case 'w':
      game.moveUp();
      break;
    case 'ArrowDown':
    case 's':
      game.moveDown();
      break;
    default:
      return;
  }

  renderBoard();
  updateMessages();
  updateControls();
});

button.addEventListener('click', () => {
  if (game.getStatus() === 'start') {
    game.start();
  } else {
    game.restart();
  }

  renderBoard();
  updateMessages();
  updateControls();
});
