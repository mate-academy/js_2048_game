'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const btn = document.querySelector('.button');
const cells = Array.from(document.querySelectorAll('.field-cell'));
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function valueToClass(v) {
  return v ? `field-cell--${v}` : '';
}

function render() {
  const state = game.getState();
  let k = 0;

  for (let i = 0; i < game.size; i++) {
    for (let j = 0; j < game.size; j++, k++) {
      const v = state[i][j];
      const cell = cells[k];

      cell.className = 'field-cell';

      if (v) {
        cell.classList.add(valueToClass(v));
      }
      cell.textContent = v ? String(v) : '';
    }
  }

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  msgStart.classList.toggle('hidden', gameStatus !== 'idle');
  msgWin.classList.toggle('hidden', gameStatus !== 'win');
  msgLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'idle') {
    btn.textContent = 'Start';
    btn.classList.remove('restart');
    btn.classList.add('start');
  } else {
    btn.textContent = 'Restart';
    btn.classList.remove('start');
    btn.classList.add('restart');
  }
}

function startGame() {
  game.start();
  render();
}

function restartGame() {
  game.restart();
  render();
}

btn.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    startGame();
  } else {
    restartGame();
  }
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
  }

  if (moved) {
    render();
  }
});

render();
