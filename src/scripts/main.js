'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

function updateBoard() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    }
  });
}

function updateScore() {
  const gameScore = document.querySelector('.game-score');
  const score = game.getScore();

  gameScore.textContent = score;
}

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function updateMessages() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'playing') {
    messageStart.classList.add('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

function render() {
  updateBoard();
  updateScore();
  updateMessages();
}

const startRestartBtn = document.querySelector('.button');

startRestartBtn.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
    startRestartBtn.classList.remove('start');
    startRestartBtn.classList.add('restart');
    startRestartBtn.textContent = 'Restart';
  } else {
    game.restart();
    startRestartBtn.classList.remove('restart');
    startRestartBtn.classList.add('start');
    startRestartBtn.textContent = 'Start';
  }

  render();
});

document.addEventListener('keydown', (e) => {
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
