'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const GRID_SIZE = 4;

const cells = Array.from(document.querySelectorAll('.field-cell'));
const buttonStart = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const messageWinElement = document.querySelector('.message-win');
const messageLoseElement = document.querySelector('.message-lose');
const messageStartElement = document.querySelector('.message-start');

const keyActions = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

const handleKeyDown = (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const action = keyActions[e.key];

  if (action) {
    action();
    updateView();
  }
};

const updateCellsView = () => {
  const state = game.getState();
  let cellIndex = 0;

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = cells[cellIndex];
      const cellValue = state[row][col];

      cell.className = 'field-cell';

      if (cellValue) {
        cell.textContent = cellValue;
        cell.classList.add(`field-cell--${cellValue}`);
      } else {
        cell.textContent = '';
      }

      cellIndex += 1;
    }
  }
};

const updateScoreView = () => {
  scoreElement.textContent = game.getScore();
};

const updateGameStatusView = () => {
  const currentStatus = game.getStatus();

  if (currentStatus === 'win') {
    messageWinElement.classList.remove('hidden');
  }

  if (currentStatus === 'lose') {
    messageLoseElement.classList.remove('hidden');
  }
};

const updateView = () => {
  updateCellsView();
  updateScoreView();
  updateGameStatusView();
};

const resetMessages = () => {
  messageWinElement.classList.add('hidden');
  messageLoseElement.classList.add('hidden');
  messageStartElement.classList.add('hidden');
};

const startNewGame = () => {
  if (buttonStart.classList.contains('restart')) {
    game.restart();
  }

  game.start();
  resetMessages();
  updateView();

  buttonStart.textContent = 'Restart';
  buttonStart.className = 'button restart';
};

document.addEventListener('keydown', handleKeyDown);
buttonStart.addEventListener('click', startNewGame);
