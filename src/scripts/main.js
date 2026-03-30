'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const startBtn = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const state = game.getState().flat();
  const score = game.getScore();
  const statusone = game.getStatus();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.textContent = value > 0 ? value : '';
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = score;

  const startMsg = document.querySelector('.message-start');
  const winMsg = document.querySelector('.message-win');
  const loseMsg = document.querySelector('.message-lose');

  [startMsg, winMsg, loseMsg].forEach((msg) => msg.classList.add('hidden'));

  if (statusone === 'idle') {
    startMsg.classList.remove('hidden');
  } else if (statusone === 'win') {
    winMsg.classList.remove('hidden');
  } else if (statusone === 'lose') {
    loseMsg.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.add('restart');
  } else {
    game.restart();
  }

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    render();
  }
});
