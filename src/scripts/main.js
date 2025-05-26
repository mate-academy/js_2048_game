'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');

let isStarted = false;

startButton.addEventListener('click', () => {
  if (!isStarted) {
    game.start();
    isStarted = true;
    startButton.textContent = 'Restart';
    startButton.className = 'button restart';
  } else {
    game.restart();
    isStarted = false;
    startButton.textContent = 'Start';
    startButton.className = 'button start';
    updateMessage();
  }
  createField();
  scoreElement.textContent = game.score;
});

function createField() {
  const cells = document.querySelectorAll('.game-field .field-cell');
  let index = 0;

  for (let i = 0; i < game.size; i++) {
    for (let j = 0; j < game.size; j++) {
      const value = game.board[i][j];
      const cell = cells[index];

      if (value !== 0) {
        cell.textContent = value;
        cell.className = `field-cell field-cell--${value}`;
      } else {
        cell.textContent = '';
        cell.className = `field-cell`;
      }
      index++;
    }
  }

  scoreElement.textContent = game.score;
  updateMessage();
}

function updateMessage() {
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (game.status === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.status === 'idle') {
    messageStart.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    createField();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
    createField();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
    createField();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
    createField();
  }
});
