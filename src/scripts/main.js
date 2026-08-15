'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (game.getStatus() === 'idle') {
    startMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
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
