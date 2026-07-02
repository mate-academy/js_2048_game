'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let firstMove = false;

function render() {
  const board = game.getState();

  score.textContent = game.getScore();

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });

  board.flat().forEach((value, index) => {
    if (value !== 0) {
      cells[index].textContent = value;
      cells[index].classList.add(`field-cell--${value}`);
    }
  });

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

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

    startMessage.classList.add('hidden');
  } else {
    game.restart();

    firstMove = false;

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');

    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
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

  if (!firstMove) {
    firstMove = true;

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }

  render();
});

render();
