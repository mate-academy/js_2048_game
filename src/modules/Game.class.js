'use strict';

const {
  STATUS_IDLE,
  STATUS_PLAYING,
  STATUS_WIN,
  STATUS_LOSE,
} = require('./constants');

class Game {
  /**
   * @param {number[][]} initialState
   */

  constructor(initialState = this.createEmptyBoard()) {
    this.state = initialState;
    this.score = 0;
    this.status = STATUS_IDLE;
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r: row, c: col } = emptyCells[randomIndex];

    const newTileValue = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = newTileValue;
  }

  mergeRow(row) {
    const nonZeroRow = row.filter((cell) => cell !== 0);
    const mergedRow = [];

    for (let i = 0; i < nonZeroRow.length; i++) {
      const currentValue = nonZeroRow[i];

      if (i < nonZeroRow.length - 1 && nonZeroRow[i] === nonZeroRow[i + 1]) {
        const newValue = currentValue * 2;

        if (newValue === 2048) {
          this.status = STATUS_WIN;
        }

        mergedRow.push(newValue);
        nonZeroRow[i + 1] = 0;
        i++;
        this.score += newValue;
      } else {
        mergedRow.push(currentValue);
      }
    }

    while (mergedRow.length < row.length) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  canMove() {
    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }

        if (
          c < this.state[r].length - 1 &&
          this.state[r][c] === this.state[r][c + 1]
        ) {
          return true;
        }

        if (
          r < this.state.length - 1 &&
          this.state[r][c] === this.state[r + 1][c]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(grid) {
    return grid[0].map((_, index) => grid.map((row) => row[index]));
  }

  move(direction) {
    switch (direction) {
      case 'up':
        this.state = this.transpose(this.state);
        this.state = this.state.map((row) => this.mergeRow(row));
        this.state = this.transpose(this.state);
        break;

      case 'down':
        this.state = this.transpose(this.state);
        this.state = this.state.map((row) => row.reverse());
        this.state = this.state.map((row) => this.mergeRow(row));
        this.state = this.state.map((row) => row.reverse());
        this.state = this.transpose(this.state);
        break;

      case 'right':
        this.state = this.state.map((row) => row.reverse());
        this.state = this.state.map((row) => this.mergeRow(row));
        this.state = this.state.map((row) => row.reverse());
        break;

      case 'left':
        this.state = this.state.map((row) => this.mergeRow(row));
        break;
    }

    if (!this.canMove()) {
      this.status = STATUS_LOSE;

      return;
    }

    this.addRandomTile();
  }

  moveLeft() {
    if (this.status === STATUS_PLAYING) {
      this.move('left');
    }
  }

  moveRight() {
    if (this.status === STATUS_PLAYING) {
      this.move('right');
    }
  }

  moveUp() {
    if (this.status === STATUS_PLAYING) {
      this.move('up');
    }
  }

  moveDown() {
    if (this.status === STATUS_PLAYING) {
      this.move('down');
    }
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
    return this.state;
  }

  /**
   * @returns {string}
   */
  getStatus() {
    return this.status;
  }

  start() {
    this.status = STATUS_PLAYING;
    this.state = this.createEmptyBoard();
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }
}

module.exports = Game;
