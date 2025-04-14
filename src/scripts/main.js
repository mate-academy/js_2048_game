'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateUI() {
  const state = game.getState();

  gameField.innerHTML = '';

  state.forEach((row) => {
    const fieldRow = document.createElement('tr');

    row.forEach((cell) => {
      const fieldCell = document.createElement('td');

      fieldCell.classList.add('field-cell');

      if (cell > 0) {
        fieldCell.classList.add(`field-cell--${cell}`);
        fieldCell.textContent = cell;
      }
      fieldRow.appendChild(fieldCell);
    });
    gameField.appendChild(fieldRow);
  });
  gameScore.textContent = game.getScore();
  updateMessages();
}

function updateMessages() {
  messageStart.classList.toggle('hidden', game.getStatus() !== 'idle');
  messageWin.classList.toggle('hidden', game.getStatus() !== 'win');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');
}

function handleKeydown(e) {
  switch (e.key) {
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
    default:
      return;
  }
  updateUI();
}

startButton.addEventListener('click', () => {
  game.start();
  updateUI();
  startButton.textContent = 'Restart';
});

document.addEventListener('keydown', handleKeydown);
