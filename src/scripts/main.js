'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const buttonElement = document.querySelector('button');
const startMessageElement = document.querySelector('.message-start');
const winMessageElement = document.querySelector('.message-win');
const loseMessageElement = document.querySelector('.message-lose');

const boardCellElements = [[], [], [], []];
const flatCellList = document.querySelectorAll('td.field-cell');
const boardSizeForCells = 4;

for (let i = 0; i < flatCellList.length; i++) {
  const r = Math.floor(i / boardSizeForCells);
  const c = i % boardSizeForCells;

  if (r < boardSizeForCells && c < boardSizeForCells) {
    if (!boardCellElements[r]) {
      boardCellElements[r] = [];
    }
    boardCellElements[r][c] = flatCellList[i];
  }
}

function renderBoard() {
  const board = game.getState();
  const size = game.size;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const value = board[r][c];
      const cellElement = boardCellElements[r][c];

      if (!cellElement) {
        continue;
      }

      cellElement.textContent = value === 0 ? '' : value;

      const previousValue = parseInt(cellElement.dataset.value || '0');

      if (previousValue !== 0) {
        cellElement.classList.remove(`field-cell--${previousValue}`);
      }

      if (value !== 0) {
        cellElement.classList.add(`field-cell--${value}`);
      }
      cellElement.dataset.value = value;
    }
  }
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateStatus() {
  const status1 = game.getStatus();

  startMessageElement.classList.add('hidden');
  winMessageElement.classList.add('hidden');
  loseMessageElement.classList.add('hidden');

  switch (status1) {
    case 'idle':
      startMessageElement.classList.remove('hidden');
      buttonElement.textContent = 'Start';
      buttonElement.classList.add('start');
      buttonElement.classList.remove('restart');
      break;

    case 'playing':
      buttonElement.textContent = 'Restart';
      buttonElement.classList.add('restart');
      buttonElement.classList.remove('start');
      break;

    case 'win':
      winMessageElement.classList.remove('hidden');
      buttonElement.textContent = 'Restart';
      buttonElement.classList.add('restart');
      buttonElement.classList.remove('start');
      break;

    case 'lose':
      loseMessageElement.classList.remove('hidden');
      buttonElement.textContent = 'Restart';
      buttonElement.classList.add('restart');
      buttonElement.classList.remove('start');
      break;
  }
}

function updateUI() {
  renderBoard();
  updateScore();
  updateStatus();
}

function handleButtonClick() {
  const status1 = game.getStatus();

  if (status1 === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateUI();
}

function handleKeyPress(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const key = e.key;
  let moveMade = false;

  switch (key) {
    case 'ArrowUp':
      moveMade = game.moveUp();
      e.preventDefault();
      break;

    case 'ArrowDown':
      moveMade = game.moveDown();
      e.preventDefault();
      break;

    case 'ArrowLeft':
      moveMade = game.moveLeft();
      e.preventDefault();
      break;

    case 'ArrowRight':
      moveMade = game.moveRight();
      e.preventDefault();
      break;
  }

  if (moveMade) {
    updateUI();
  }
}

buttonElement.addEventListener('click', handleButtonClick);
document.addEventListener('keydown', handleKeyPress);

updateUI();
