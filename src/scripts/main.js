'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const gameTable = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function renderTable() {
  const state = game.getState();
  const gameStatus = game.getStatus();

  for (let row = 0; row < gameTable.rows.length; row++) {
    for (let cell = 0; cell < gameTable.rows[row].cells.length; cell++) {
      const thisCell = gameTable.rows[row].cells[cell];
      const value = state[row][cell];

      if (value !== 0) {
        thisCell.textContent = value;
        thisCell.className = `field-cell field-cell--${value}`;
      } else {
        thisCell.textContent = '';
        thisCell.className = 'field-cell';
      }
    }
  }

  gameScore.textContent = game.getScore();

  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
}

startButton.addEventListener('click', () => {
  if (game.getStatus() !== 'idle') {
    game.restart();
  }

  game.start();

  startButton.classList.replace('start', 'restart');
  startButton.textContent = startButton.dataset.content;

  renderTable();
});

document.addEventListener('keydown', (e) => {
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

  e.preventDefault();

  renderTable();
});
