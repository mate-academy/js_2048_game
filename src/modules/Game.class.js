'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;

    this.board = initialState
      ? initialState.map((row) => row.slice())
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.score = 0;
    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => row.slice());
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0),
    );

    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let row = this.board[r].filter((v) => v !== 0);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row[i + 1] = 0;
          i++;
        }
      }
      row = row.filter((v) => v !== 0);

      while (row.length < this.size) {
        row.push(0);
      }

      if (this.board[r].join() !== row.join()) {
        moved = true;
      }
      this.board[r] = row;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameStatus();
  }

  moveRight() {
    this.reverseRows();
    this.moveLeft();
    this.reverseRows();
    this.checkGameStatus();
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
    this.checkGameStatus();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
    this.checkGameStatus();
  }

  reverseRows() {
    this.board.forEach((row) => row.reverse());
  }

  transpose() {
    this.board = this.board[0].map((_, c) => this.board.map((row) => row[c]));
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
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
