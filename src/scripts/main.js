'use strict';

const Game = require('../modules/Game.class');

const startButton = document.querySelector('.button.start');
const score = document.querySelector('.game-score');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');
const fieldRows = document.querySelectorAll('.field-rows');

let game;

function renderBoard(board) {
  fieldRows.forEach((rowEl, r) => {
    const cells = rowEl.querySelectorAll('.field-cell');

    cells.forEach((cellEl, c) => {
      const value = board[r][c];

      cellEl.textContent = value === 0 ? '' : value;

      cellEl.className = 'field-cell';

      if (value > 0) {
        cellEl.classList.add(`${value}`);
      }
    });
  });
}

function updateUI() {
  score.textContent = game.getScore();

  renderBoard(game.getState());

  const statusEl = game.getStatus();

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (statusEl === 'win') {
    msgWin.classList.remove('hidden');
  } else if (statusEl === 'lose') {
    msgLose.classList.remove('hidden');
  }
}

function handleMove(direction) {
  if (game.getStatus() !== 'plaing') {
    return;
  }

  let moved = false;

  switch (direction) {
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
    updateUI();

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

function startGame() {
  game = new Game();
  game.start();
  updateUI();

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
}

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    handleMove(e.key);
  }
});
