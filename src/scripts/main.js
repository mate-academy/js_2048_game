'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const score = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const startMsg = document.querySelector('.message-start');
const loseMsg = document.querySelector('.message-lose');
const winMsg = document.querySelector('.message-win');
const fieldsRows = document.querySelectorAll('.field-row');

function renderScore() {
  score.textContent = game.getScore();
}

function renderBoard() {
  const state = game.getState();

  for (let i = 0; i < 4; i++) {
    const tdList = fieldsRows[i].querySelectorAll('.field-cell');

    for (let j = 0; j < 4; j++) {
      const n = state[i][j];
      const cell = tdList[j];

      cell.className = 'field-cell';

      if (n !== 0) {
        cell.classList.add(`field-cell--${n}`);
        cell.textContent = n;
      } else {
        cell.textContent = '';
      }
    }
  }
}

function renderMessages() {
  const statusMsg = game.getStatus();

  startMsg.classList.add('hidden');
  winMsg.classList.add('hidden');
  loseMsg.classList.add('hidden');

  if (statusMsg === 'idle') {
    startMsg.classList.remove('hidden');
  }

  if (statusMsg === 'win') {
    winMsg.classList.remove('hidden');
  }

  if (statusMsg === 'lose') {
    loseMsg.classList.remove('hidden');
  }
}

function updateUI() {
  renderScore();
  renderBoard();
  renderMessages();
}

startBtn.addEventListener('click', (e) => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
    startBtn.textContent = 'Start';
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
  }
  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
});

updateUI();
