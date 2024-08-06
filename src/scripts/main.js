'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');

    game.start();
  } else {
    button.classList.replace('restart', 'start');
    button.textContent = 'Start';
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    game.restart();
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  updateGameField();

  score.textContent = game.getScore();
});

function updateGameField() {
  const rows = [...document.querySelectorAll('.field-row')];
  const cells = rows.map((row) => [...row.children]);

  const state = game.getState();

  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const currentCell = cells[i][j];

      currentCell.className = !cell
        ? 'field-cell'
        : `field-cell field-cell--${cell}`;
      currentCell.innerHTML = !cell ? '' : cell;
    });
  });
}
