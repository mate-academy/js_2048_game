'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const button = document.querySelector('.start');

function render(prevState = null) {
  const state = game.getState();

  score.textContent = game.getScore();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    const value = state[row][col];
    const prevValue = prevState?.[row]?.[col] ?? 0;

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';
    cell.classList.add(`field-cell--${value}`);

    if (prevValue === 0 && value !== 0) {
      cell.classList.add('new');
    }

    if (value !== 0 && value === prevValue * 2) {
      cell.classList.add('merge');
    }

    setTimeout(() => {
      cell.classList.remove('new');
      cell.classList.remove('merge');
    }, 200);
  });

  showMessage();
}

let previousState = game.getState();

function handleMove(moveFn) {
  previousState = game.getState();
  moveFn();
  render(previousState);
}

function showMessage() {
  const gameStatus = game.getStatus();
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gameStatus === 'idle') {
    startMessage.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  if (gameStatus !== 'idle') {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
}

function updateBestScore() {
  const savedBest = localStorage.getItem('bestScore');
  let bestScore = Number(savedBest);

  if (Number.isNaN(bestScore)) {
    bestScore = 0;
  }

  const updatedBest = Math.max(game.getScore(), bestScore);

  localStorage.setItem('bestScore', updatedBest);

  const bestScoreElement = document.querySelector('.best-score');

  bestScoreElement.textContent = updatedBest;
}

document.querySelector('.start').addEventListener('click', () => {
  game.start();
  render();
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  if (e.key === 'ArrowLeft') {
    handleMove(() => game.moveLeft());
    moved = true;
  }

  if (e.key === 'ArrowRight') {
    handleMove(() => game.moveRight());
    moved = true;
  }

  if (e.key === 'ArrowUp') {
    handleMove(() => game.moveUp());
    moved = true;
  }

  if (e.key === 'ArrowDown') {
    handleMove(() => game.moveDown());
    moved = true;
  }

  if (!moved) {
    return;
  }

  const gameStatus = game.getStatus();

  if (gameStatus === 'win' || gameStatus === 'lose') {
    updateBestScore();
  }
});

let startX = 0;
let startY = 0;

document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const diffX = endX - startX;
  const diffY = endY - startY;

  const absX = Math.abs(diffX);
  const absY = Math.abs(diffY);

  if (Math.max(absX, absY) < 20) {
    return;
  }

  if (absX > absY) {
    if (diffX > 0) {
      handleMove(() => game.moveRight());
    } else {
      handleMove(() => game.moveLeft());
    }
  } else {
    if (diffY > 0) {
      handleMove(() => game.moveDown());
    } else {
      handleMove(() => game.moveUp());
    }
  }

  const gameStatus = game.getStatus();

  if (gameStatus === 'win' || gameStatus === 'lose') {
    updateBestScore();
  }
});
