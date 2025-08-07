'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const field = document.querySelector('.game-field');

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');

let previousBoard = game.getState().map((row) => [...row]); // за межами функції

function renderBoard() {
  const board = game.getState();

  field.innerHTML = '';

  for (let r = 0; r < board.length; r++) {
    const tr = document.createElement('tr');

    for (let c = 0; c < board[r].length; c++) {
      const td = document.createElement('td');

      td.className = 'field-cell';

      const value = board[r][c];
      const previousValue = previousBoard[r]?.[c];

      if (value !== 0) {
        td.classList.add(`field-cell--${value}`);
        td.textContent = value;

        if (previousValue !== undefined && value > previousValue) {
          td.classList.add('merged');
        }
      }

      tr.appendChild(td);
    }

    field.appendChild(tr);
  }

  previousBoard = board.map((row) => [...row]);
}

function renderMessages() {
  const winMessage = document.querySelector('.message-win');
  const lostMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  winMessage.classList.add('hidden');
  lostMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  const checkStatus = game.getStatus();

  if (checkStatus === 'idle') {
    startMessage.classList.remove('hidden');
  } else if (checkStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (checkStatus === 'lose') {
    lostMessage.classList.remove('hidden');
  }
}

function getBestScore() {
  return parseInt(localStorage.getItem('bestScore')) || 0;
}

function setBestScore(value) {
  localStorage.setItem('bestScore', value.toString());
}

function renderScore(forceReset = false) {
  const scoreEl = document.querySelector('.game-score');
  const bestEl = document.querySelector('.best-score');

  const currentScore = forceReset ? 0 : game.getScore();
  const bestScore = getBestScore();

  scoreEl.textContent = currentScore;

  if (currentScore > bestScore) {
    setBestScore(currentScore);
    bestEl.textContent = currentScore;
  } else {
    bestEl.textContent = bestScore;
  }
}

startButton.addEventListener('click', () => {
  game.start();
  renderBoard();
  renderMessages();
  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  renderScore(true);
});

restartButton.addEventListener('click', () => {
  game.restart();
  renderBoard();
  renderMessages();
  renderScore(true);
});

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    const checkStatus = game.getStatus();

    if (checkStatus !== 'playing') {
      return;
    }

    const moves = {
      ArrowLeft: () => game.moveLeft(),
      ArrowRight: () => game.moveRight(),
      ArrowUp: () => game.moveUp(),
      ArrowDown: () => game.moveDown(),
    };

    if (checkStatus === 'playing' && moves[e.key]) {
      moves[e.key]();
      renderBoard();
      renderMessages();
      renderScore();
    }
  }
});
