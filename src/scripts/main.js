'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const gameStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const value = state[row][column];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
  scoreElement.textContent = game.getScore();
  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  } else {
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  switch (keyboardEvent.key) {
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
  render();
});
render();
