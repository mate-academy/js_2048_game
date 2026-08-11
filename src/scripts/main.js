'use strict';

const Game = require('../src/modules/Game.class');

const currentScoreElem = document.querySelector('.game-score');
const startResetElem = document.querySelector('.start');
const gameFieldElem = document.querySelector('.game-field');
const messageStartElem = document.querySelector('.message-start');
const messageWinElem = document.querySelector('.message-win');
const messageLoseElem = document.querySelector('.message-lose');

const game = new Game(undefined, currentScoreElem, startResetElem);

const cellRows = [...gameFieldElem.querySelectorAll('.field-row')];
const cellGrid = cellRows.map((row) => [
  ...row.querySelectorAll('.field-cell'),
]);

function renderBoard() {
  const board = game.getState();

  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const value = board[r][c];
      const cellElem = cellGrid[r][c];

      cellElem.className = 'field-cell';
      cellElem.textContent = '';

      if (value !== 0) {
        cellElem.classList.add(`field-cell--${value}`);
        cellElem.textContent = value;
      }
    }
  }
}

function renderScore() {
  currentScoreElem.textContent = game.getScore();
}

function hideAllMessages() {
  messageStartElem.classList.add('hidden');
  messageWinElem.classList.add('hidden');
  messageLoseElem.classList.add('hidden');
}

function renderStatusMessage() {
  const statusGame = game.getStatus();

  if (statusGame === 'win') {
    messageWinElem.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    messageLoseElem.classList.remove('hidden');
  }
}

function render() {
  renderBoard();
  renderScore();
  renderStatusMessage();
}

const KEY_TO_MOVE = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

startResetElem.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  hideAllMessages();
  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moveFn = KEY_TO_MOVE[e.key];

  if (!moveFn) {
    return;
  }

  e.preventDefault();

  const moved = moveFn();

  if (moved) {
    render();
  }
});
