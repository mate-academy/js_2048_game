'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const cells = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');

const renderBoard = () => {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';

    cell.textContent = value === 0 ? '' : value;

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
};

const renderScore = () => {
  scoreElement.innerText = game.getScore();
};

const renderStatus = () => {
  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }
};

const renderButton = () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  } else {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
};

const onButtonClick = () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
};

button.addEventListener('click', onButtonClick);

const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

const onKeyDown = (e) => {
  if (!allowedKeys.includes(e.key)) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  render();
};

document.addEventListener('keydown', onKeyDown);

const render = () => {
  renderBoard();
  renderScore();
  renderStatus();
  renderButton();
};

render();
