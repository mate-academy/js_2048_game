'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
let isStarted = false;

const gameField = document.querySelector('.game-field');
const startBtn = document.querySelector('.button');
const scoreDisplay = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const cells = gameField.querySelectorAll('.field-cell');
  const board = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreDisplay.textContent = game.getScore();
  updateMessages();
}

function updateMessages() {
  const messageStatus = game.getStatus();

  messageStart.classList.toggle('hidden', messageStatus !== 'idle');
  messageWin.classList.toggle('hidden', messageStatus !== 'win');
  messageLose.classList.toggle('hidden', messageStatus !== 'lose');
}

function handleMove(direction) {
  if (!isStarted) {
    return;
  }

  switch (direction) {
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
  }
  renderBoard();
}

startBtn.addEventListener('click', () => {
  if (!isStarted) {
    game.start();
    isStarted = true;
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
  }
  renderBoard();
});

document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    handleMove(e.key);
  }
});

renderBoard();
