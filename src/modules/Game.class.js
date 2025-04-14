'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.size = 4;
    this.board = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    if (this.status !== 'playing') {
      return;
    }

    for (let i = 0; i < this.size; i++) {
      let row = this.board[i].filter((item) => item !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.score += row[j];
        }
      }

      row = row.filter((item) => item !== 0);

      while (row.length < this.size) {
        row.push(0);
      }

      if (this.board[i].join('') !== row.join('')) {
        moved = true;
      }

      this.board[i] = row;
    }

    if (moved) {
      this.postMoved();
    }
  }

  reverseRows() {
    this.board.forEach((row) => row.reverse());
  }

  moveRight() {
    this.reverseRows();
    this.moveLeft();
    this.reverseRows();
  }

  transpose() {
    this.board = this.board[0].map((_, index) => {
      return this.board.map((row) => row[index]);
    });
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

  addRandom() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return null;
    }

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  postMoved() {
    this.addRandom();

    if (this.checkWin()) {
      this.status = 'win';
    }

    if (this.checkLose()) {
      this.status = 'lose';
    }
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkLose() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (i > 0 && this.board[i][j] === this.board[i - 1][j]) {
          return false;
        }

        if (j > 0 && this.board[i][j] === this.board[i][j - 1]) {
          return false;
        }

        if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }

        if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }
      }
    }

    return true;
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
    this.board = this.initialState.map((rows) => rows.slice());
    this.status = 'playing';
    this.score = 0;
    this.addRandom();
    this.addRandom();
  }

  restart() {
    this.board = this.initialState.map((rows) => rows.slice());
    this.status = 'idle';
    this.score = 0;
  }
}

// export default Game;
module.exports = Game;
