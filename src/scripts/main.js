'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const scoreDisplay = document.querySelector('.game-score');
const bestScoreDisplay = document.querySelector('.best-score');
const startButton = document.querySelector('.button');
const messages = {
  start: document.querySelector('.message-start'),
  win: document.querySelector('.message-win'),
  lose: document.querySelector('.message-lose'),
};

function updateUI() {
  const state = game.getState();
  const cells = gameField.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreDisplay.textContent = game.getScore();
  updateButtonAppearance();
  updateBestScore(game.getScore());
  updateMessages();
}

function updateButtonAppearance() {
  const updateStatus = game.getStatus();

  if (updateStatus === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  }
}

function updateMessages() {
  Object.values(messages).forEach((msg) => msg.classList.add('hidden'));

  switch (game.getStatus()) {
    case 'idle':
      messages.start.classList.remove('hidden');
      break;
    case 'win':
      messages.win.classList.remove('hidden');
      break;
    case 'lose':
      messages.lose.classList.remove('hidden');
      break;
  }
}

function updateBestScore(newScore) {
  const bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

  if (newScore > bestScore) {
    localStorage.setItem('bestScore', newScore);
    bestScoreDisplay.textContent = newScore;
  } else {
    bestScoreDisplay.textContent = bestScore;
  }
}

document.addEventListener('keydown', (vnt) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (vnt.key) {
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
  }

  if (moved) {
    updateUI();
  }
});

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
});

updateUI();
