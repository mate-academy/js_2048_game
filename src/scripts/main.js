'use strict';

// Підключення класу гри
import Game from '../modules/Game.class.js';

const game = new Game();

// DOM-елементи
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');

function renderBoard(board) {
  board.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateScore(score) {
  scoreElement.textContent = score;
}

function showMessage(gameStatus) {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }
}

function handleMove(direction) {
  return new Promise((resolve) => {
    const gameBefore = JSON.stringify(game.getState());

    if (direction === 'left') {
      game.moveLeft();
    }

    if (direction === 'right') {
      game.moveRight();
    }

    if (direction === 'up') {
      game.moveUp();
    }

    if (direction === 'down') {
      game.moveDown();
    }

    const gameAfter = JSON.stringify(game.getState());

    if (gameBefore !== gameAfter) {
      setTimeout(() => resolve(), 150);
    } else {
      resolve();
    }
  }).then(() => {
    renderBoard(game.getState());
    updateScore(game.getScore());
    showMessage(game.getStatus());
  });
}

startBtn.addEventListener('click', () => {
  game.start();
  renderBoard(game.getState());
  updateScore(game.getScore());
  showMessage('playing');
  startBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');
});

restartBtn.addEventListener('click', () => {
  game.restart();
  renderBoard(game.getState());
  updateScore(game.getScore());
  showMessage('idle');
  restartBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      handleMove('left');
      break;
    case 'ArrowRight':
      handleMove('right');
      break;
    case 'ArrowUp':
      handleMove('up');
      break;
    case 'ArrowDown':
      handleMove('down');
      break;
  }
});
