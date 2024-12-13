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
    this.initialState = JSON.parse(JSON.stringify(initialState));
    this.board = JSON.parse(JSON.stringify(initialState));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (const row of this.board) {
      const nonZeroNumber = row.filter((x) => x !== 0);
      const result = [];
      let i = 0;

      while (i < nonZeroNumber.length) {
        if (
          i < nonZeroNumber.length - 1 &&
          nonZeroNumber[i] === nonZeroNumber[i + 1]
        ) {
          result.push(nonZeroNumber[i] * 2);
          this.score += nonZeroNumber[i] * 2;
          i += 2;
        } else {
          result.push(nonZeroNumber[i]);
          i++;
        }
      }

      while (result.length < row.length) {
        result.push(0);
      }

      if (result.toString() !== row.toString()) {
        moved = true;
      }
      row.splice(0, row.length, ...result);
    }

    if (moved) {
      this.addNumber();
      this.checkGameOver();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (const row of this.board) {
      const nonZeroNumber = row.filter((x) => x !== 0);
      const result = [];
      let i = 0;

      while (i < nonZeroNumber.length) {
        if (
          i < nonZeroNumber.length - 1 &&
          nonZeroNumber[i] === nonZeroNumber[i + 1]
        ) {
          result.push(nonZeroNumber[i] * 2);
          this.score += nonZeroNumber[i] * 2;
          i += 2;
        } else {
          result.push(nonZeroNumber[i]);
          i++;
        }
      }

      while (result.length < row.length) {
        result.unshift(0);
      }

      if (result.toString() !== row.toString()) {
        moved = true;
      }
      row.splice(0, row.length, ...result);
    }

    if (moved) {
      this.addNumber();
      this.checkGameOver();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const transposed = [];

    for (let col = 0; col < this.board[0].length; col++) {
      const newRow = this.board.map((row) => row[col]);

      transposed.push(newRow);
    }

    for (const col of transposed) {
      const nonZeroNumberCol = col.filter((x) => x !== 0);
      const result = [];
      let i = 0;

      while (i < nonZeroNumberCol.length) {
        if (
          i < nonZeroNumberCol.length - 1 &&
          nonZeroNumberCol[i] === nonZeroNumberCol[i + 1]
        ) {
          result.push(nonZeroNumberCol[i] * 2);
          this.score += nonZeroNumberCol[i] * 2;
          i += 2;
        } else {
          result.push(nonZeroNumberCol[i]);
          i++;
        }
      }

      while (result.length < col.length) {
        result.push(0);
      }

      if (!moved && col.some((value, index) => value !== result[index])) {
        moved = true;
      }
      col.splice(0, col.length, ...result);
    }

    this.board = transposed[0].map((_, i) => transposed.map((row) => row[i]));

    if (moved) {
      this.addNumber();
      this.checkGameOver();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const transposed = [];

    for (let col = 0; col < this.board[0].length; col++) {
      const newRow = this.board.map((row) => row[col]);

      transposed.push(newRow);
    }

    for (const col of transposed) {
      const nonZeroNumberCol = col.filter((x) => x !== 0);
      const result = [];
      let i = 0;

      while (i < nonZeroNumberCol.length) {
        if (
          i < nonZeroNumberCol.length - 1 &&
          nonZeroNumberCol[i] === nonZeroNumberCol[i + 1]
        ) {
          result.push(nonZeroNumberCol[i] * 2);
          this.score += nonZeroNumberCol[i] * 2;
          i += 2;
        } else {
          result.push(nonZeroNumberCol[i]);
          i++;
        }
      }

      while (result.length < col.length) {
        result.unshift(0);
      }

      if (!moved && col.some((value, index) => value !== result[index])) {
        moved = true;
      }

      col.splice(0, col.length, ...result);
    }

    this.board = transposed[0].map((_, i) => transposed.map((row) => row[i]));

    if (moved) {
      this.addNumber();
      this.checkGameOver();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addNumber();
    this.addNumber();
  }

  addNumber() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const randomValue = Math.random() < 0.9 ? 2 : 4;

      this.board[randomCell.row][randomCell.col] = randomValue;
    }
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  checkGameOver() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];

        if (
          (row > 0 && this.board[row - 1][col] === value) ||
          (row < 3 && this.board[row + 1][col] === value) ||
          (col > 0 && this.board[row][col - 1] === value) ||
          (col < 3 && this.board[row][col + 1] === value)
        ) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }
}

module.exports = Game;
