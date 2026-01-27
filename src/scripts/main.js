'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const score = document.querySelector('.game-score');
const cells = [...document.querySelectorAll('.field-cell')];
const messages = [...document.querySelectorAll('.message')];
const start = document.querySelector('.start');

const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function drawGame() {
  const board = game.getState();

  score.textContent = game.getScore();

  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = board[row][col];

    cells[i].className = 'field-cell';

    if (value > 0) {
      cells[i].textContent = value;
      cells[i].classList.add('field-cell--' + value);
    } else {
      cells[i].textContent = '';
    }
  }
}

start.addEventListener('click', (e) => {
  e.preventDefault();

  messages.forEach((message) => message.classList.add('hidden'));

  if (start.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }

  drawGame(cells);
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  const gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
    return;
  }

  let isChanged = false;

  if (e.key === 'ArrowUp') {
    isChanged = game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    isChanged = game.moveDown();
  }

  if (e.key === 'ArrowLeft') {
    isChanged = game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    isChanged = game.moveRight();
  }

  if (isChanged) {
    drawGame(cells);

    if (start.classList.contains('start')) {
      start.classList.replace('start', 'restart');
      start.textContent = 'Restart';
    }
  }

  const currentStatus = game.getStatus();

  if (currentStatus !== 'playing') {
    if (currentStatus === 'win') {
      winMessage.classList.remove('hidden');
    } else if (currentStatus === 'lose') {
      loseMessage.classList.remove('hidden');
    }
  }
});
