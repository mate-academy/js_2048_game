'use strict';

const { GAME_STATUS, WIN_SCORE } = require('../constants/constants');

const INITIAL_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
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
  constructor(initialState = INITIAL_STATE) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.isStarted = false;
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  move(state) {
    const newState = state.map((row) => {
      const newRow = row.filter((cell) => cell !== 0);

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] = newRow[i] * 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
        }
      }

      const finalRow = newRow.filter((cell) => cell !== 0);

      while (finalRow.length < 4) {
        finalRow.push(0);
      }

      return finalRow;
    });

    return newState;
  }

  moveLeft() {
    if (!this.isStarted) {
      return;
    }

    const newState = this.move(this.state);

    this.applyMove(newState);
  }

  moveRight() {
    if (!this.isStarted) {
      return;
    }

    const state = this.state.map((row) => [...row].reverse());

    const newState = this.move(state).map((row) => row.reverse());

    this.applyMove(newState);
  }

  moveUp() {
    if (!this.isStarted) {
      return;
    }

    const rotated = this.transpose(this.state);
    const newState = this.transpose(this.move(rotated));

    this.applyMove(newState);
  }

  moveDown() {
    if (!this.isStarted) {
      return;
    }

    const rotated = this.transpose(this.state).map((row) => row.reverse());
    const newState = this.transpose(
      this.move(rotated).map((row) => row.reverse()),
    );

    this.applyMove(newState);
  }

  applyMove(newState) {
    if (!this.isSameState(this.state, newState)) {
      this.setCell(newState);

      this.checkWin();

      if (!this.hasMoves()) {
        this.status = GAME_STATUS.LOSE;
      }

      return this.state;
    }

    return newState;
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

  /**
   * Starts the game.
   */
  start() {
    this.isStarted = true;
    this.status = GAME_STATUS.PLAYING;

    for (let i = 0; i < 2; i++) {
      this.setCell();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  transpose(state) {
    const result = [];

    for (let col = 0; col < state.length; col++) {
      result[col] = [];

      for (let row = 0; row < state[col].length; row++) {
        result[col].push(state[row][col]);
      }
    }

    return result;
  }

  hasMoves() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state.length; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  excludedIndexes() {
    const excludedIndexes = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell !== 0) {
          excludedIndexes.push(rowIndex * 4 + cellIndex);
        }
      });
    });

    return excludedIndexes;
  }

  setCell(newState = null) {
    if (newState) {
      this.state = newState;
    }

    const newCellIndex = this.getRandomIndex();

    if (newCellIndex === undefined) {
      return;
    }

    const row = Math.floor(newCellIndex / 4);
    const col = newCellIndex % 4;

    this.state[row][col] = this.getRandomValue();
  }

  getRandomIndex() {
    const allIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    const emptyIndexes = allIndexes.filter(
      (index) => !this.excludedIndexes().includes(index),
    );

    if (!emptyIndexes.length) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * emptyIndexes.length);

    return emptyIndexes[randomIndex];
  }

  getRandomValue() {
    return Math.random() * 100 <= 90 ? 2 : 4;
  }

  isSameState(oldState, newState) {
    const sameState = oldState.every(
      (row, i) =>
        row.length === newState[i].length &&
        row.every((num, j) => num === newState[i][j]),
    );

    return sameState;
  }

  checkWin() {
    if (this.state.some((row) => row.includes(WIN_SCORE))) {
      this.status = GAME_STATUS.WIN;
    }
  }
}

module.exports = Game;
