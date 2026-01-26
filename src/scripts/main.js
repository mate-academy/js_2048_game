'use strict';

import Game from './Game.class';

const game = new Game();

const cells = [...document.querySelectorAll('.field-cell')];
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  msgWin.classList.toggle('hidden', game.getStatus() !== 'win');
  msgLose.classList.toggle('hidden', game.getStatus() !== 'lose');
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    msgStart.classList.add('hidden');
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }

  render();
});

document.addEventListener('keydown', (e) => {
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
  }

  if (moved) {
    render();
  }
});
