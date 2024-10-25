'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class.js');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.start');
let isGameStarted = false;

startButton.addEventListener('click', (e) => {
  const clickedButton = e.target;

  if (!clickedButton) {
    return;
  }

  isGameStarted = !isGameStarted;

  if (isGameStarted) {
    startGame(clickedButton);
  } else {
    restartGame(clickedButton);
  }

  updateGrid(game.getState());
});

document.addEventListener('keydown', (e) => {
  if (!isGameStarted) {
    return;
  }
  e.preventDefault();

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
  }

  updateMessage();
  updateGrid(game.getState());
});

function startGame(button) {
  updateButtonState('Retart', 'start', 'restart');
  updateMessage();

  game.start();
}

function restartGame(button) {
  updateButtonState('Start', 'restart', 'start');
  updateMessage('start');

  game.restart();
}

function updateButtonState(text, removeClass, addClass) {
  startButton.classList.replace(removeClass, addClass);
  startButton.textContent = text;
}

function updateMessage(type = null) {
  document.querySelectorAll('.message').forEach((message) => {
    message.classList.toggle('hidden', true);
  });

  let messageStatus;

  if (type) {
    messageStatus = document.querySelector(`.message-${type}`);
  } else {
    messageStatus = document.querySelector(`.message-${game.getStatus()}`);
  }

  if (messageStatus) {
    messageStatus.classList.toggle('hidden', false);
  }
}

function updateGrid(newGrid) {
  const grid = document.querySelectorAll('.field-row');
  const score = document.querySelector('.game-score');

  score.textContent = game.getScore();

  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      const cell = grid[row].children[column];

      if (newGrid[row][column] !== 0) {
        cell.textContent = newGrid[row][column];

        cell.className = cell.className.replace(/field-cell--\d+/g, '');

        cell.classList.add(`field-cell--${newGrid[row][column]}`);
      } else {
        cell.textContent = '';

        cell.className = cell.className.replace(/field-cell--\d+/g, '');

        cell.className = 'field-cell';
      }
    }
  }
}
