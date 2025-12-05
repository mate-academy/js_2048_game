'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function init() {
  addEventListeners();
  updateUI();
}

function addEventListeners() {
  startButton.addEventListener('click', handleButtonClick);
  document.addEventListener('keydown', handleKeyPress);
}

function handleButtonClick() {
  const currentStatus = game.getStatus();

  if (currentStatus === Game.STATUSES.IDLE) {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');
  }

  updateUI();
}

function handleKeyPress(evt) {
  if (game.getStatus() !== Game.STATUSES.PLAYING) {
    return;
  }

  const keyActions = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const action = keyActions[evt.key];

  if (action) {
    evt.preventDefault();
    action();
    checkGameStatus();
    updateUI();
  }
}

function updateUI() {
  const state = game.getState();
  const score = game.getScore();

  updateBoard(state);
  updateScore(score);
}

function updateBoard(state) {
  state.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cellIndex = rowIndex * 4 + colIndex;
      const cell = cells[cellIndex];

      const currentValue = cell.dataset.value
        ? parseInt(cell.dataset.value, 10)
        : 0;

      if (currentValue !== value) {
        cell.className = 'field-cell';
        cell.dataset.value = value;

        if (value) {
          cell.classList.add(`field-cell--${value}`);
          cell.textContent = value;
        } else {
          cell.textContent = '';
        }
      }
    });
  });
}

function updateScore(score) {
  scoreElement.textContent = score;
}

function checkGameStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === Game.STATUSES.WIN) {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === Game.STATUSES.LOSE) {
    messageLose.classList.remove('hidden');
  }
}

init();
