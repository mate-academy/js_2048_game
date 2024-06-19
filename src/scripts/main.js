'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const table = document.querySelector('.game-field');
const rows = [...table.querySelectorAll('.field-row')];
const startMessage = document.querySelector('.message-start');
const score = document.querySelector('.game-score');
// const lose = document.querySelector('.message-lose');
const win = document.querySelector('.message-win');

const updateTableCells = () => {
  const gameState = game.getState();

  gameState.forEach((row, i) => {
    row.forEach((cell, j) => {
      const currentCell = rows[i].children[j];

      currentCell.className = 'field-cell';

      if (cell) {
        currentCell.classList.add(`field-cell--${cell}`);
        currentCell.textContent = cell;
      } else {
        currentCell.textContent = '';
      }
    });
  });
};

startBtn.addEventListener('click', () => {
  const isActive = game.status === Game.status.playing;

  if (!isActive) {
    game.start();
  } else {
    game.restart();
  }

  updateTableCells();

  startBtn.className = !isActive ? 'button restart' : 'button start';
  startBtn.textContent = !isActive ? 'Restart' : 'Start';
  startMessage.style = `display: ${!isActive ? 'none' : 'block'}`;
  score.textContent = game.getScore();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      default:
        return;
    }

    updateTableCells();
    score.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      win.classList.toggle('hidden');
    }
  }
});
