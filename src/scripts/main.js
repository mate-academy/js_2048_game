'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const button = document.querySelector('.start');
const score = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  for (let row = 0; row < state.length; row++) {
    for (let column = 0; column < state[row].length; column++) {
      const index = row * state[row].length + column;
      const value = state[row][column];
      const currentCell = cells[index];

      currentCell.textContent = value === 0 ? '' : value;
      currentCell.className = 'field-cell';

      if (value !== 0) {
        currentCell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';

  render();
});

function renderScore() {
  score.textContent = game.getScore();
}

function render() {
  renderBoard();
  renderScore();
  renderMessages();
}

const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

document.addEventListener('keydown', (keyboardEvent) => {
  if (!arrowKeys.includes(keyboardEvent.key)) {
    return;
  }

  keyboardEvent.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  if (keyboardEvent.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (keyboardEvent.key === 'ArrowRight') {
    game.moveRight();
  }

  if (keyboardEvent.key === 'ArrowUp') {
    game.moveUp();
  }

  if (keyboardEvent.key === 'ArrowDown') {
    game.moveDown();
  }

  render();
});

function renderMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}
