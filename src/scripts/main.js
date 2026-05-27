'use strict';
import Game from '../modules/Game.class';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

function updateButton() {
  const info = game.getStatus();

  if (info !== 'idle') {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
  }
}

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  const info = game.getStatus();

  scoreElement.textContent = score;

  const flatBoard = board.flat();

  cells.forEach((cell, index) => {
    const value = flatBoard[index];

    cell.textContent = value > 0 ? value : '';
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  if (info === 'lose') {
    loseMessage.classList.remove('hidden');
  } else if (info === 'win') {
    winMessage.classList.remove('hidden');
  } else if (info === 'idle') {
    startMessage.classList.remove('hidden');
  }

  updateButton();
}

startButton.addEventListener('click', () => {
  const info = game.getStatus();

  if (info === 'idle') {
    game.start();
    startMessage.classList.add('hidden');
  } else {
    game.restart();
  }

  updateUI();
  startButton.blur();
});

document.addEventListener('keydown', (evt) => {
  const info = game.getStatus();

  if (evt.key === 'Enter') {
    if (info === 'idle') {
      startMessage.classList.add('hidden');
      game.start();
    } else {
      game.restart();
    }
    updateUI();

    return;
  }

  if (info !== 'playing' && info !== 'win') {
    return;
  }

  switch (evt.key) {
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

  updateUI();
});
