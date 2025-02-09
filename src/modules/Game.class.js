'use strict';

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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.state = this.initialState.map((row) => [...row]);
    this.isStarted = false;
    this.score = 0;
    this.status = 'idle';
  }

  move(state) {
    const newState = state.map((row) => {
      const rowWithoutZeros = row.filter((n) => n !== 0);

      for (let i = 1; i < rowWithoutZeros.length; i++) {
        if (rowWithoutZeros[i] === rowWithoutZeros[i - 1]) {
          rowWithoutZeros[i - 1] = rowWithoutZeros[i - 1] * 2;
          rowWithoutZeros[i] = 0;
          this.score += rowWithoutZeros[i - 1];
          i++;
        }
      }

      const compacted = rowWithoutZeros.filter((n) => n !== 0);

      while (compacted.length <= 3) {
        compacted.push(0);
      }

      return compacted;
    });

    return newState;
  }

  moveLeft() {
    if (!this.isStarted) {
      return;
    }

    const newState = this.move(this.state);

    if (!this.checkState(this.state, newState)) {
      const updateState = this.setCell(newState);

      this.isWine(updateState);

      if (this.isLose(updateState) === false) {
        this.status = 'lose';
      }

      return updateState;
    }

    return newState;
  }

  moveRight() {
    if (!this.isStarted) {
      return;
    }

    const state = this.state.map((row) => [...row]);

    state.map((row) => row.reverse());

    const newState = this.move(state).map((row) => row.reverse());

    if (!this.checkState(this.state, newState)) {
      const updateState = this.setCell(newState);

      this.isWine(updateState);

      if (this.isLose(updateState) === false) {
        this.status = 'lose';
      }

      return updateState;
    }

    return newState;
  }

  moveUp() {
    if (!this.isStarted) {
      return;
    }

    const state = this.state.map((row) => [...row]);
    const transposedState = this.transposedState(state, 'up');
    const newState = this.transposedState(this.move(transposedState), 'up');

    if (!this.checkState(this.state, newState)) {
      const updateState = this.setCell(newState);

      this.isWine(updateState);

      if (this.isLose(updateState) === false) {
        this.status = 'lose';
      }

      return updateState;
    }

    return newState;
  }

  moveDown() {
    if (!this.isStarted) {
      return;
    }

    const state = this.state.map((row) => [...row]);
    const transposedState = this.transposedState(state).map((row) => {
      return row.reverse();
    });

    const newState = this.transposedState(
      this.move(transposedState).map((row) => row.reverse()),
    );

    if (!this.checkState(this.state, newState)) {
      const updateState = this.setCell(newState);

      this.isWine(updateState);

      if (this.isLose(updateState) === false) {
        this.status = 'lose';
      }

      return updateState;
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
    this.status = 'playing';

    for (let i = 0; i < 2; i++) {
      this.setCell();
    }

    return this.state;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  excludedIndex(index = false) {
    const excludedIndex = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== 0) {
          excludedIndex.push(rowIndex * 4 + colIndex);
        }
      });
    });

    if (index !== false) {
      excludedIndex.push(index);
    }

    return excludedIndex;
  }

  checkState(oldState, newState) {
    return oldState.every(
      (row, i) =>
        row.length === newState[i].length &&
        row.every((num, j) => num === newState[i][j]),
    );
  }

  setCell(newState = null) {
    if (newState) {
      this.state = newState;
    }

    const arrIndex = this.excludedIndex();

    if (arrIndex.length >= 16) {
      return this.state;
    }

    const newCellIndex = this.randomIndex(arrIndex);
    const row = Math.floor(newCellIndex / 4);
    const col = newCellIndex % 4;

    this.state[row][col] = this.randomValue();

    return this.state;
  }

  transposedState(state) {
    const result = [];

    for (let col = 0; col < state.length; col++) {
      result[col] = [];

      for (let row = 0; row < state[col].length; row++) {
        result[col].push(state[row][col]);
      }
    }

    return result;
  }

  randomIndex(excludedNumbers) {
    const allNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const availableNumbers = allNumbers.filter(
      (num) => !excludedNumbers.includes(num),
    );
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);

    return availableNumbers[randomIndex];
  }

  randomValue() {
    const rand = Math.random() * 100;
    let number = 0;

    if (rand <= 90) {
      number = 2;
    } else {
      number = 4;
    }

    return number;
  }

  isLose(state) {
    let isStatus = false;

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 1; col < this.state[row].length; col++) {
        if (state[row][col] === 0 || state[row][col] === state[row][col - 1]) {
          isStatus = true;
        }
      }
    }

    return isStatus;
  }

  isWine(state) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (state[row][col] === 2048) {
          this.status = 'win';
          break;
        }
      }
    }
  }
}

module.exports = Game;
