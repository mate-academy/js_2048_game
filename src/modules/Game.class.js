'use strict';
class Game {
  constructor() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.board = this.initialState.map((item) => this.item.slice());
    this.size = 4;
  }

  start() {
    this.board = this.initialState.map((item) => item.slice());
    this.status = 'playing';
    this.addRandom();
    this.addRandom();
  }

  restart() {
    this.board = this.initialState.map((item) => item.slice());
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < this.size; i++) {
      let row = this.board.filter((item) => item !== 0);

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

      this.board = row;

      if (moved) {
        this.postMoved();
      }
    }
  }

  moveRight() {
    this.reverseRows();
    this.moveLeft();
    this.reverseRows();
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

  reverseRows() {
    this.board.forEach((row) => row.reverse());
  }

  transpose() {
    this.board = this.board[0].map((_, index) => {
      this.board.map((row) => row[index]);
    });
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

  addRandom() {
    const emptyCeels = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCeels.push({ x: i, y: j });
        }
      }
    }

    if (emptyCeels.length === 0) {
      return null;
    }

    const { x, y } = emptyCeels[Math.floor(Math.random() * emptyCeels.length)];

    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  checkWin() {
    return this.board.some((row) => row.includes('2048'));
  }

  checkLose() {
    return !this.board.some((row, i) => {
      row.some(
        (item, j) =>
          item === 0 ||
          (i > 0 && item === this.board[i - 1][j]) ||
          (i < this.size - 1 && item === this.board[i + 1][j]) ||
          (j > 0 && item === this.board[i][j - 1]) ||
          (j < this.size - 1 && item === this.board[i][j + 1]),
      );
    });
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initias.board);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }
}

module.exports = Game;
