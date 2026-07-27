'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const startBtn = document.querySelector('.button');

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
  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
}

function startGame() {
  game.start();

  startBtn.textContent = 'Restart';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');

  render();
}

function restartGame() {
  game.restart();

  startBtn.textContent = 'Start';
  startBtn.classList.remove('restart');
  startBtn.classList.add('start');

  render();
}

function handleMove(moveFn) {
  moveFn();
  render();
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    startGame();
  } else {
    restartGame();
  }
});

render();
