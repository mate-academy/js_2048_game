'use strict';

import { tableBody, startButton, startMessage } from './dom.elements';

const Game = require('../modules/Game.class');
const game = new Game();

function clearCells(boardCoords, className = 'field-cell', text = '') {
  for (let i = 0; i < boardCoords.length; i++) {
    for (let j = 0; j < boardCoords[i].length; j++) {
      tableBody.rows[i].cells[j].classList = className;
      tableBody.rows[i].cells[j].textContent = text;
    }
  }
}

function setCells(boardCoords) {
  for (let i = 0; i < boardCoords.length; i++) {
    for (let j = 0; j < boardCoords[i].length; j++) {
      if (boardCoords[i][j] !== 0) {
        tableBody.rows[i].cells[j].textContent = boardCoords[i][j].toString();

        tableBody.rows[i].cells[j].classList.add(
          `field-cell--${boardCoords[i][j]}`,
        );
      }
    }
  }
}

startButton.addEventListener('click', (e) => {
  startButton.classList = 'button restart';
  startButton.textContent = 'Reset';
  startMessage.classList.add('hidden');
  game.start();

  const boardCoords = game.getCellsCoordinates();

  clearCells(boardCoords);
  setCells(boardCoords);
});

// document.addEventListener('keyup', (e) => {
//   if (e.code === 'ArrowUp') {
//     game.moveUp();
//   }
//   if (e.code === 'ArrowDown') {}
//   if (e.code === 'ArrowRight') {}
//   if (e.code === 'ArrowLeft') {}
// });
