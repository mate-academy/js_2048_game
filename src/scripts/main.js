/* eslint-disable no-shadow */
'use strict';

import Game from '../modules/Game.class.js';
// const Game = require('../modules/Game.class');

const game = new Game();

const startButton = document.querySelector('.button');
const gameField = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
  updateBoard();
  updateMessage();
});

function updateBoard() {
  const board = game.getState();

  gameField.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
  scoreElement.textContent = game.getScore();
}

function updateMessage() {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  const nowStatus = game.getStatus();

  if (nowStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (nowStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (nowStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (event.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
    case 'w':
    case 'W':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    updateBoard();
    updateMessage();

    if (game.getStatus() !== 'idle' && startButton.textContent !== 'Restart') {
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
    }
  }
});

updateBoard();
updateMessage();
