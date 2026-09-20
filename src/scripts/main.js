'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const startButton = document.querySelector('button');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

// Write your code here
document.addEventListener('keydown', (e) => {
  if (['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'].includes(e.key)) {
    if (game.getStatus() === 'idle') {
      game.start();
      startButton.className = 'button restart';
      startButton.textContent = 'Restart';
      updateUI();

      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
    }

    updateUI();
  }
});

startButton.addEventListener('click', () => {
  if (startButton.className === 'button restart') {
    game.restart();
  } else {
    game.start();
    startButton.className = 'button restart';
    startButton.textContent = 'Restart';
    document.querySelector('.message-start').classList.add('hidden');
  }

  if (!winMessage.classList.contains('hidden')) {
    winMessage.classList.add('hidden');
  }

  if (!loseMessage.classList.contains('hidden')) {
    loseMessage.classList.add('hidden');
  }

  updateUI();
});

function updateUI() {
  const state = game.getState();

  [...document.querySelectorAll('.field-row')].forEach((row, rowIndex) => {
    [...row.children].forEach((cell, columnIndex) => {
      const value = state[rowIndex][columnIndex];

      if (value !== 0) {
        cell.className = `field-cell field-cell--${value}`;
        cell.textContent = value;
      } else {
        cell.className = `field-cell`;
        cell.textContent = '';
      }
    });
  });

  switch (game.getStatus()) {
    case 'win':
      winMessage.classList.remove('hidden');
      break;
    case 'lose':
      loseMessage.classList.remove('hidden');
      break;
  }

  document.querySelector('.game-score').textContent = game.getScore();
}
