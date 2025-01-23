/* eslint-disable function-paren-newline */
'use strict';

class Game {
  constructor() {
    this.score = 0;
    this.status = 'idle';

    this.cells = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  slide(row) {
    const filteredRow = row.sort((a, b) => a - b);

    for (let x = 0; x < filteredRow.length; x++) {
      if (filteredRow[x] === filteredRow[x + 1]) {
        filteredRow[x + 1] = filteredRow[x] * 2;
        filteredRow[x] = 0;
      }
    }
  }

  slideAndMerge(row) {
    const filteredRow = row.filter((num) => num !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        this.score += filteredRow[i];
        filteredRow.splice(i + 1, 1);
      }
    }

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  isWin() {
    if (this.cells.some((row) => row.some((col) => col === 2048))) {
      this.status = 'win';
    }
  }
  isLose() {
    const noMovesLeft = this.cells.every((row, r) =>
      row.every((cell, c) => {
        if (cell === 0) {
          return false;
        }

        if (c < 3 && cell === this.cells[r][c + 1]) {
          return false;
        }

        if (r < 3 && cell === this.cells[r + 1][c]) {
          return false;
        }

        return true;
      }),
    );

    if (noMovesLeft) {
      this.status = 'lose';
    }
  }

  moveRight() {
    this.cells = this.cells.map((row) => {
      const reversedRow = row.reverse();
      const newRow = this.slideAndMerge(reversedRow);

      return newRow.reverse();
    });
  }

  moveLeft() {
    this.cells = this.cells.map((row) => this.slideAndMerge(row));
  }

  moveUp() {
    const transposed = this.transpose(this.cells);
    const merged = transposed.map((row) => this.slideAndMerge(row));

    this.cells = this.transpose(merged);
  }

  moveDown() {
    const transposed = this.transpose(this.cells);
    const merged = transposed.map((row) =>
      this.slideAndMerge(row.reverse()).reverse(),
    );

    this.cells = this.transpose(merged);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.cells;
  }

  getStatus() {
    return this.status;
  }

  nextTurn() {
    const newCell = Math.random() < 0.9 ? 2 : 4;

    const emptyCells = [];

    this.cells.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === 0) {
          emptyCells.push([r, c]);
        }
      }),
    );

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.cells[row][col] = newCell;
    }

    this.isWin();
    this.isLose();
  }

  start() {
    this.status = 'playing';
    this.nextTurn();
    this.nextTurn();
  }

  restart() {
    this.cells = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';

    return this;
  }
}

module.exports = Game;
