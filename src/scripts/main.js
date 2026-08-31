'use strict';

const SWIPE_THRESHOLD = 30;

const Game = require('../modules/Game.class');
const game = new Game();
const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const allMessages = document.querySelectorAll('.message');
const gameField = document.querySelector('.game-field');

let startX = 0;
let startY = 0;

const renderMessage = () => {
  const currentStatus = game.getStatus();

  allMessages.forEach((msg) => msg.classList.add('hidden'));

  if (currentStatus === 'idle') {
    startMessage.classList.remove('hidden');
  } else if (currentStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
};

const render = () => {
  const state = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  gameScore.textContent = String(game.getScore());
};

const handleMove = (moveMethod) => {
  moveMethod();
  render();
  renderMessage();
};

const updateUI = () => {
  render();
  renderMessage();
};

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
  }

  updateUI();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      handleMove(() => game.moveLeft());
      break;
    case 'ArrowRight':
      e.preventDefault();
      handleMove(() => game.moveRight());
      break;
    case 'ArrowUp':
      e.preventDefault();
      handleMove(() => game.moveUp());
      break;
    case 'ArrowDown':
      e.preventDefault();
      handleMove(() => game.moveDown());
      break;
    default:
  }
});

gameField.addEventListener('touchstart', (e) => {
  startX = e.changedTouches[0].clientX;
  startY = e.changedTouches[0].clientY;
});

gameField.addEventListener('touchend', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (
    Math.abs(deltaX) < SWIPE_THRESHOLD &&
    Math.abs(deltaY) < SWIPE_THRESHOLD
  ) {
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      handleMove(() => game.moveRight());
    } else {
      handleMove(() => game.moveLeft());
    }
  } else {
    if (deltaY > 0) {
      handleMove(() => game.moveDown());
    } else {
      handleMove(() => game.moveUp());
    }
  }
});
