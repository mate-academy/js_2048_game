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
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState;

    this.score = 0;
    this.status = `idle`;
  }

  arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  turnBoard(direction) {
    const size = this.board.length;
    const newBoard = Array.from({ length: size }, () => Array(size).fill(0));

    if (direction === 'forward') {
      for (let i = 0; i < size; i++) {
        for (let n = 0; n < size; n++) {
          newBoard[n][size - 1 - i] = this.board[i][n];
        }
      }

      this.board = newBoard;
    } else if (direction === 'back') {
      for (let i = 0; i < size; i++) {
        for (let n = 0; n < size; n++) {
          newBoard[size - 1 - n][i] = this.board[i][n];
        }
      }

      this.board = newBoard;
    }
  }

  compressRow(direction) {
    if (this.getStatus() === `idle` || this.getStatus() === `win`) {
      return;
    }

    let moved = false;

    if (direction === 'up' || direction === 'down') {
      this.turnBoard('forward');
    }

    this.board.forEach((row, index) => {
      const originalRow = [...row];
      const rowValuesOnly = row.filter((cell) => cell > 0);
      const compressedRow = [];

      if (direction === 'left' || direction === 'down') {
        rowValuesOnly.reverse();
      }

      for (let i = rowValuesOnly.length - 1; i >= 0; i--) {
        if (rowValuesOnly[i] === rowValuesOnly[i - 1] && i > 0) {
          compressedRow.unshift(rowValuesOnly[i] * 2);
          this.score += rowValuesOnly[i] * 2;

          if (rowValuesOnly[i] * 2 === 2048) {
            this.status = 'win';
          }
          i--;
          moved = true;
        } else {
          compressedRow.unshift(rowValuesOnly[i]);
        }
      }

      while (compressedRow.length < 4) {
        compressedRow.unshift(0);
      }

      if (direction === 'left' || direction === 'down') {
        compressedRow.reverse();
      }

      if (!this.arraysEqual(originalRow, compressedRow)) {
        moved = true;
      }

      this.board[index] = compressedRow;
    });

    if (direction === 'up' || direction === 'down') {
      this.turnBoard('back');
    }

    if (moved) {
      const [row1, column1] = this.randomCell();

      this.board[row1][column1] = this.pickRandomNumber();
    }

    this.canMove();
  }

  randomCell() {
    let cellRow = Math.floor(Math.random() * 4);
    let cellColumn = Math.floor(Math.random() * 4);

    while (this.board[cellRow][cellColumn] !== 0) {
      cellRow = Math.floor(Math.random() * 4);
      cellColumn = Math.floor(Math.random() * 4);
    }

    return [cellRow, cellColumn];
  }

  pickRandomNumber() {
    const random = Math.random();

    if (random < 0.1) {
      return 4;
    } else {
      return 2;
    }
  }

  canMove() {
    for (let i = 0; i < this.board.length; i++) {
      for (let n = 0; n < this.board.length - 1; n++) {
        if (
          this.board[i][n] === 0 ||
          this.board[i][n] === this.board[i][n + 1]
        ) {
          return;
        }

        if (
          this.board[n][i] === 0 ||
          this.board[n][i] === this.board[n + 1][i]
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  moveLeft() {
    this.compressRow('left');
  }

  moveRight() {
    this.compressRow('right');
  }

  moveUp() {
    this.compressRow('up');
  }
  moveDown() {
    this.compressRow('down');
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = `playing`;

    const [row1, column1] = this.randomCell();
    let [row2, column2] = this.randomCell();

    while (row1 === row2 && column1 === column2) {
      [row2, column2] = this.randomCell();
    }

    this.board[row1][column1] = this.pickRandomNumber();
    this.board[row2][column2] = this.pickRandomNumber();
  }

  restart() {
    this.board = this.initialState;

    this.score = 0;
    this.status = `idle`;
  }
}

module.exports = Game;
