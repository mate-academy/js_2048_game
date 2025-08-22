'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startBtn = document.querySelector('.start');
const scoreDisplay = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCells = document.querySelectorAll('.field-cell');

// Start the game
startBtn.addEventListener('click', () => {
  // Restart, including after win or loss
  if (game.status !== 'idle') {
    game.restart();
    game.start();
    renderBoard();

    if (!messageWin.classList.contains('hidden')) {
      messageWin.classList.add('hidden');
    }

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.add('hidden');
    }
  }

  // Start
  if (game.getStatus() === 'idle') {
    game.start();
    renderBoard();
    messageStart.classList.add('hidden');
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  }
});

function renderBoard() {
  fieldCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = game.getState()[row][col];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });
}

// Handling keystrokes
document.addEventListener('keydown', keydownHandler);

function keydownHandler(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (true) {
    case e.key === 'ArrowLeft':
      game.moveLeft();
      break;
    case e.key === 'ArrowRight':
      game.moveRight();
      break;
    case e.key === 'ArrowUp':
      game.moveUp();
      break;
    case e.key === 'ArrowDown':
      game.moveDown();
      break;
  }
  renderBoard();
  scoreDisplay.textContent = game.getScore();
  game.updateStatus();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}
