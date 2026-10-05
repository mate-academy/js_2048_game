'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const SIZE = 4;

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    if (game.getStatus() === 'idle') {
      game.start();
    }
  }

  if (button.classList.contains('restart')) {
    game.restart();
    game.start();
  }

  messageStart.classList.add('hidden');
  render();
});

function render() {
  const board = game.getState();

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const index = row * SIZE + col;

      cells[index].className = 'field-cell';

      if (board[row][col] === 0) {
        cells[index].textContent = '';
      } else {
        cells[index].textContent = board[row][col];
        cells[index].classList.add(`field-cell--${board[row][col]}`);
      }
    }
  }

  score.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

const movesByKey = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

document.addEventListener('keydown', (e) => {
  const move = movesByKey[e.key];

  if (!move) {
    return;
  }

  e.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  if (move()) {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }

  render();
});
