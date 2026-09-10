'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const VALUE_CLASS_PREFIX = 'field-cell--';

function renderBoard() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    const cells = fieldRows[rowIndex].querySelectorAll('.field-cell');

    row.forEach((value, colIndex) => {
      const cell = cells[colIndex];

      [...cell.classList]
        .filter((className) => className.startsWith(VALUE_CLASS_PREFIX))
        .forEach((className) => cell.classList.remove(className));

      cell.textContent = value === 0 ? '' : value;

      if (value !== 0) {
        cell.classList.add(`${VALUE_CLASS_PREFIX}${value}`);
      }
    });
  });
}

function renderScore() {
  scoreEl.textContent = game.getScore();
}

function renderMessages() {
  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

function renderButton() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  } else {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
}

function render() {
  renderBoard();
  renderScore();
  renderMessages();
  renderButton();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

const keyToMove = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

document.addEventListener('keydown', (keyEvent) => {
  const move = keyToMove[keyEvent.key];

  if (!move || game.getStatus() !== 'playing') {
    return;
  }

  keyEvent.preventDefault();
  move();
  render();
});

render();
