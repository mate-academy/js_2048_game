'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let firstMoveMade = false;

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();

    firstMoveMade = false;
  } else if (startButton.classList.contains('restart')) {
    game.restart();
    firstMoveMade = false;
  }

  updateMessage(game.getStatus());
  renderBoard(game.getState());
  updateScore(game.getScore());
});

function updateMessage(statusGame) {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (statusGame === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function renderBoard(board) {
  const cells = document.querySelectorAll('.field-cell');

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = board[row][col];
      const index = row * 4 + col;
      const cell = cells[index];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function updateScore(score) {
  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = score;
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    if (!firstMoveMade) {
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
      firstMoveMade = true;
    }

    updateScore(game.getScore());
    renderBoard(game.getState());
    game.checkWin();
    updateMessage(game.getStatus());
  }
});
