'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function updateBoard() {
  const state = game.getState();
  const flatState = state.flat();

  cells.forEach((cell, index) => {
    const value = flatState[index];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }

  updateBoard();
  updateScore();
  updateMessages();
});

document.addEventListener('keydown', (clickEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (clickEvent.key) {
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
    default:
      return;
  }

  updateBoard();
  updateScore();
  updateMessages();
});
