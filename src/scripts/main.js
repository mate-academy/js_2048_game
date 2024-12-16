/* eslint-disable no-shadow */
'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.button.start');
const scoreDisplay = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.textContent = 'Restart';
  } else {
    game.restart();
  }
  updateUI();
});

document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (event.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }
  game.addRandomTile();
  updateUI();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
});

function updateUI() {
  const state = game.getState();

  gameField.querySelectorAll('.field-cell').forEach((cell, index) => {
    const x = Math.floor(index / 4);
    const y = index % 4;

    cell.textContent = state[x][y] === 0 ? '' : state[x][y];
    cell.className = `field-cell field-cell--${state[x][y] || ''}`;
  });
  scoreDisplay.textContent = game.getScore();
}
