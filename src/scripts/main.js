'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

function drawGame() {
  const field = game.getState();
  const gameStatus = game.getStatus();

  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = field[row][col];

    cells[i].textContent = value === 0 ? '' : value;
    cells[i].className = 'field-cell';

    if (value !== 0) {
      cells[i].classList.add(`field-cell--${value}`);
    }
  }

  scoreEl.textContent = game.getScore();

  if (gameStatus === 'win') {
    winMsg.classList.remove('hidden');
  } else {
    winMsg.classList.add('hidden');
  }

  if (gameStatus === 'lose') {
    loseMsg.classList.remove('hidden');
  } else {
    loseMsg.classList.add('hidden');
  }
}

startBtn.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  if (startBtn.textContent !== 'Restart') {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }

  // Hide all messages
  startMsg.classList.add('hidden');
  winMsg.classList.add('hidden');
  loseMsg.classList.add('hidden');

  drawGame();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      e.preventDefault();
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      e.preventDefault();
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      e.preventDefault();
      moved = game.moveDown();
      break;
  }

  if (moved) {
    drawGame();
  }
});
