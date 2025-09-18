'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;

    this.copyInitialState = this.copy(initialState);
    this.status = 'idle';
    this.score = 0;
  }

  copy(arr) {
    return arr.map((row) => [...row]);
  }

  moveLeft() {
    if (this.status === 'playing') {
      const copyInitialState = this.copy(this.initialState);

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        const newRow = [];

        for (let i = 0; i < 4; i++) {
          if (this.initialState[rowIndex][i] !== 0) {
            newRow.push(this.initialState[rowIndex][i]);
          }
        }

        this.mergeCells(newRow);

        for (let index = 0; index < 4; index++) {
          this.initialState[rowIndex][index] = newRow[index] || 0;
        }
      }

      if (this.canMove(copyInitialState, this.initialState)) {
        this.randomCell();
      }

      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const copyInitialState = this.copy(this.initialState);

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        const newRow = [];

        for (let i = 3; i >= 0; i--) {
          if (this.initialState[rowIndex][i] !== 0) {
            newRow.push(this.initialState[rowIndex][i]);
          }
        }

        this.mergeCells(newRow);

        let newRowIndex = 0;

        for (let index = 3; index >= 0; index--) {
          this.initialState[rowIndex][index] = newRow[newRowIndex] || 0;
          newRowIndex++;
        }
      }

      if (this.canMove(copyInitialState, this.initialState)) {
        this.randomCell();
      }

      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const copyInitialState = this.copy(this.initialState);

      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        const newColumn = [];

        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          if (this.initialState[rowIndex][columnIndex] !== 0) {
            newColumn.push(this.initialState[rowIndex][columnIndex]);
          }
        }

        this.mergeCells(newColumn);

        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          this.initialState[rowIndex][columnIndex] = newColumn[rowIndex] || 0;
        }
      }

      if (this.canMove(copyInitialState, this.initialState)) {
        this.randomCell();
      }

      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const copyInitialState = this.copy(this.initialState);

      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        const newColumn = [];

        for (let rowIndex = 3; rowIndex >= 0; rowIndex--) {
          if (this.initialState[rowIndex][columnIndex] !== 0) {
            newColumn.push(this.initialState[rowIndex][columnIndex]);
          }
        }

        this.mergeCells(newColumn);

        let index = 0;

        for (let rowIndex = 3; rowIndex >= 0; rowIndex--) {
          this.initialState[rowIndex][columnIndex] = newColumn[index] || 0;
          index++;
        }
      }

      if (this.canMove(copyInitialState, this.initialState)) {
        this.randomCell();
      }

      this.updateStatus();
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
    return this.initialState;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';

    this.randomCell();
    this.randomCell();
  }

  restart() {
    this.status = 'idle';
    this.score = 0;

    this.initialState = this.copy(this.copyInitialState);
  }

  randomCell() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.initialState[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.initialState[row][col] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  canMove(oldState, newState) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (oldState[i][j] !== newState[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameOver(state) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (state[i][j] === 0) {
          return false;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j < 3 && state[i][j] === state[i][j + 1]) {
          return false;
        }

        if (i < 3 && state[i][j] === state[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  checkWin(state) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (state[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.status === 'playing') {
      if (this.checkWin(this.initialState)) {
        this.status = 'win';
      } else if (this.checkGameOver(this.initialState)) {
        this.status = 'lose';
      }
    }
  }

  mergeCells(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1] && row[i] !== 0) {
        row[i] *= 2;
        this.score += row[i];
        row.splice(i + 1, 1);
      }
    }
  }
}

module.exports = Game;
