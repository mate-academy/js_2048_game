'use strict';

class Game {
  constructor() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.isStarted = false;
    this.gameStarted = false;
  }

  moveLeft() {
    for (let i = 0; i < 4; i++) {
      const numbers = this.board[i].filter((val) => val !== 0);

      for (let j = 0; j < numbers.length; j++) {
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

      this.board[i] = result;
    }
  }

  moveRight() {
    for (let i = 0; i < 4; i++) {
      const numbers = this.board[i].filter((val) => val !== 0);

      for (let j = numbers.length - 1; j >= 0; j--) {
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

      this.board[i] = result;
    }
  }

  moveUp() {
    for (let i = 0; i < 4; i++) {
      const columns = [];

      for (let j = 0; j < 4; j++) {
        columns.push(this.board[j][i]);
      }

      const numbers = columns.filter((val) => val !== 0);

      for (let j = 0; j < numbers.length; j++) {
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
        this.board[j][i] = result[j];
      }
    }
  }

  moveDown() {
    for (let i = 0; i < 4; i++) {
      const columns = [];

      for (let j = 0; j < 4; j++) {
        columns.push(this.board[j][i]);
      }

      const numbers = columns.filter((val) => val !== 0);

      for (let j = numbers.length - 1; j >= 0; j--) {
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
        this.board[j][i] = result[j];
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    for (let i = 0; i < 4; i++) {
      if (this.board[i].includes(2048)) {
        return 'win';
      }
    }

    if (this.canMove()) {
      return this.isStarted ? 'playing' : 'idle';
    }

    return 'lose';
  }

  start() {
    this.gameStarted = true;
    this.isStarted = true;

    let count = 0;

    while (count < 2) {
      const r = Math.floor(Math.random() * 4);
      const c = Math.floor(Math.random() * 4);

      // Добавляем двойку только если клетка пустая
      if (this.board[r][c] === 0) {
        this.board[r][c] = 2;
        count++;
      }
    }
  }

  restart() {
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.gameStarted = true;
    this.isStarted = true;

    let count = 0;

    while (count < 2) {
      const r = Math.floor(Math.random() * 4);
      const c = Math.floor(Math.random() * 4);

      // Добавляем двойку только если клетка пустая
      if (this.board[r][c] === 0) {
        this.board[r][c] = 2;
        count++;
      }
    }
  }

  addNewNumber() {
    if (this.gameStarted) {
      let indexOfRow = Math.floor(Math.random() * 4);
      let indexOfColumn = Math.floor(Math.random() * 4);
      const chanceNumber = Math.floor(Math.random() * 101);
      let number;
      let check = true;

      while (check) {
        if (!this.canMove()) {
          check = false;
        }

        if (this.board[indexOfRow][indexOfColumn] === 0) {
          check = false;

          if (chanceNumber < 10) {
            number = 4;
          } else {
            number = 2;
          }

          this.board[indexOfRow][indexOfColumn] = number;
        } else {
          indexOfRow = Math.floor(Math.random() * 4);
          indexOfColumn = Math.floor(Math.random() * 4);
        }
      }
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
