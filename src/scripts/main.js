'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const startButton = document.querySelector('.button.start');
let isGameStarted = false;
const startMessage = document.querySelector('.message.message-start');
const scoreElement = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if (isGameStarted) {
    game.restart();
    isGameStarted = false;

    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startMessage.classList.remove('hidden');
  } else {
    game.start();
    isGameStarted = true;

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startMessage.classList.add('hidden');
  }
  updateField();
});

// const gameField = document.querySelector('.game-field');
const cells = document.querySelectorAll('.field-cell');

function updateField() {
  const winMessage = document.querySelector('.message.message-win');
  const loseMessage = document.querySelector('.message.message-lose');

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  const gameStatus = game.getStatus();

  const state = game.getState();

  scoreElement.textContent = game.getScore();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      const value = state[i][j];

      for (const className of cells[index].classList) {
        if (className.startsWith('field-cell--')) {
          cells[index].classList.remove(className);
        }
      }

      if (value !== 0) {
        cells[index].classList.add(`field-cell--${value}`);
      }
      cells[index].textContent = value || '';
    }
  }

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (eventClick) => {
  if (!isGameStarted) {
    return;
  }

  if (eventClick.key === 'ArrowLeft') {
    game.moveLeft();
    updateField();
    startButton.textContent = 'Restart';
  } else if (eventClick.key === 'ArrowRight') {
    game.moveRight();
    updateField();
    startButton.textContent = 'Restart';
  } else if (eventClick.key === 'ArrowUp') {
    game.moveUp();
    updateField();
    startButton.textContent = 'Restart';
  } else if (eventClick.key === 'ArrowDown') {
    game.moveDown();
    updateField();
    startButton.textContent = 'Restart';
  }
});
