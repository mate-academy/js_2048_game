'use strict';

class Game {
  /**
   *
   * @param {number[][]} [initialState]
   */
  constructor() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.isStarted = false;
  }

  moveLeft() {
    if (!this.isStarted) {
      return;
    }

    let hasChanged = false;

    for (let i = 0; i < 4; i++) {
      const numbers = this.board[i].filter((val) => val !== 0);

      for (let j = 0; j < numbers.length - 1; j++) {
        if (numbers[j] === numbers[j + 1]) {
          numbers[j] *= 2;
          this.score += numbers[j];
          numbers[j + 1] = 0;
          j++;
        }
      }

      const result = numbers.filter((num) => num !== 0);

      while (result.length < 4) {
        result.push(0);
      }

      if (JSON.stringify(this.board[i]) !== JSON.stringify(result)) {
        hasChanged = true;
      }

      this.board[i] = result;
    }

    if (hasChanged) {
      this.addNewNumber();
    }
  }

  moveRight() {
    if (!this.isStarted) {
      return;
    }

    let hasChanged = false;

    for (let i = 0; i < 4; i++) {
      const numbers = this.board[i].filter((val) => val !== 0);

      for (let j = numbers.length - 1; j > 0; j--) {
        if (numbers[j] === numbers[j - 1]) {
          numbers[j] *= 2;
          this.score += numbers[j];
          numbers[j - 1] = 0;
          j--;
        }
      }

      const result = numbers.filter((num) => num !== 0);

      while (result.length < 4) {
        result.unshift(0);
      }

      if (JSON.stringify(this.board[i]) !== JSON.stringify(result)) {
        hasChanged = true;
      }

      this.board[i] = result;
    }

    if (hasChanged) {
      this.addNewNumber();
    }
  }

  moveUp() {
    if (!this.isStarted) {
      return;
    }

    let hasChanged = false;

    for (let i = 0; i < 4; i++) {
      const columns = [];

      for (let j = 0; j < 4; j++) {
        columns.push(this.board[j][i]);
      }

      const numbers = columns.filter((val) => val !== 0);

      for (let j = 0; j < numbers.length - 1; j++) {
        if (numbers[j] === numbers[j + 1]) {
          numbers[j] *= 2;
          this.score += numbers[j];
          numbers[j + 1] = 0;
          j++;
        }
      }

      const result = numbers.filter((num) => num !== 0);

      while (result.length < 4) {
        result.push(0);
      }

      for (let j = 0; j < 4; j++) {
        if (this.board[j][i] !== result[j]) {
          hasChanged = true;
        }

        this.board[j][i] = result[j];
      }
    }

    if (hasChanged) {
      this.addNewNumber();
    }
  }

  moveDown() {
    if (!this.isStarted) {
      return;
    }

    let hasChanged = false;

    for (let i = 0; i < 4; i++) {
      const columns = [];

      for (let j = 0; j < 4; j++) {
        columns.push(this.board[j][i]);
      }

      const numbers = columns.filter((val) => val !== 0);

      for (let j = numbers.length - 1; j > 0; j--) {
        if (numbers[j] === numbers[j - 1]) {
          numbers[j] *= 2;
          this.score += numbers[j];
          numbers[j - 1] = 0;
          j--;
        }
      }

      const result = numbers.filter((num) => num !== 0);

      while (result.length < 4) {
        result.unshift(0);
      }

      for (let j = 0; j < 4; j++) {
        if (this.board[j][i] !== result[j]) {
          hasChanged = true;
        }

        this.board[j][i] = result[j];
      }
    }

    if (hasChanged) {
      this.addNewNumber();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (!this.isStarted) {
      return 'idle';
    }

    for (let i = 0; i < 4; i++) {
      if (this.board[i].includes(2048)) {
        return 'win';
      }
    }

    if (this.canMove()) {
      return 'playing';
    }

    return 'lose';
  }

  start() {
    if (this.isStarted) {
      return;
    }

    this.isStarted = true;
    this.addNewNumber();
    this.addNewNumber();
  }

  restart() {
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.isStarted = true;
    this.addNewNumber();
    this.addNewNumber();
  }

  addNewNumber() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { r, c } = emptyCells[randomIndex];
      const number = Math.random() < 0.1 ? 4 : 2;

      this.board[r][c] = number;
    }
  }

  canMove() {
    const state = this.board;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (state[i][j] === 0) {
          return true;
        }

        if (j < 3 && state[i][j] === state[i][j + 1]) {
          return true;
        }

        if (i < 3 && state[i][j] === state[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
