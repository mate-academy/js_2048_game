'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

import Game from '../modules/Game.class.js';

const SIZE = 4;

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

let hasMadeFirstMove = false;

function renderBoard() {
  const state = game.getState();

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const index = r * SIZE + c;
      const tile = cells[index];
      const value = state[r][c];

      tile.textContent = '';

      tile.classList.remove(
        'field-cell--2',
        'field-cell--4',
        'field-cell--8',
        'field-cell--16',
        'field-cell--32',
        'field-cell--64',
        'field-cell--128',
        'field-cell--256',
        'field-cell--512',
        'field-cell--1024',
        'field-cell--2048',
      );

      if (value !== 0) {
        tile.textContent = String(value);
        tile.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function renderScore() {
  scoreElement.textContent = String(game.getScore());
}

function renderMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
}

function updateButtonAfterFirstMove() {
  if (!hasMadeFirstMove) {
    hasMadeFirstMove = true;
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
}

function fullRender() {
  renderBoard();
  renderScore();
  renderMessages();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    fullRender();

    return;
  }

  game.restart();
  hasMadeFirstMove = false;
  button.textContent = 'Start';
  button.classList.remove('restart');
  button.classList.add('start');
  fullRender();
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
    updateButtonAfterFirstMove();
    fullRender();
  }
});
