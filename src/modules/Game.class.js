'use strict';

class Game {
  constructor(initialState = null) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.status = 'idle';
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.board[rowIndex][colIndex] === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      }
    }

    const [randomRow, randomCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[randomRow][randomCol] = Math.random() > 0.1 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const newRow = this.board[rowIndex].filter((value) => value !== 0);
      const mergedRow = [];
      let i = 0;

      while (i < newRow.length) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i += 2;
        } else {
          mergedRow.push(newRow[i]);
          i++;
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      if (!this.arraysEqual(this.board[rowIndex], mergedRow)) {
        moved = true;
      }

      this.board[rowIndex] = mergedRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }

  arraysEqual(arr1, arr2) {
    return arr1.every((value, index) => value === arr2[index]);
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  moveUp() {
    this.board = this.transposeBoard();
    this.moveLeft();
    this.board = this.transposeBoard();
  }

  moveDown() {
    this.board = this.transposeBoard();
    this.moveRight();
    this.board = this.transposeBoard();
  }

  transposeBoard() {
    // eslint-disable-next-line
    return this.board[0].map((_, colIndex) => this.board.map((row) => row[colIndex]));
  }

  checkWin() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }
  }

  checkLose() {
    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.board[rowIndex][colIndex] === 0) {
          return true;
        }

        if (
          rowIndex < 3 &&
          // eslint-disable-next-line
          this.board[rowIndex][colIndex] === this.board[rowIndex + 1][colIndex]) {
          return true;
        }

        if (
          colIndex < 3 &&
          // eslint-disable-next-line
          this.board[rowIndex][colIndex] === this.board[rowIndex][colIndex + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  getState() {
    return {
      board: this.board,
      score: this.score,
      statusGame: this.status,
    };
  }
}

module.exports = Game;
