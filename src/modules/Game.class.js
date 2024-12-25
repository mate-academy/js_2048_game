'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  spawnTile() {
    const emptyCells = [];

    this.board.forEach(
      (row, i) =>
        row.forEach((cell, j) => {
          if (cell === 0) {
            emptyCells.push([i, j]);
          }
        }),
      // eslint-disable-next-line function-paren-newline
    );

    if (emptyCells.length) {
      const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[x][y] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  slide(row) {
    const filteredRow = row.filter((cell) => cell !== 0);
    const zeros = Array(this.size - filteredRow.length).fill(0);

    return [...filteredRow, ...zeros];
  }

  combine(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row[i + 1] = 0;
      }
    }

    return row;
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.slide(this.combine(this.slide(row))));

    if (oldBoard !== JSON.stringify(this.board)) {
      this.spawnTile();
    }
  }

  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.slide(this.combine(this.slide(row.reverse()))).reverse());

    if (oldBoard !== JSON.stringify(this.board)) {
      this.spawnTile();
    }
  }

  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    this.transpose();
    this.moveLeft();
    this.transpose();

    if (oldBoard !== JSON.stringify(this.board)) {
      this.spawnTile();
    }
  }

  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    this.transpose();
    this.moveRight();
    this.transpose();

    if (oldBoard !== JSON.stringify(this.board)) {
      this.spawnTile();
    }
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.status === 'win' || this.status === 'lose') {
      return this.status;
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return 'win';
    }

    if (!this.canMove()) {
      this.status = 'lose';

      return 'lose';
    }

    return 'playing';
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.start();
  }
}

module.exports = Game;
