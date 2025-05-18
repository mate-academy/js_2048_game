'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

const BOARD_SIZE = 4;

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

startButton.addEventListener('click', () => {
  const isStart = startButton.classList.contains('start');

  if (isStart) {
    game.start();
    messageStart.classList.add('hidden');
    messageStart.classList.remove('message-win', 'message-lose');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    startButton.textContent = 'Start';
  }

  renderBoard(game.getState());
  score.textContent = game.getScore();

  startButton.classList.toggle('start');
  startButton.classList.toggle('restart');
});

function renderBoard(state) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cellIndex = row * BOARD_SIZE + col;
      const cell = cells[cellIndex];
      const value = state[row][col];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    }
  }
}

document.addEventListener('keydown', (e) => {
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
  }

  if (moved) {
    renderBoard(game.getState());
    score.textContent = game.getScore();

    if (game.checkWin()) {
      messageWin.classList.remove('hidden');
    } else if (game.checkLose()) {
      messageLose.classList.remove('hidden');
    }
  }
});
