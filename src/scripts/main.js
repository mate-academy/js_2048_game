'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  game.start();
  renderBoard(game.getState());
  startButton.className = 'button restart';
  startButton.textContent = 'Restart';
  updateMessage(game.getStatus());
});

document.addEventListener('keydown', (e) => {
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
    default:
      break;
  }

  renderBoard(game.getState());
  updateScore(game.getScore());
  updateMessage(game.getStatus());
});

function renderBoard(state) {
  const cells = document.querySelectorAll('.field-cell');
  let index = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = state[row][col];
      const cell = cells[index];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      index++;
    }
  }
}

function updateScore(scores) {
  const score = document.querySelector('.game-score');

  score.textContent = scores;
}

function updateMessage(gameStatus) {
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  switch (gameStatus) {
    case 'idle':
      startMessage.classList.remove('hidden');
      break;
    case 'win':
      winMessage.classList.remove('hidden');
      break;
    case 'lose':
      loseMessage.classList.remove('hidden');
      break;
    default:
      break;
  }
}
