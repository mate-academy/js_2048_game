'use strict';

/**
 * This class represents the game.
 */
class Game {
  static GAME_STATUS = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  static ROW_LENGTH = 4;
  static COL_LENGTH = 4;

  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(
    initialState = Array.from({ length: 4 }, () => Array(4).fill(0)),
  ) {
    this.status = Game.GAME_STATUS.IDLE;
    this.score = 0;
    this.initialState = initialState.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = Game.GAME_STATUS.PLAYING;
    this.addNewCell();
    this.addNewCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.status = Game.GAME_STATUS.IDLE;
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== Game.GAME_STATUS.PLAYING) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let rowIndex = 0; rowIndex < Game.ROW_LENGTH; rowIndex++) {
      let row = this.state[rowIndex].filter((cell) => cell !== 0);

      if (row.length === 0) {
        continue;
      }

      for (let colIndex = 0; colIndex < row.length - 1; colIndex++) {
        if (row[colIndex] === 0) {
          continue;
        }

        if (row[colIndex] === row[colIndex + 1]) {
          row[colIndex] *= 2;
          row[colIndex + 1] = 0;
          this.score += row[colIndex];
        }
      }

      row = row.filter((cell) => cell !== 0);

      while (row.length < Game.COL_LENGTH) {
        row.push(0);
      }

      this.state[rowIndex] = row;
    }

    if (!this.statesAreEqual(previousState, this.state)) {
      this.addNewCell();
    }

    this.checkWinLose();
  }

  moveRight() {
    if (this.status !== Game.GAME_STATUS.PLAYING) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let rowIndex = 0; rowIndex < Game.ROW_LENGTH; rowIndex++) {
      let row = this.state[rowIndex].filter((cell) => cell !== 0);

      if (row.length === 0) {
        continue;
      }

      for (let colIndex = row.length - 1; colIndex > 0; colIndex--) {
        if (row[colIndex] === 0) {
          continue;
        }

        if (row[colIndex] === row[colIndex - 1]) {
          row[colIndex] *= 2;
          row[colIndex - 1] = 0;
          this.score += row[colIndex];
        }
      }

      row = row.filter((cell) => cell !== 0);

      while (row.length < Game.COL_LENGTH) {
        row.unshift(0);
      }

      this.state[rowIndex] = row;
    }

    if (!this.statesAreEqual(previousState, this.state)) {
      this.addNewCell();
    }

    this.checkWinLose();
  }

  moveUp() {
    if (this.status !== Game.GAME_STATUS.PLAYING) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let colIndex = 0; colIndex < Game.COL_LENGTH; colIndex++) {
      let column = [];

      for (let rowIndex = 0; rowIndex < Game.ROW_LENGTH; rowIndex++) {
        if (this.state[rowIndex][colIndex] !== 0) {
          column.push(this.state[rowIndex][colIndex]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === 0) {
          continue;
        }

        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          column[i + 1] = 0;
          this.score += column[i];
        }
      }

      column = column.filter((cell) => cell !== 0);

      while (column.length < Game.ROW_LENGTH) {
        column.push(0);
      }

      for (let rowIndex = 0; rowIndex < Game.ROW_LENGTH; rowIndex++) {
        this.state[rowIndex][colIndex] = column[rowIndex];
      }
    }

    if (!this.statesAreEqual(previousState, this.state)) {
      this.addNewCell();
    }

    this.checkWinLose();
  }

  moveDown() {
    if (this.status !== Game.GAME_STATUS.PLAYING) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let colIndex = 0; colIndex < Game.COL_LENGTH; colIndex++) {
      let column = [];

      for (let rowIndex = 0; rowIndex < Game.ROW_LENGTH; rowIndex++) {
        if (this.state[rowIndex][colIndex] !== 0) {
          column.push(this.state[rowIndex][colIndex]);
        }
      }

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === 0) {
          continue;
        }

        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          column[i - 1] = 0;
          this.score += column[i];
        }
      }

      column = column.filter((cell) => cell !== 0);

      while (column.length < Game.ROW_LENGTH) {
        column.unshift(0);
      }

      for (let rowIndex = 0; rowIndex < Game.ROW_LENGTH; rowIndex++) {
        this.state[rowIndex][colIndex] = column[rowIndex];
      }
    }

    if (!this.statesAreEqual(previousState, this.state)) {
      this.addNewCell();
    }

    this.checkWinLose();
  }

  statesAreEqual(state1, state2) {
    return state1.flat().join() === state2.flat().join();
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

  addNewCell() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, cellIndex]);
        }
      });
    });

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  checkWinLose() {
    if (this.state.flat().includes(2048)) {
      this.status = Game.GAME_STATUS.WIN;
    } else if (!this.state.flat().includes(0) && !this.checkMergePossible()) {
      this.status = Game.GAME_STATUS.LOSE;
    }
  }

  checkMergePossible() {
    for (let rowIndex = 0; rowIndex < Game.ROW_LENGTH; rowIndex++) {
      for (let colIndex = 0; colIndex < Game.COL_LENGTH; colIndex++) {
        if (
          colIndex < Game.COL_LENGTH - 1 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex][colIndex + 1]
        ) {
          return true;
        }

        if (
          rowIndex < Game.ROW_LENGTH - 1 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex + 1][colIndex]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
