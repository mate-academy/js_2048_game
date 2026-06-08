'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const actionButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let previousBoard = [];

actionButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    previousBoard = [];
  }

  startMessage.classList.add('hidden');
  actionButton.classList.remove('start');
  actionButton.classList.add('restart');
  actionButton.textContent = 'Restart';

  renderBoard();
});

function renderBoard() {
  scoreElement.textContent = game.getScore();

  const flatBoard = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = flatBoard[index];
    const prevValue = previousBoard[index] || 0;

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);

      if (prevValue === 0) {
        cell.classList.add('tile-new');
      } else if (value > prevValue) {
        cell.classList.add('tile-merged');
      }
    }
  });

  previousBoard = [...flatBoard];
}

renderBoard();

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const boardBefore = JSON.stringify(game.getState());

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  } else {
    return;
  }

  const boardAfter = JSON.stringify(game.getState());

  if (boardBefore !== boardAfter) {
    renderBoard();
  }

  const currentStatus = game.getStatus();

  if (currentStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
});
