'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const startButton = document.querySelector('.button.start');
const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function updateUI() {
  const board = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });
  score.textContent = game.getScore();
}

// function addIdsToCells() {
//   const rows = game.querySelectorAll('.field-row');

//   rows.forEach((row, rowIndex) => {
//     const cells = row.querySelectorAll('.field-cell');

//     cells.forEach((cell, colIndex) => {
//       const cellId = `tile-${rowIndex}-${colIndex}`;
//       cell.setAttribute('id', cellId);  // Set the ID attribute on the cell
//     });
//   });
// }

function checkGameStatus() {
  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');
  startButton.textContent = 'Restart';
});

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (moves[ev.key]) {
    moves[ev.key]();
    updateUI();
    checkGameStatus();
  }
});

updateUI();
