'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');

button.addEventListener('click', () => {
  button.classList.toggle('start');
  button.classList.toggle('restart');

  if (button.classList.contains('restart')) {
    button.textContent = 'Restart';

    game.start();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        game.moveDown();
        updateGame();
      } else if (e.key === 'ArrowUp') {
        game.moveUp();
        updateGame();
      } else if (e.key === 'ArrowRight') {
        game.moveRight();
        updateGame();
      } else if (e.key === 'ArrowLeft') {
        game.moveLeft();
        updateGame();
      }
    });

    updateGame();
  } else {
    button.textContent = 'Start';

    game.restart();
    updateGame();
  }
});

function updateGame() {
  updateScore();
  updateBoard();
  updateMessage();
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateBoard() {
  const state = game.getState();

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      const cell = fieldCells[i * state.length + j];

      cell.textContent = state[i][j] === 0 ? '' : state[i][j];
      cell.className = 'field-cell';

      if (state[i][j] !== 0) {
        cell.classList.add(`field-cell--${state[i][j]}`);
      }
    }
  }
}

function updateMessage() {
  const statusUpdate = game.getStatus();

  if (statusUpdate === Game.STATUS_LOSE) {
    showMessage('.message-lose');
  } else if (statusUpdate === Game.STATUS_WIN) {
    showMessage('.message-win');
  } else if (statusUpdate === Game.STATUS_PLAYING) {
    showMessage('.message-start');
  }
}

function showMessage(selector) {
  const messages = document.querySelectorAll('.message');

  messages.forEach((message) => message.classList.add('hidden'));

  const messageToShow = document.querySelector(selector);

  messageToShow.classList.remove('hidden');
}
