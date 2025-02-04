'use strict';

class Game {
  constructor(
    cells = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.cells = cells;
    this.restart();
  }

  slideAndMerge(row) {
    const originalRow = [...row];
    const newRow = [];
    const filterRow = row.filter((el) => el !== 0);

    for (let i = 0; i < filterRow.length; i++) {
      if (filterRow[i] === filterRow[i + 1]) {
        newRow.push(filterRow[i] * 2);
        this.score += filterRow[i] * 2;
        i++;
      } else {
        newRow.push(filterRow[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return JSON.stringify(newRow) === JSON.stringify(originalRow)
      ? originalRow
      : newRow;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const rotated = (board) =>
      board[0].map((_, columnIndex) => board.map((row) => row[columnIndex]));
    const boardBefore = JSON.stringify(this.board);

    if (direction === 'up' || direction === 'down') {
      this.board = rotated(this.board);
    }

    for (let i = 0; i < 4; i++) {
      const row =
        direction === 'right' || direction === 'down'
          ? [...this.board[i].reverse()]
          : [...this.board[i]];

      const newRow = this.slideAndMerge(row);

      if (direction === 'right' || direction === 'down') {
        newRow.reverse();
      }
      this.board[i] = newRow;
    }

    if (direction === 'up' || direction === 'down') {
      this.board = rotated(this.board);
    }

    const boardAfter = JSON.stringify(this.board);

    if (boardBefore !== boardAfter) {
      this.addRandomNum();
    }

    this.isGameWon();
  }

  moveLeft() {
    this.move('left');
  }
  moveRight() {
    this.move('right');
  }
  moveUp() {
    this.move('up');
  }
  moveDown() {
    this.move('down');
  }

  isGameWon() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    if (!this.isMovePossible()) {
      this.status = 'lose';
    }
  }

  isMovePossible() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomNum() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, cellIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, cellIndex } = emptyCells[randomIndex];

      this.board[rowIndex][cellIndex] = Math.random() < 0.9 ? 2 : 4;
    }
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
    this.status = 'playing';
    this.addRandomNum();
    this.addRandomNum();
  }

  restart() {
    this.board = this.cells.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }
}
module.exports = Game;
