'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const values = game.getState().flat();
  const gameStatus = game.getStatus();
  const isIdle = gameStatus === 'idle';

  cells.forEach((cell, index) => {
    const value = values[index];

    [...cell.classList].forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    cell.textContent = value === 0 ? '' : String(value);

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = String(game.getScore());
  startMessage.classList.toggle('hidden', !isIdle);
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');

  button.textContent = isIdle ? 'Start' : 'Restart';
  button.classList.toggle('start', isIdle);
  button.classList.toggle('restart', !isIdle);
}

button.addEventListener('click', () => {
  if (game.getStatus() !== 'idle') {
    game.restart();
  }

  game.start();
  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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

  keyboardEvent.preventDefault();
  render();
});

render();
