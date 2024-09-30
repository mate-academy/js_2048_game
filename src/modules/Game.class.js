'use strict';

class Game {
  constructor(initialState) {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.rows = 4;
    this.columns = 4;
    this.emptyCells = [];
    this.status = 'idle';
  }

  checkWin() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  checkAvailableMoves() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (r < this.rows - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }

        if (c < this.columns - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  getEmptyCells() {
    this.emptyCells = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          this.emptyCells.push([r, c]);
        }
      }
    }

    return this.emptyCells;
  }

  setRandomNum() {
    this.getEmptyCells();

    if (this.emptyCells.length === 0) {
      if (!this.checkAvailableMoves()) {
        this.status = 'lose';
      }

      return;
    }

    const randomIndex = Math.floor(Math.random() * this.emptyCells.length);

    const [r, c] = this.emptyCells[randomIndex];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;

    this.checkWin();

    if (!this.checkAvailableMoves()) {
      this.status = 'lose';
    }
  }

  slide(row) {
    function removeZeroes() {
      return row.filter((num) => num !== 0);
    }
    // eslint-disable-next-line no-param-reassign
    row = removeZeroes(row);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    // eslint-disable-next-line no-param-reassign
    row = removeZeroes(row);

    while (row.length < this.columns) {
      row.push(0);
    }

    return row;
  }

  moveLeft() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];

      row = this.slide(row);
      this.board[r] = row;
    }
    this.setRandomNum();
  }

  moveRight() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];

      row.reverse();
      row = this.slide(row);
      row.reverse();
      this.board[r] = row;
    }
    this.setRandomNum();
  }

  moveUp() {
    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      row = this.slide(row);
      this.board[0][c] = row[0];
      this.board[1][c] = row[1];
      this.board[2][c] = row[2];
      this.board[3][c] = row[3];
    }
    this.setRandomNum();
  }

  moveDown() {
    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      row.reverse();
      row = this.slide(row);
      row.reverse();
      this.board[0][c] = row[0];
      this.board[1][c] = row[1];
      this.board[2][c] = row[2];
      this.board[3][c] = row[3];
    }
    this.setRandomNum();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.setRandomNum();
    this.setRandomNum();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
