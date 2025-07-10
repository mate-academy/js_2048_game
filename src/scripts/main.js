'use strict';

// import Game from '../modules/Game.class';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const buttonStart = document.querySelector('.button.start');

const renderBoard = () => {
  const boardGame = game.getState();
  const scoreGame = game.getScore();
  const statusGame = game.getStatus();

  scoreElement.textContent = scoreGame;

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = boardGame[row][col];

    if (value === 0) {
      cell.textContent = '';
    } else {
      cell.textContent = value;
    }

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  }

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
};

document.addEventListener('keydown', (e) => {
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
  }

  renderBoard();
});

buttonStart.addEventListener('click', () => {
  const statusButton = game.getStatus();

  if (statusButton === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');
  buttonStart.textContent = 'Restart';

  renderBoard();
});
