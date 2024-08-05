'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const gameField = document.querySelector('.game-field');

setCells();

function setCells() {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (game.getState()[y][x] !== 0) {
        gameField.rows[y].cells[x].className =
          `field-cell field-cell--${game.getState()[y][x]}`;
        gameField.rows[y].cells[x].textContent = game.getState()[y][x];
      }
    }
  }
}
