'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const table = document.querySelector('.game-field');
const rows = [...table.querySelectorAll('.field-row')];

startBtn.addEventListener('click', () => {
  game.start();

  const gameState = game.getState();

  gameState.forEach((row, i) => {
    row.forEach((cell, j) => {
      const currentCell = rows[i].children[j];

      currentCell.className = !cell
        ? 'field-cell'
        : `field-cell field-cell--${cell}`;
      currentCell.innerHTML = !cell ? '' : cell;
    });
  });
});
