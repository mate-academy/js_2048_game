'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newTile = Math.random() < 0.9 ? 2 : 4;

      this.board[row][col] = newTile;
    }
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile(); // Add two tiles at the start
  }

  start() {
    if (this.status === 'idle') {
      this.restart();
    }
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (
          col < this.size - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.size - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  rotateBoard(clockwise = true) {
    const newBoard = this.createEmptyBoard();

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (clockwise) {
          newBoard[col][this.size - row - 1] = this.board[row][col];
        } else {
          newBoard[this.size - col - 1][row] = this.board[row][col];
        }
      }
    }
    this.board = newBoard;
  }

  slideAndMergeRow(row) {
    const newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        this.score += newRow[i];
      }
    }

    return newRow.filter((val) => val !== 0);
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const oldRow = [...this.board[row]];
      const newRow = this.slideAndMergeRow(oldRow);

      this.board[row] = [
        ...newRow,
        ...Array(this.size - newRow.length).fill(0),
      ];

      if (!moved && oldRow.toString() !== this.board[row].toString()) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  moveUp() {
    this.rotateBoard(false);
    this.moveLeft();
    this.rotateBoard(true);
  }

  moveDown() {
    this.rotateBoard(true);
    this.moveLeft();
    this.rotateBoard(false);
  }

  checkGameOver() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
