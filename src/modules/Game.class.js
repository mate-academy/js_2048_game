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

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let r = 0; r < this.size; r++) {
      // eslint-disable-next-line no-shadow
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const row = this.board[r].filter((val) => val);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row.splice(i + 1, 1);
          row.push(0);
        }
      }

      while (row.length < this.size) {
        row.push(0);
      }

      if (this.board[r].toString() !== row.toString()) {
        moved = true;
      }
      this.board[r] = row;
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  transpose() {
    this.board = this.board[0].map(
      (_, colIndex) => this.board.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.board.flat().includes(2048)) {
      return 'win';
    }

    if (!this.canMove()) {
      return 'lose';
    }

    return this.status;
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
