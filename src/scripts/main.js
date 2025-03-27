'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.button-start');
const score = document.querySelector('.game-score');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');
const msgStart = document.querySelector('.message-start');

function updateBoard() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    row.forEach((el, cellIndex) => {
      const cell = document.querySelector(
        `[data-position="${rowIndex}-${cellIndex}"]`,
      );

      if (!cell) {
        return;
      }

      cell.textContent = el !== 0 ? el : '';
      updateCellClass(cell, el);
    });
  });
}

function updateCellClass(cell, value) {
  cell.className = 'field-cell';

  if (value !== 0) {
    cell.classList.add(`field-cell--${value}`);
  }
}

function updateScore() {
  score.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');
  msgStart.classList.add('hidden');

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  } else if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start')) {
    game.start();
    updateBoard();
    updateScore();
    updateMessages();
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  } else {
    game.restart();
    updateBoard();
    updateScore();
    updateMessages();
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
    startBtn.textContent = 'Start';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateBoard();
  updateScore();
  updateMessages();
});
