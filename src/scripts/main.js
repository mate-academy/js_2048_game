/* eslint-disable function-paren-newline */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();
const field = document.querySelector('.game-field');
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('#ButtonStart');
const messages = {
  start: document.querySelector('.message-start'),
  win: document.querySelector('.message-win'),
  lose: document.querySelector('.message-lose'),
};

function renderBoard() {
  const state = game.getState();

  field.querySelectorAll('.field-cell').forEach((cell) => {
    const [row, col] = cell.dataset.position.split('-').map(Number);
    const value = state[row][col];

    cell.textContent = value > 0 ? value : '';
    cell.className = `field-cell ${value > 0 ? `field-cell--${value}` : ''}`;
  });
  scoreDisplay.textContent = game.getScore();
}

function showMessage(type) {
  Object.values(messages).forEach((msg) => msg.classList.add('hidden'));
  messages[type].classList.remove('hidden');
}

function handleMove(key) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (key === 'ArrowRight') {
    game.moveRight();
  }

  if (key === 'ArrowUp') {
    game.moveUp();
  }

  if (key === 'ArrowDown') {
    game.moveDown();
  }
  renderBoard();

  if (game.getStatus() === 'win') {
    showMessage('win');
  }

  if (game.getStatus() === 'lose') {
    showMessage('lose');
  }
}

startButton.addEventListener('click', () => {
  game.start();
  renderBoard();
  showMessage('');
  startButton.textContent = 'Restart';
});

document.addEventListener('keydown', (event) => handleMove(event.key));
