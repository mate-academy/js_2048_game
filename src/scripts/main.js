'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.start');

function updateMessage() {
  const gameStatus = game.getStatus();
  const messages = document.querySelectorAll('.message');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  messages.forEach((message) => message.classList.add('hidden'));

  switch (gameStatus) {
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
  }
}

function updateScore() {
  const scoreValue = game.getScore();
  const score = document.querySelector('.game-score');

  score.textContent = scoreValue;
}

function updateStartButton() {
  const gameStatus = game.getStatus();

  startButton.textContent = gameStatus === 'playing' ? 'Restart' : 'Start';

  startButton.classList.toggle('start', gameStatus === 'idle');
  startButton.classList.toggle('restart', gameStatus !== 'idle');
}

function renderTable() {
  const rows = document.querySelectorAll('.field-row');

  for (let i = 0; i < 4; i++) {
    const cells = rows[i].querySelectorAll('.field-cell');

    for (let j = 0; j < 4; j++) {
      const state = game.getState();
      const value = state[i][j];

      cells[j].textContent = value === 0 ? '' : value;
      cells[j].className = 'field-cell';

      if (value !== 0) {
        cells[j].classList.add(`field-cell--${value}`);
      }
    }
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    updateStartButton();
  } else {
    game.restart();
    updateScore();
  }

  renderTable();
  updateMessage();
});

window.addEventListener('keyup', (e) => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'playing') {
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
    }
  }

  renderTable();
  updateScore();
  updateMessage();
});

let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

window.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else {
    if (deltaY > 0) {
      game.moveDown();
    } else {
      game.moveUp();
    }
  }

  renderTable();
  updateScore();
  updateMessage();
});

window.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault();
  },
  { passive: false },
);
