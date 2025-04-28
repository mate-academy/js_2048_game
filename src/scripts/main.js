'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
// import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here

const scoreElement = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function updateBoardUI() {
  const state = game.getState();

  fieldCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });

  scoreElement.textContent = game.getScore();

  if (game.status === 'win') {
    winMessage.classList.remove('hidden');
  } else if (game.status === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (eve) => {
  if (game.status !== 'playing') {
    // eslint-disable-next-line no-useless-return
    return;
  }

  let moved = false;

  switch (eve.key) {
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
  }

  if (moved) {
    updateBoardUI();
  }
});

startButton.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    startMessage.classList.add('hidden');
  } else {
    game.restart();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.remove('hidden');
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
  }

  updateBoardUI();
});

updateBoardUI();
