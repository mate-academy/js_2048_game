'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const restartBtn = document.querySelector('.button.restart');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const score = game.getScore();
  const statusOfGame = game.getStatus();

  scoreEl.textContent = score;

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const column = i % 4;
    const value = state[row][column];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });

  msgStart.classList.toggle('hidden', statusOfGame !== 'idle');
  msgWin.classList.toggle('hidden', statusOfGame !== 'win');
  msgLose.classList.toggle('hidden', statusOfGame !== 'lose');
  restartBtn.classList.toggle('hidden', statusOfGame === 'idle');
  startBtn.classList.toggle('hidden', statusOfGame === 'playing');

  if (statusOfGame === 'lose') {
    startBtn.classList.toggle('hidden');
  }
}

startBtn.addEventListener('click', (e) => {
  game.start();
  render();
});

restartBtn.addEventListener('click', (e) => {
  game.restart();
  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;
    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;
  }

  if (moved) {
    render();
  }
});

render();
