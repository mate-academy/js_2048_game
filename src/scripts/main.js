'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');

button.addEventListener('click', (e) => {
  const startMessage = document.querySelector('.message-start');

  game.start();

  if (button.classList.contains('start')) {
    if (!startMessage.classList.contains('.hidden')) {
      startMessage.classList.add('hidden');
    }

    button.classList.replace('start', 'restart');
    button.textContent = 'Restart';
  } else {
    const loseMessage = document.querySelector('.message-lose');
    const winMessage = document.querySelector('.message-win');

    if (!loseMessage.classList.contains('hidden')) {
      loseMessage.classList.add('hidden');
    }

    if (!winMessage.classList.contains('hidden')) {
      winMessage.classList.add('hidden');
    }

    button.classList.replace('restart', 'start');
    button.textContent = 'Start';
  }

  renderTable();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let isTableChanged = false;

  if (e.key === 'ArrowLeft') {
    isTableChanged = game.moveLeft();
  }

  if (e.key === 'ArrowUp') {
    isTableChanged = game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    isTableChanged = game.moveDown();
  }

  if (e.key === 'ArrowRight') {
    isTableChanged = game.moveRight();
  }

  if (isTableChanged) {
    renderTable();
  }
});

function renderTable() {
  const state = game.getState();
  const table = document.querySelector('.game-field');
  const tBody = table.tBodies[0];

  if (!table) {
    return;
  }

  for (let rowIndex = 0; rowIndex < state.length; rowIndex++) {
    const row = tBody.rows[rowIndex];

    for (
      let columnIndex = 0;
      columnIndex < state[rowIndex].length;
      columnIndex++
    ) {
      const cell = row.cells[columnIndex];

      cell.textContent = '';
      removeFieldClass(cell);

      const number = state[rowIndex][columnIndex];

      if (number === 0) {
        continue;
      }

      cell.textContent = state[rowIndex][columnIndex];
      cell.classList.add(`field-cell--${number}`);
    }

    const score = document.querySelector('.game-score');

    score.textContent = game.getScore();

    const currentStatus = game.getStatus();

    if (currentStatus === 'win') {
      const message = document.querySelector('.message-win');

      message.classList.remove('hidden');
    } else if (currentStatus === 'lose') {
      const message = document.querySelector('.message-lose');

      message.classList.remove('hidden');
    }
  }

  function removeFieldClass(field) {
    field.classList.forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        field.classList.remove(cls);
      }
    });
  }
}
