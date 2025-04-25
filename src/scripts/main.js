'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

function render() {
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;

    cell.className = 'field-cell';

    if (board[row][column] !== 0) {
      cell.classList.add(`field-cell--${board[row][column]}`);
      cell.textContent = board[row][column];
    } else {
      cell.textContent = '';
    }
  });

  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = game.getScore();

  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }
  render();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
});

render();

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'ArrowLeft') {
    game.moveLeft();
    render();
  }

  if (evt.key === 'ArrowRight') {
    game.moveRight();
    render();
  }

  if (evt.key === 'ArrowDown') {
    game.moveDown();
    render();
  }

  if (evt.key === 'ArrowUp') {
    game.moveUp();
    render();
  }
});
