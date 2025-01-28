'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const game = new Game(initialState);

const startButton = document.querySelector('.button-start');

startButton.addEventListener('click', () => {
  game.start(generate2or4, findEmptyCells, renderCells);
});

// const gameField = document.querySelector('game-field');
const rows = [...document.querySelectorAll('.field-row')];

function generate2or4() {
  return Math.random() < 0.1 ? 4 : 2;
}

function findEmptyCells(arr) {
  const listOfEmptyCells = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === 0) {
        listOfEmptyCells.push([i, j]);
      }
    }
  }

  return listOfEmptyCells;
}

function renderCells() {
  const fields = game.fields;

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, cellIndex) => {
      const value = fields[rowIndex][cellIndex];

      if (value === 0) {
        cell.textContent = '';
      } else {
        cell.textContent = value;
      }
    });
  });
}
