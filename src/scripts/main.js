'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const startBtn = document.querySelector('.button.start');
const restartBtn = document.querySelector('.button.restart');

function render() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  let index = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[index];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      index++;
    }
  }

  scoreEl.textContent = game.getScore();

  updateMessages();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function startGame() {
  game.start();
  render();
}

function restartGame() {
  game.restart();
  render();
}

function handleMove(moveFn) {
  moveFn();
  render();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    handleMove(() => game.moveLeft());
  }

  if (e.key === 'ArrowRight') {
    handleMove(() => game.moveRight());
  }

  if (e.key === 'ArrowUp') {
    handleMove(() => game.moveUp());
  }

  if (e.key === 'ArrowDown') {
    handleMove(() => game.moveDown());
  }
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

render();
