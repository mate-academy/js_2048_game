'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// DOM
const scoreEl = document.querySelector('.game-score');
const buttonEl = document.querySelector('.button');
const cells = Array.from(document.querySelectorAll('.field-cell'));

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function setHidden(el, hidden) {
  el.classList.toggle('hidden', hidden);
}

function setButtonMode(mode) {
  if (mode === 'start') {
    buttonEl.classList.add('start');
    buttonEl.classList.remove('restart');
    buttonEl.textContent = 'Start';
  } else {
    buttonEl.classList.remove('start');
    buttonEl.classList.add('restart');
    buttonEl.textContent = 'Restart';
  }
}

function clearCellValueClasses(cell) {
  [...cell.classList].forEach((cls) => {
    if (cls.startsWith('field-cell--')) {
      cell.classList.remove(cls);
    }
  });
}

function render() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus(); // <- zmiana nazwy

  scoreEl.textContent = String(score);

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[r * 4 + c];

      clearCellValueClasses(cell);

      if (value === 0) {
        cell.textContent = '';
      } else {
        cell.textContent = String(value);
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  if (gameStatus === 'idle') {
    setHidden(msgStart, false);
    setHidden(msgWin, true);
    setHidden(msgLose, true);
    setButtonMode('start');
  } else if (gameStatus === 'playing') {
    setHidden(msgStart, true);
    setHidden(msgWin, true);
    setHidden(msgLose, true);
    setButtonMode('restart');
  } else if (gameStatus === 'win') {
    setHidden(msgStart, true);
    setHidden(msgWin, false);
    setHidden(msgLose, true);
    setButtonMode('restart');
  } else if (gameStatus === 'lose') {
    setHidden(msgStart, true);
    setHidden(msgWin, true);
    setHidden(msgLose, false);
    setButtonMode('restart');
  }
}

function startNewGame() {
  game.start();
  render();
}

function restartGame() {
  game.restart();
  game.start();
  render();
}

buttonEl.addEventListener('click', () => {
  const gameStatus = game.getStatus(); // <- zmiana nazwy

  if (gameStatus === 'idle') {
    startNewGame();
  } else {
    restartGame();
  }
});

document.addEventListener('keydown', (e) => {
  // <- zmiana nazwy parametru
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    render();
  }
});

render();
