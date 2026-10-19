'use strict';

// import { Game } from '../modules/Game.class';

// Uncomment the next lines to use your game instance in the browser

import { Game } from '../modules/Game.class.js';

const game = new Game();

const buttonStarts = document.querySelector('.button.start');
const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const win = document.querySelector('.message-win');
const lose = document.querySelector('.message-lose');
const start = document.querySelector('.message-start');

function updateBoard() {
  const board = game.getState();

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;

    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateScore() {
  score.textContent = game.getScore();
}

function handleKeyDown(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!keys.includes(e.key)) {
    return;
  }

  e.preventDefault();

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateBoard();
  updateScore();
  updateMessages();
}

document.addEventListener('keydown', handleKeyDown);

function updateMessages() {
  start.classList.add('hidden');
  lose.classList.add('hidden');
  win.classList.add('hidden');

  if (game.getStatus() === 'idle') {
    start.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    lose.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    win.classList.remove('hidden');
  }
}

function handleStartClick() {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateBoard();
  updateScore();
  updateMessages();
  updateButton();
}

function updateButton() {
  if (game.getStatus() !== 'idle') {
    buttonStarts.textContent = 'Restart';
    buttonStarts.classList.add('restart');
  } else {
    buttonStarts.textContent = 'Start';
  }
}

buttonStarts.addEventListener('click', handleStartClick);

updateMessages();
updateButton();
