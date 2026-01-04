'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderField() {
  const board = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderScore() {
  scoreElement.textContent = game.getScore();
}

function renderMessages() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  const stat = game.getStatus();

  if (stat === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (stat === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (stat === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function render() {
  renderField();
  renderScore();
  renderMessages();
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let didMove = false;

  if (e.key === 'ArrowLeft') {
    didMove = game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    didMove = game.moveRight();
  } else if (e.key === 'ArrowUp') {
    didMove = game.moveUp();
  } else if (e.key === 'ArrowDown') {
    didMove = game.moveDown();
  }

  if (didMove) {
    render();
  }
});

render();
