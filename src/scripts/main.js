'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const gameField = document.querySelector('.game-field');
const scoreDisplay = document.querySelector('.game-score');

button.addEventListener('click', () => {
  if (game.status !== 'playing') {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
  }

  renderBoard();
  updateMessages(game.status);
});

function renderBoard() {
  const cells = gameField.querySelectorAll('.field-cell');
  const board = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    cell.className = 'field-cell'; // Скидаємо класи

    if (board[row][col] !== 0) {
      cell.textContent = board[row][col];
      cell.classList.add(`field-cell--${board[row][col]}`);
    } else {
      cell.textContent = '';
    }
  });

  scoreDisplay.textContent = game.getScore();
}

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
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

  game.updateBoard();
  renderBoard();
  updateMessages(game.status);
});

function updateMessages(state) {
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  // if (status === 'lose') {
  //   messageLose.classList.remove('hidden');
  // } else if (status === 'win') {
  //   messageWin.classList.remove('hidden');
  // } else if (status === 'playing') {
  //   messageStart.classList.add('hidden');
  // } else if (status === 'start') {
  //   messageStart.classList.remove('hidden');
  // }

  switch (state) {
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    // case 'playing':
    //   messageStart.classList.add('hidden');
    //   break;
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
  }
}
