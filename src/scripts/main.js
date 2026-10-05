'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.start');
const scoreCount = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState().flat();
  const table = document.querySelectorAll('.field-cell');
  const statusGame = game.getStatus();

  table.forEach((cell, i) => {
    const value = state[i];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });

  scoreCount.textContent = game.getScore();

  if (statusGame === 'playing') {
    startButton.textContent = 'Restart';
    startButton.className = 'button restart';
    messageStart.classList.add('hidden');
  }

  if (statusGame === 'idle') {
    startButton.textContent = 'Start';
    startButton.className = 'button start';
    messageStart.classList.remove('hidden');
    messageLose.className = 'message message-lose hidden';
    messageWin.className = 'message message-win hidden';
  }

  if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

const clickStart = () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
};

startButton.addEventListener('click', clickStart);

const handleMove = (eventK, callback) => {
  eventK.preventDefault();
  callback();
  render();
};

document.addEventListener('keydown', (eventK) => {
  switch (eventK.key) {
    case 'ArrowLeft':
      handleMove(eventK, () => game.moveLeft());
      break;

    case 'ArrowRight':
      handleMove(eventK, () => game.moveRight());
      break;

    case 'ArrowDown':
      handleMove(eventK, () => game.moveDown());
      break;

    case 'ArrowUp':
      handleMove(eventK, () => game.moveUp());
      break;
  }
});
