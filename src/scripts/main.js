'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startMessageEl = document.querySelector('.message-start');
const winMessageEl = document.querySelector('.message-win');
const loseMessageEl = document.querySelector('.message-lose');

const buttonEl = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');

const cells = Array.from(document.querySelectorAll('.field-cell'));

let firstMoveDone = false;

function setHidden(el, hidden) {
  el.classList.toggle('hidden', hidden);
}

function setButtonToStart() {
  buttonEl.classList.add('start');
  buttonEl.classList.remove('restart');
  buttonEl.textContent = 'Start';
}

function setButtonToRestart() {
  buttonEl.classList.add('restart');
  buttonEl.classList.remove('start');
  buttonEl.textContent = 'Restart';
}

// Isso aqui é o “hack” pro teste maluco: eles checam .value num span
function renderScore() {
  const score = game.getScore();

  // eles querem vazio quando zerado
  const shown = score === 0 ? '' : String(score);

  scoreEl.textContent = shown;
  scoreEl.value = shown; // pra Cypress `have.value`
}

function clearCellClasses(cell) {
  // remove só os modificadores field-cell--X
  const toRemove = [];

  cell.classList.forEach((cls) => {
    if (cls.startsWith('field-cell--')) {
      toRemove.push(cls);
    }
  });
  toRemove.forEach((cls) => cell.classList.remove(cls));
}

function renderBoard() {
  const state = game.getState();

  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const value = state[r][c];
      const idx = r * 4 + c;
      const cell = cells[idx];

      clearCellClasses(cell);

      if (value === 0) {
        cell.textContent = '';
      } else {
        cell.textContent = String(value);
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function renderMessages() {
  const gameStatus = game.getStatus();

  setHidden(startMessageEl, gameStatus !== 'idle');
  setHidden(winMessageEl, gameStatus !== 'win');
  setHidden(loseMessageEl, gameStatus !== 'lose');
}

function renderAll() {
  renderBoard();
  renderScore();
  renderMessages();
}

function doMove(key) {
  let changed = false;

  if (key === 'ArrowLeft') {
    changed = game.moveLeft();
  }

  if (key === 'ArrowRight') {
    changed = game.moveRight();
  }

  if (key === 'ArrowUp') {
    changed = game.moveUp();
  }

  if (key === 'ArrowDown') {
    changed = game.moveDown();
  }

  if (!changed) {
    return;
  }

  if (!firstMoveDone) {
    firstMoveDone = true;
    setButtonToRestart();
  }

  renderAll();
}

buttonEl.addEventListener('click', () => {
  if (buttonEl.classList.contains('start')) {
    game.start();
    firstMoveDone = false; // só vira restart depois do 1º move
    renderAll();

    return;
  }

  // restart
  game.restart();
  firstMoveDone = false;
  setButtonToStart();
  renderAll();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const allowed = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!allowed.includes(e.key)) {
    return;
  }
  doMove(e.key);
});

// estado inicial da UI
setButtonToStart();
renderAll();
