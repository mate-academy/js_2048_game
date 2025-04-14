'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const gameField = document.querySelector('.game-field');
const scoreDisplay = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if (startButton.textContent === 'Start') {
    game.start();
    startMessage.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else if (startButton.textContent === 'Restart') {
    game.restart();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    startMessage.classList.remove('hidden');
  }
  updateGameField();
  updateScoreDisplay();
});

function updateScoreDisplay() {
  scoreDisplay.textContent = game.getScore();
}

function updateGameMessage() {
  if (game.getStatus() === game.gameStatus.win) {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === game.gameStatus.lose) {
    loseMessage.classList.remove('hidden');
  }
}

function updateGameField() {
  gameField.innerHTML = '';

  const state = game.getState();

  for (let row = 0; row < state.length; row++) {
    const tableRow = document.createElement('tr');

    for (let column = 0; column < state[row].length; column++) {
      const tableCell = document.createElement('td');
      const cellValue = state[row][column];

      tableCell.textContent = cellValue !== 0 ? cellValue : '';
      tableCell.classList.add('field-cell');

      if (cellValue !== 0) {
        tableCell.classList.add(`field-cell--${cellValue}`);
      }
      tableRow.appendChild(tableCell);
    }
    gameField.appendChild(tableRow);
  }
}

function handleKeyPress() {
  document.addEventListener('keydown', handleKeyInput);
}

function handleKeyInput(e) {
  switch (e.key) {
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

    default:
      break;
  }
  updateGameField();
  updateScoreDisplay();
  updateGameMessage();
}

handleKeyPress();
