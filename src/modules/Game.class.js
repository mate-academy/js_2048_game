/* eslint-disable no-console */
'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.board = JSON.parse(JSON.stringify(initialState));
    this.previousBoard = JSON.parse(JSON.stringify(initialState));
    this.status = 'idle';
    this.score = 0;

    // eslint-disable-next-line no-console
  }

  savePreviousState() {
    this.previousBoard = JSON.parse(JSON.stringify(this.board));
  }

  getMovedCells() {
    const movedCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] !== this.previousBoard[row][col]) {
          movedCells.push({ row, col });
        }
      }
    }

    return movedCells;
  }

  moveLeft() {
    this.savePreviousState();

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = [];

      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] !== 0) {
          currentRow.push(this.board[row][col]);
        }
      }

      while (currentRow.length < this.board[row].length) {
        currentRow.push(0);
      }

      for (let col = 0; col < this.board[row].length; col++) {
        this.board[row][col] = currentRow[col];
      }

      for (let col = 0; col < this.board[row].length - 1; col++) {
        if (
          this.board[row][col] === this.board[row][col + 1] &&
          this.board[row][col] !== 0
        ) {
          this.board[row][col] *= 2;
          this.board[row][col + 1] = 0;
        }
      }

      const newRow = [];

      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] !== 0) {
          newRow.push(this.board[row][col]);
        }
      }

      while (newRow.length < this.board[row].length) {
        newRow.push(0);
      }

      for (let col = 0; col < this.board[row].length; col++) {
        this.board[row][col] = newRow[col];
      }
    }

    this.updateTable();
    this.getRandomCellNumber();
    this.updateTable();
  }

  moveRight() {
    this.savePreviousState();

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = [];

      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] !== 0) {
          currentRow.push(this.board[row][col]);
        }
      }

      while (currentRow.length < this.board[row].length) {
        currentRow.unshift(0);
      }

      for (let col = 0; col < this.board[row].length; col++) {
        this.board[row][col] = currentRow[col];
      }

      for (let col = this.board[row].length - 1; col > 0; col--) {
        if (
          this.board[row][col] === this.board[row][col - 1] &&
          this.board[row][col] !== 0
        ) {
          this.board[row][col] *= 2;
          this.board[row][col - 1] = 0;
        }
      }

      const newRow = [];

      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] !== 0) {
          newRow.push(this.board[row][col]);
        }
      }

      while (newRow.length < this.board[row].length) {
        newRow.unshift(0);
      }

      for (let col = 0; col < this.board[row].length; col++) {
        this.board[row][col] = newRow[col];
      }
    }

    this.updateTable();
    this.getRandomCellNumber();
    this.updateTable();
  }

  moveUp() {
    this.savePreviousState();

    for (let col = 0; col < this.board[0].length; col++) {
      const column = [];

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      while (column.length < this.board.length) {
        column.push(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = column[row];
      }

      for (let row = 0; row < this.board.length - 1; row++) {
        if (
          this.board[row][col] === this.board[row + 1][col] &&
          this.board[row][col] !== 0
        ) {
          this.board[row][col] *= 2;
          this.board[row + 1][col] = 0;
        }
      }

      const newColumn = [];

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== 0) {
          newColumn.push(this.board[row][col]);
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.push(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    this.updateTable();

    this.getRandomCellNumber();
    this.updateTable();
  }
  moveDown() {
    this.savePreviousState();

    for (let col = 0; col < this.board[0].length; col++) {
      const column = [];

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      while (column.length < this.board.length) {
        column.unshift(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = column[row];
      }

      for (let row = this.board.length - 1; row > 0; row--) {
        if (
          this.board[row][col] === this.board[row - 1][col] &&
          this.board[row][col] !== 0
        ) {
          this.board[row][col] *= 2;
          this.board[row - 1][col] = 0;
        }
      }

      const newColumn = [];

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== 0) {
          newColumn.push(this.board[row][col]);
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.unshift(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    this.updateTable();
    this.getRandomCellNumber();
    this.updateTable();
  }

  getScore() {}

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
  }

  restart() {
    this.status = 'idle';
    this.board = JSON.parse(JSON.stringify(this.initialState));
  }

  updateTable() {
    const table = document.querySelector('tbody');

    Array.from(table.rows).forEach((row, rowIndex) => {
      Array.from(row.cells).forEach((cell, cellIndex) => {
        const value = this.board[rowIndex][cellIndex];

        cell.textContent = value !== 0 ? value : '';
      });
    });
  }

  getRandomCellNumber() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row: randomRow, col: randomCol } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      const randomChance = Math.random();

      this.board[randomRow][randomCol] = randomChance < 0.1 ? 4 : 2;
    }
  }

  canMoveUp() {
    for (let row = 1; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (
          this.board[row][col] !== 0 &&
          (this.board[row - 1][col] === 0 ||
            this.board[row - 1][col] === this.board[row][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveDown() {
    for (let row = 0; row < this.board.length - 1; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (
          this.board[row][col] !== 0 &&
          (this.board[row + 1][col] === 0 ||
            this.board[row + 1][col] === this.board[row][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveLeft() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 1; col < this.board[row].length; col++) {
        if (
          this.board[row][col] !== 0 &&
          (this.board[row][col - 1] === 0 ||
            this.board[row][col - 1] === this.board[row][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveRight() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length - 1; col++) {
        if (
          this.board[row][col] !== 0 &&
          (this.board[row][col + 1] === 0 ||
            this.board[row][col + 1] === this.board[row][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
