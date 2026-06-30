'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    const cells = fieldRows[r].querySelectorAll('.field-cell');

    for (let c = 0; c < 4; c++) {
      const cell = cells[c];
      const value = state[r][c];

      // Remove any previous value classes
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    }
  }
}

function renderScore() {
  scoreEl.textContent = game.getScore();
}

function renderMessages() {
  const gameStatus = game.getStatus();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gameStatus === Game.Status.IDLE) {
    startMessage.classList.remove('hidden');
  }

  if (gameStatus === Game.Status.WIN) {
    winMessage.classList.remove('hidden');
  }

  if (gameStatus === Game.Status.LOSE) {
    loseMessage.classList.remove('hidden');
  }
}

function render() {
  renderBoard();
  renderScore();
  renderMessages();
}

function updateButton() {
  if (game.getStatus() === Game.Status.IDLE) {
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  } else {
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === Game.Status.IDLE) {
    game.start();
  } else {
    game.restart();
  }

  updateButton();
  render();
});

document.addEventListener('keydown', (keyEvent) => {
  if (game.getStatus() !== Game.Status.PLAYING) {
    return;
  }

  switch (keyEvent.key) {
    case 'ArrowLeft':
      keyEvent.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
      keyEvent.preventDefault();
      game.moveRight();
      break;
    case 'ArrowUp':
      keyEvent.preventDefault();
      game.moveUp();
      break;
    case 'ArrowDown':
      keyEvent.preventDefault();
      game.moveDown();
      break;
    default:
      return;
  }

  render();
});

render();
updateButton();
