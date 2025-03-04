'use strict';

const Cell = require('../modules/Cell');

const ROWS_SIZE = 4;
const COLUMNS_SIZE = 4;

function getRandomNumber() {
  return Math.random() <= 0.9 ? 2 : 4;
}

export class Game {
  constructor() {
    this.board = [];

    for (let row = 0; row < ROWS_SIZE; row++) {
      for (let column = 0; column < COLUMNS_SIZE; column++) {
        this.board.push(new Cell(row, column));
      }
    }
  }

  getRandomCell() {
    const emptyCells = this.board.filter((cell) => cell.valueNum === undefined);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex] || undefined;
  }

  getValues() {
    const valueCells = this.board.filter(
      (cellItem) => cellItem.valueNum !== undefined,
    );

    return valueCells;
  }

  addNumber() {
    this.getRandomCell().valueNum = getRandomNumber();
  }

  updateBoard() {
    this.board.forEach((cell) => {
      const num = cell.valueNum !== undefined ? cell.valueNum : undefined;
      const x = cell.x;
      const y = cell.y;

      const boardElement = document.getElementById(`${x}-${y}`);

      if (num !== undefined) {
        boardElement.classList.value = '';
        boardElement.classList.add('field-cell');
        boardElement.textContent = num;
        boardElement.classList.add(`field-cell--${num}`);
        boardElement.classList.toggle('animation-appear');
      } else {
        boardElement.textContent = '';
        boardElement.classList.value = '';
        boardElement.classList.add('field-cell');
      }
    });
  }

  groupCellsByRows() {
    return this.board.reduce((cellsGroup, cellItem) => {
      if (!cellsGroup[cellItem.x]) {
        cellsGroup[cellItem.x] = [];
      }

      cellsGroup[cellItem.x].push(cellItem);

      return cellsGroup;
    }, []);
  }
}

module.exports = Game;
