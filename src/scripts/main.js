'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const buttonStart = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');

function updatedTable() {
  const state = game.getState();
  const rows = document.querySelectorAll('.field-row');

  gameScore.textContent = game.getScore();

  state.forEach((row, iRow) => {
    row.forEach((valueCell, iCell) => {
      const cell = rows[iRow].children[iCell];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (valueCell > 0) {
        cell.textContent = valueCell;
        cell.classList.add(`field-cell--${valueCell}`);
      }
    });
  });

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

buttonStart.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');
    buttonStart.textContent = 'Start';
    messageStart.classList.remove('hidden');
    game.restart();
  }
  updatedTable();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }
  updatedTable();
});
