'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const values = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = values[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  button.classList.toggle('start', gameStatus === 'idle');
  button.classList.toggle('restart', gameStatus !== 'idle');
  button.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';
}

button.addEventListener('click', () => {
  if (game.getStatus() !== 'idle') {
    game.restart();
  }

  game.start();
  render();
});

document.addEventListener('keydown', (keyEvent) => {
  switch (keyEvent.key) {
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

  keyEvent.preventDefault();
  render();
});

render();
