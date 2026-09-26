'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');

const gameField = document.querySelector('.game-field');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const state = game.getState().flat();

  for (let index = 0; index < cells.length; index++) {
    const value = state[index];

    cells[index].className = 'field-cell';
    cells[index].textContent = value === 0 ? '' : value;

    if (value !== 0) {
      cells[index].classList.add(`field-cell--${value}`);
    }
  }

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
  } else {
    game.restart();
    game.start();
  }

  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (
    keyboardEvent.key === 'ArrowLeft' ||
    keyboardEvent.key === 'ArrowRight' ||
    keyboardEvent.key === 'ArrowUp' ||
    keyboardEvent.key === 'ArrowDown'
  ) {
    keyboardEvent.preventDefault();
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

  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');

  render();
});

let touchStartX = 0;
let touchStartY = 0;

const minSwipeDistance = 30;

gameField.addEventListener('touchstart', (touchEvent) => {
  touchStartX = touchEvent.touches[0].clientX;
  touchStartY = touchEvent.touches[0].clientY;
});

gameField.addEventListener('touchend', (touchEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const touchEndX = touchEvent.changedTouches[0].clientX;
  const touchEndY = touchEvent.changedTouches[0].clientY;

  const differenceX = touchEndX - touchStartX;
  const differenceY = touchEndY - touchStartY;

  if (
    Math.abs(differenceX) < minSwipeDistance &&
    Math.abs(differenceY) < minSwipeDistance
  ) {
    return;
  }

  if (Math.abs(differenceX) > Math.abs(differenceY)) {
    if (differenceX > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else if (differenceY > 0) {
    game.moveDown();
  } else {
    game.moveUp();
  }

  render();
});

render();
