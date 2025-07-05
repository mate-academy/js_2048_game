'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
  if (btn.classList.contains('button--start')) {
    game.start();
    renderBoard(game.getState());
    updateUIByStatus(game.getStatus());
    btn.classList.replace('button--start', 'button--restart');
    btn.textContent = 'Restart';
  } else if (btn.classList.contains('button--restart')) {
    game.restart();
    renderBoard(game.getState());
    updateUIByStatus(game.getStatus());
  }
});

window.addEventListener('keydown', (e) => {
  const direction = e.key;
  let moved = false;

  if (game.status === 'idle') {
    game.start();
    updateUIByStatus(game.getStatus());
    renderBoard(game.getState());

    return;
  }

  if (game.status === 'win') {
    return;
  }

  if (direction === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (direction === 'ArrowRight') {
    moved = game.moveRight();
  }

  if (direction === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (direction === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    if (game.checkWin()) {
      updateUIByStatus(game.getStatus());
    } else if (game.checkLose()) {
      updateUIByStatus(game.getStatus());
    }
    renderBoard(game.getState());
  }
});

function renderBoard(state) {
  const cells = document.querySelectorAll('.field-cell');

  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = state[row][col];
    const cell = cells[i];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell'; // очищення стилів

    if (value) {
      cell.classList.add(`tile-${value}`);
    }
  }

  for (let i = 0; i < cells.length; i++) {
    const value = cells[i].textContent;

    if (value) {
      cells[i].classList.add(`field-cell--${value}`);
    }
  }
  document.querySelector('.game-score').textContent = game.getScore();
}

function updateUIByStatus(st) {
  const massage = document.querySelector('.message-start');
  const loseMessage = document.querySelector('.message-lose');
  const winMessage = document.querySelector('.message-win');

  if (st === 'idle') {
    massage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    btn.classList.add('start');
    btn.classList.remove('restart');
  }

  if (st === 'win') {
    winMessage.classList.remove('hidden');
    massage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  if (st === 'lose') {
    loseMessage.classList.remove('hidden');
    massage.classList.add('hidden');
    winMessage.classList.add('hidden');
  }

  if (st === 'playing') {
    winMessage.classList.add('hidden');
    massage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    btn.classList.add('restart');
    btn.classList.remove('start');
  }
}

if (btn.classList.contains('start')) {
  btn.textContent = 'Start';
}

if (btn.classList.contains('restart')) {
  btn.textContent = 'Restart';
}
