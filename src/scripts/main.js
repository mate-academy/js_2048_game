'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState().flat();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.className = 'field-cell';
    cell.textContent = value === 0 ? '' : value;

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = score;
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  msgStart.classList.add('hidden');

  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
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
