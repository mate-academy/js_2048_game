'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreContainer = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message.message-start');
const messageWin = document.querySelector('.message.message-win');
const messageLose = document.querySelector('.message.message-lose');

const updateUI = () => {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const cellValue = state[row][col];

    if (cell.textContent !== cellValue.toString()) {
      cell.textContent = cellValue === 0 ? '' : cellValue;
      cell.className = `field-cell field-cell--${cellValue}`;
    }
  });

  scoreContainer.textContent = game.getScore();

  switch (game.getStatus()) {
    case 'win':
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
      messageStart.classList.add('hidden');
      break;

    case 'lose':
      messageLose.classList.remove('hidden');
      messageWin.classList.add('hidden');
      messageStart.classList.add('hidden');
      break;

    case 'playing':
      messageLose.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageStart.classList.add('hidden');
      break;

    default:
      messageLose.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageStart.classList.remove('hidden');
  }
};

const handleMove = (e) => {
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
  e.preventDefault();

  updateUI();
};

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    startButton.classList.remove('start');
    game.start();
  } else {
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    game.restart();
  }

  updateUI();
});

document.addEventListener('keydown', handleMove);

updateUI();
