'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const bestScoreDisplay = document.querySelector('.best-score');
const fieldCells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');
const messageContainer = document.querySelector('.message-container');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const controlButton = document.querySelector('.button.start');

function updateUI() {
  const state = game.getState();

  fieldCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });

  scoreElement.textContent = game.getScore();
}

function updateButton(st) {
  if (st === 'start') {
    controlButton.textContent = 'Start';
    controlButton.classList.remove('restart');
    controlButton.classList.add('start');
  } else if (st === 'restart') {
    controlButton.textContent = 'Restart';
    controlButton.classList.remove('start');
    controlButton.classList.add('restart');
  }
}

controlButton.addEventListener('click', () => {
  const isStart = controlButton.classList.contains('start');

  if (isStart) {
    game.start();
    updateButton('restart');
  } else {
    game.restart();
  }
  updateUI();
  showMessage('start');
});

function showMessage(type) {
  messageContainer
    .querySelectorAll('.message')
    .forEach((msg) => msg.classList.add('hidden'));

  if (type === 'win') {
    messageWin.classList.remove('hidden');
  } else if (type === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (type === 'start') {
    messageStart.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  game.start();
  updateUI();
  showMessage('start');
  messageStart.classList.add('hidden');
});

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (ev.key) {
    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;
    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;
    default:
      break;
  }

  if (moved) {
    updateUI();

    if (game.getStatus() === 'win') {
      showMessage('win');
      updateBestScore(game.getScore());
    } else if (game.getStatus() === 'lose') {
      showMessage('lose');
    }
  }
});

function updateBestScore(newScore) {
  const bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

  if (newScore > bestScore) {
    localStorage.setItem('bestScore', newScore);
    bestScoreDisplay.textContent = newScore;
  } else {
    bestScoreDisplay.textContent = bestScore;
  }
}

window.addEventListener('load', () => {
  game.updateBestScoreDisplay();
});

updateUI();
showMessage('start');
updateButton('start');
updateBestScore(game.getScore());
