'use strict';
/* eslint-disable */

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
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
    renderGame();
  }
});

document.querySelector('.button').addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    console.log('dwddaw');
    game.start();
  } else {
    game.restart();
  }

  renderGame();
});

function renderGame() {
  const board = game.getState(); // матриця
  //   console.log(board)

  const cells = document.querySelectorAll('.field-cell');
  //   console.log(cells)

  cells.forEach((cell, index) => {
    const value = board[Math.floor(index / 4)][index % 4]; // значення з матриці
    // console.log(value)

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell field-cell--${value}`;
  });

  document.querySelector('.game-score').textContent = game.getScore();

  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === 'idle') {
    messageStart.classList.remove('hidden');
  }

  updateButton();
}

function updateButton() {
  const button = document.querySelector('.button');

  if (game.getStatus() === 'idle') {
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  } else {
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
  }
}
