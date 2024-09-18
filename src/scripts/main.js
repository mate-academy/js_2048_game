'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const field = document.querySelector('.game-field');
const score = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if (startButton.textContent === 'Start') {
    game.start();
    messageStart.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else if (startButton.textContent === 'Restart') {
    game.restart();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    messageStart.classList.remove('hidden');
  }
  updateField();
  updateScore();
});

function updateScore() {
  score.textContent = game.getScore();
}

function updateMessage() {
  if (game.getStatus() === game.statusEnum.win) {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === game.statusEnum.lose) {
    messageLose.classList.remove('hidden');
  }
}

function updateField() {
  field.innerHTML = '';

  const state = game.getState();

  for (let row = 0; row < state.length; row++) {
    const tr = document.createElement('tr');

    for (let column = 0; column < state[row].length; column++) {
      const cell = document.createElement('td');

      const cellValue = state[row][column];

      cell.textContent = cellValue !== 0 ? cellValue : '';
      cell.classList.add('field-cell');

      if (cellValue !== 0) {
        cell.classList.add(`field-cell--${cellValue}`);
      }
      tr.appendChild(cell);
    }
    field.appendChild(tr);
  }
}

function keyPress() {
  document.addEventListener('keydown', handlePress);
}

function handlePress(e) {
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
  updateField();
  updateScore();
  updateMessage();
}
keyPress();
