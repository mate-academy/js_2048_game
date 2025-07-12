'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('button');
const cells = [...document.querySelectorAll('.field-cell')];

function updateBoard() {
  const board = game.getState();

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const value = board[row][col];
      const index = row * 4 + col;
      const cell = cells[index];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function updateMessage(gameStatus) {
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

button.addEventListener(
  'click',
  () => {
    game.start();

    updateBoard();

    updateMessage(game.getStatus());
  },
  { once: true },
);

let firstMove = false;

window.addEventListener('keydown', (evnt) => {
  if (
    !firstMove &&
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(evnt.key)
  ) {
    firstMove = true;

    button.className = 'button restart';
    button.textContent = 'Restart';

    button.addEventListener('click', () => {
      game.restart();

      updateBoard();

      updateMessage(game.getStatus());
    });
  }

  const score = document.querySelector('.game-score');

  if (evnt.key === 'ArrowUp') {
    game.moveUp();

    updateBoard();

    score.textContent = game.getScore();
  }

  if (evnt.key === 'ArrowDown') {
    game.moveDown();

    updateBoard();

    score.textContent = game.getScore();
  }

  if (evnt.key === 'ArrowLeft') {
    game.moveLeft();

    updateBoard();

    score.textContent = game.getScore();
  }

  if (evnt.key === 'ArrowRight') {
    game.moveRight();

    updateBoard();

    score.textContent = game.getScore();
  }

  updateMessage(game.getStatus());
});
