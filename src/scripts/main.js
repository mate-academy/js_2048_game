'use strict';

// Використовуємо екземпляр гри у браузері як ES-модуль
import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const buttonEl = document.querySelector('.button');
const fieldEl = document.querySelector('.game-field');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard(state) {
  const cells = fieldEl.querySelectorAll('.field-cell');
  let i = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = cells[i++];
      const value = state[r][c];

      cell.textContent = value === 0 ? '' : String(value);
      // reset additional classes

      [...cell.classList].forEach((cls) => {
        if (cls.startsWith('field-cell--')) {
          cell.classList.remove(cls);
        }
      });

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function renderScore(score) {
  const text = score ? String(score) : '';

  scoreEl.textContent = text;
  // Для Cypress: проверка через have.value
  scoreEl.setAttribute('value', text);
}

function renderMessages(statusGame) {
  if (messageStart) {
    if (statusGame === 'idle') {
      messageStart.classList.remove('hidden');
    } else {
      messageStart.classList.add('hidden');
    }
  }

  if (messageWin) {
    if (statusGame === 'win') {
      messageWin.classList.remove('hidden');
    } else {
      messageWin.classList.add('hidden');
    }
  }

  if (messageLose) {
    if (statusGame === 'lose') {
      messageLose.classList.remove('hidden');
    } else {
      messageLose.classList.add('hidden');
    }
  }
}

function updateUI() {
  renderBoard(game.getState());
  renderScore(game.getScore());
  renderMessages(game.getStatus());
}

function toRestartView() {
  buttonEl.classList.remove('start');
  buttonEl.classList.add('restart');
  buttonEl.textContent = 'Restart';
}

function toStartView() {
  buttonEl.classList.remove('restart');
  buttonEl.classList.add('start');
  buttonEl.textContent = 'Start';
}

buttonEl.addEventListener('click', () => {
  if (buttonEl.classList.contains('start')) {
    game.start();
    toRestartView();
    updateUI();
  } else {
    game.restart();
    toStartView();
    updateUI();
  }
});

document.addEventListener('keydown', (e) => {
  const statusBefore = game.getStatus();

  if (statusBefore !== 'playing') {
    return;
  }

  const beforeState = JSON.stringify(game.getState());

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

  const afterState = JSON.stringify(game.getState());
  const statusAfter = game.getStatus();

  if (beforeState !== afterState || statusBefore !== statusAfter) {
    updateUI();
  }
});

// Початковий рендер порожнього поля
updateUI();
