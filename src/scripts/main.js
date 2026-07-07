'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.start');
const fieldCells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');

startButton.addEventListener('click', () => {
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  if (game.getStatus() === 'lose') {
    loseMessage.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    messageStart.classList.add('hidden');
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateUI();
});

function updateUI() {
  const flatMatrix = game.getState().flat();

  fieldCells.forEach((item, index) => {
    const value = flatMatrix[index];

    item.className = 'field-cell';
    item.textContent = '';

    if (value > 0) {
      item.textContent = value;
      item.classList.add(`field-cell--${value}`);
    }
  });

  if (Number(score.textContent) !== game.getScore()) {
    score.textContent = game.getScore();
  }
}

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (ev.key) {
    case 'ArrowRight': {
      game.moveRight();
      break;
    }

    case 'ArrowLeft': {
      game.moveLeft();
      break;
    }

    case 'ArrowDown': {
      game.moveDown();
      break;
    }

    case 'ArrowUp': {
      game.moveUp();
      break;
    }

    default: {
      return;
    }
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  updateUI();
});
