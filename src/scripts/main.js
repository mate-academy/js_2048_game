'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const table = document.querySelector('.game-field');
const scoreDisplay = document.querySelector('.game-score');
const mainButton = document.querySelector('.start');
const message = document.querySelector('.message-start');

function render() {
  const state = game.getState();
  const cells = table.querySelectorAll('.field-cell');

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.className = 'field-cell';

    if (value) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });

  scoreDisplay.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

mainButton.addEventListener('click', () => {
  if (mainButton.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }

  if (message) {
    message.classList.add('hidden');
  }

  document
    .querySelectorAll('.message')
    .forEach((msg) => msg.classList.add('hidden'));
  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    if (mainButton.classList.contains('start')) {
      mainButton.classList.remove('start');
      mainButton.classList.add('restart');
      mainButton.textContent = 'Restart';
    }
  }
  render();
});
