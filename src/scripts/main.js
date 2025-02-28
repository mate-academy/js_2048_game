'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('button.start');

function updateUI() {
  updateBoardState();
  updateButtonState();
  updateScore();
  updateMessage();
}

function updateBoardState() {
  const gameState = game.getState();
  const gameField = document.querySelector('tbody');
  const rows = Array.from(gameField.rows);

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.cells);

    cells.forEach((cell, cellIndex) => {
      const value = gameState[rowIndex][cellIndex];

      cell.textContent = value || '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

function updateButtonState() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

function updateScore() {
  const scoreContainer = document.querySelector('.game-score');
  const score = game.getScore();

  scoreContainer.textContent = score;
}

function updateMessage() {
  const gameStatus = game.getStatus();
  const messages = {
    start: document.querySelector('.message.message-start'),
    win: document.querySelector('.message.message-win'),
    lose: document.querySelector('.message.message-lose'),
  };

  Object.values(messages).forEach((message) => message.classList.add('hidden'));

  switch (gameStatus) {
    case 'idle':
      messages.start.classList.remove('hidden');
      break;
    case 'win':
      messages.win.classList.remove('hidden');
      break;
    case 'lose':
      messages.lose.classList.remove('hidden');
      break;
  }
}

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
});

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (ev.key) {
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
  }
});

updateUI();
