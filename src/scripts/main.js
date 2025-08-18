'use strict';
// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();
// Write your code here

import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreDisplay = document.querySelector('.game-score');

const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

const boardCells = document.querySelectorAll('.field-cell');
const boardGrid = [];
let currentRow = [];

boardCells.forEach((cell, index) => {
  currentRow.push(cell);

  if ((index + 1) % 4 === 0) {
    boardGrid.push(currentRow);
    currentRow = [];
  }
});

window.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const key = ev.key;

  switch (key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }

  render();
});

function renderBoard() {
  const gameBoard = game.getState();

  boardGrid.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const value = gameBoard[rowIndex][cellIndex];

      cell.textContent = value > 0 ? value : '';
      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

function render() {
  scoreDisplay.textContent = game.getScore();
  renderBoard();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  const currentStatus = game.getStatus();

  if (currentStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  } else if (currentStatus === 'idle') {
    startMessage.classList.remove('hidden');
  }

  if (currentStatus === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

startButton.addEventListener('click', () => {
  game.restart();
  render();
});
