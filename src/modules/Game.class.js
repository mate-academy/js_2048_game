'use strict';

class Game {
  static NUMBER_OF_ROWS_CELLS = 4;
  initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor() {
    this.state = structuredClone(this.initialState);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    for (let i = 0; i < this.NUMBER_OF_ROWS_CELLS; i++) {
      for (let j = 0; j < this.NUMBER_OF_ROWS_CELLS - 1; j++) {
        if (
          this.state[i][j] === this.state[i][j + 1] &&
          this.state[i][j] !== 0
        ) {
          this.state[i][j] *= 2;
          this.score += this.state[i][j];
          this.state[i][j + 1] = 0;
        }
      }
    }

    for (let num = 1; num <= this.NUMBER_OF_ROWS_CELLS - 1; num++) {
      for (let i = 0; i < this.NUMBER_OF_ROWS_CELLS; i++) {
        for (let j = 0; j < this.NUMBER_OF_ROWS_CELLS - 1; j++) {
          if (this.state[i][j] === 0 && this.state[i][j + 1] !== 0) {
            this.state[i][j] = this.state[i][j + 1];
            this.state[i][j + 1] = 0;
          }
        }
      }
    }

    this.spawnNumber();
    this.checkStatus();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    for (let i = this.NUMBER_OF_ROWS_CELLS - 1; i >= 0; i--) {
      for (let j = this.NUMBER_OF_ROWS_CELLS - 1; j > 0; j--) {
        if (
          this.state[i][j] === this.state[i][j - 1] &&
          this.state[i][j] !== 0
        ) {
          this.state[i][j] *= 2;
          this.score += this.state[i][j];
          this.state[i][j - 1] = 0;
        }
      }
    }

    for (let num = 1; num < this.NUMBER_OF_ROWS_CELLS - 1; num++) {
      for (let i = this.NUMBER_OF_ROWS_CELLS - 1; i >= 0; i--) {
        for (let j = this.NUMBER_OF_ROWS_CELLS - 1; j > 0; j--) {
          if (this.state[i][j] === 0 && this.state[i][j - 1] !== 0) {
            this.state[i][j] = this.state[i][j - 1];
            this.state[i][j - 1] = 0;
          }
        }
      }
    }

    this.spawnNumber();
    this.checkStatus();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    for (let j = 0; j < this.NUMBER_OF_ROWS_CELLS; j++) {
      for (let i = 0; i < this.NUMBER_OF_ROWS_CELLS - 1; i++) {
        if (
          this.state[i][j] === this.state[i + 1][j] &&
          this.state[i][j] !== 0
        ) {
          this.state[i][j] *= 2;
          this.score += this.state[i][j];
          this.state[i + 1][j] = 0;
        }
      }
    }

    for (let num = 1; num <= this.NUMBER_OF_ROWS_CELLS - 1; num++) {
      for (let j = 0; j < this.NUMBER_OF_ROWS_CELLS; j++) {
        for (let i = 0; i < this.NUMBER_OF_ROWS_CELLS - 1; i++) {
          if (this.state[i][j] === 0 && this.state[i + 1][j] !== 0) {
            this.state[i][j] = this.state[i + 1][j];
            this.state[i + 1][j] = 0;
          }
        }
      }
    }

    this.spawnNumber();
    this.checkStatus();
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    for (let j = this.NUMBER_OF_ROWS_CELLS - 1; j >= 0; j--) {
      for (let i = this.NUMBER_OF_ROWS_CELLS - 1; i > 0; i--) {
        if (
          this.state[i][j] === this.state[i - 1][j] &&
          this.state[i][j] !== 0
        ) {
          this.state[i][j] *= 2;
          this.score += this.state[i][j];
          this.state[i - 1][j] = 0;
        }
      }
    }

    for (let num = 1; num < this.NUMBER_OF_ROWS_CELLS - 1; num++) {
      for (let j = this.NUMBER_OF_ROWS_CELLS - 1; j >= 0; j--) {
        for (let i = this.NUMBER_OF_ROWS_CELLS - 1; i > 0; i--) {
          if (this.state[i][j] === 0 && this.state[i - 1][j] !== 0) {
            this.state[i][j] = this.state[i - 1][j];
            this.state[i - 1][j] = 0;
          }
        }
      }
    }

    this.spawnNumber();
    this.checkStatus();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.score = 0;
      this.spawnNumber();
      this.spawnNumber();
    }
  }

  restart() {
    this.state = structuredClone(this.initialState);
    this.status = 'idle';
    this.score = 0;
  }

  spawnNumber() {
    const freeCell = [];

    for (let i = 0; i < this.NUMBER_OF_ROWS_CELLS; i++) {
      for (let j = 0; j < this.NUMBER_OF_ROWS_CELLS; j++) {
        if (this.state[i][j] === 0) {
          freeCell.push({ x: i, y: j });
        }
      }
    }

    if (freeCell.length === 0) {
      return;
    }

    const randomCell = Math.floor(Math.random() * freeCell.length);
    const PROBABILITY_FOR_FOUR = 10;
    const randomNumber =
      Math.random() * 100 + 1 <= PROBABILITY_FOR_FOUR ? 4 : 2;

    this.state[freeCell[randomCell].x][freeCell[randomCell].y] = randomNumber;
  }

  checkStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    if (this.state.some((row) => row.includes(0))) {
      return true;
    }

    for (let i = 0; i < this.NUMBER_OF_ROWS_CELLS - 1; i++) {
      for (let j = 0; j < this.NUMBER_OF_ROWS_CELLS - 1; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return true;
        } else if (this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
