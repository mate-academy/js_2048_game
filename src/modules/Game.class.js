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
  #gameStatus = 'idle';
  #movingIndikator = [];
  #score = 0;

  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.state = JSON.parse(JSON.stringify(this.initialState));
  }

  moveLeft() {
    for (let i = 0; i < this.state.length; i++) {
      const curRow = this.state[i];
      const arr = this.#mergeBackward(this.#groupCells(curRow));
      let currentMove = false;

      currentMove = !this.#isArraysEqual(curRow, arr);
      this.#movingIndikator.push(currentMove);

      if (currentMove) {
        for (let j = 0; j < arr.length; j++) {
          curRow[j] = arr[j];
        }
      }
    }

    if (this.#movingIndikator.includes(true)) {
      this.#setValue(this.state);
      this.#movingIndikator.length = 0;
    }

    this.#updateStatus();
  }

  moveRight() {
    for (let i = 0; i < this.state.length; i++) {
      const curRow = this.state[i];
      const arr = this.#mergeForward(this.#groupCells(curRow));
      let currentMove = false;

      currentMove = !this.#isArraysEqual(curRow, arr);
      this.#movingIndikator.push(currentMove);

      if (currentMove) {
        for (let j = 0; j < arr.length; j++) {
          curRow[j] = arr[j];
        }
      }
    }

    if (this.#movingIndikator.includes(true)) {
      this.#setValue(this.state);
      this.#movingIndikator.length = 0;
    }

    this.#updateStatus();
  }

  moveUp() {
    for (let i = 0; i < this.state.length; i++) {
      const curColumn = this.#getColumn(this.state, i);
      const arr = this.#mergeBackward(this.#groupCells(curColumn));
      let currentMove = false;

      currentMove = !this.#isArraysEqual(curColumn, arr);
      this.#movingIndikator.push(currentMove);

      if (currentMove) {
        for (let j = 0; j < arr.length; j++) {
          this.state[j][i] = arr[j];
        }
      }
    }

    if (this.#movingIndikator.includes(true)) {
      this.#setValue(this.state);
      this.#movingIndikator.length = 0;
    }

    this.#updateStatus();
  }

  moveDown() {
    for (let i = 0; i < this.state.length; i++) {
      const curColumn = this.#getColumn(this.state, i);
      const arr = this.#mergeForward(this.#groupCells(curColumn));
      let currentMove = false;

      currentMove = !this.#isArraysEqual(curColumn, arr);
      this.#movingIndikator.push(currentMove);

      if (currentMove) {
        for (let j = 0; j < arr.length; j++) {
          this.state[j][i] = arr[j];
        }
      }
    }

    if (this.#movingIndikator.includes(true)) {
      this.#setValue(this.state);
      this.#movingIndikator.length = 0;
    }

    this.#updateStatus();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
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
    return this.#gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#updateStatus();
    this.#setValue(this.state);
    this.#setValue(this.state);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#gameStatus = 'idle';
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.#score = 0;
  }

  // Add your own methods here
  #getFlatEmptyIndexes(field) {
    const result = [];

    field.flat().forEach((item, ind, arr) => {
      if (item === 0) {
        result.push(ind);
      }
    });

    return result;
  }

  #chooseEmptyRandCoords(field) {
    const emptyFlatIndexes = this.#getFlatEmptyIndexes(field);

    if (emptyFlatIndexes.length) {
      const randInd = Math.floor(Math.random() * emptyFlatIndexes.length);
      const randItem = emptyFlatIndexes[randInd];

      return [Math.floor(randItem / 4), randItem % 4];
    }
  }

  #setValue(field) {
    this.#updateStatus();

    if (this.#gameStatus === 'idle' || this.#gameStatus === 'playing') {
      const coords = this.#chooseEmptyRandCoords(field);
      const randNum = Math.floor(1 + Math.random() * 10);

      if (randNum === 1) {
        field[coords[0]][coords[1]] = 4;
      } else {
        field[coords[0]][coords[1]] = 2;
      }
    }
  }

  #groupCells(array) {
    return array.filter((item, ind, arr) => item !== 0);
  }

  #getColumn(rowsArr, columnInd) {
    const column = [];

    for (let i = 0; i < rowsArr.length; i++) {
      column.push(rowsArr[i][columnInd]);
    }

    return column;
  }

  #mergeForward(array) {
    const arr = array.concat();
    const result = [];

    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === arr[i - 1]) {
        arr[i] *= 2;
        this.#score += arr[i];
        result.push(arr[i]);

        arr.splice(arr.length - 2, 2);
      } else {
        result.push(arr.splice(i, 1)[0]);
      }
      i = arr.length;
    }

    if (result.length < 4) {
      for (let j = result.length; j < 4; j++) {
        result.push(0);
      }
    }

    result.reverse();

    return result;
  }

  #mergeBackward(array) {
    const arr = array.concat();
    const result = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.#score += arr[i];
        result.push(arr[i]);
        arr.splice(0, i + 2);
      } else {
        result.push(arr.splice(0, 1)[0]);
      }
      i -= 1;
    }

    if (result.length < 4) {
      for (let j = result.length; j < 4; j++) {
        result.push(0);
      }
    }

    return result;
  }

  #isArraysEqual(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
  }

  #getMaxValue(field) {
    return Math.max(...field.flat());
  }

  #isMovePossible(field) {
    if (field.flat().includes(0)) {
      return true;
    }

    for (let i = 0; i < field.length; i++) {
      const row = field[i];
      const column = this.#getColumn(field, i);

      if (this.#hasEqualPair(row) || this.#hasEqualPair(column)) {
        return true;
      }
    }

    return false;
  }

  #hasEqualPair(arr) {
    return arr.some(
      (item, index, array) => index !== 0 && item === arr[index - 1],
    );
  }

  #updateStatus() {
    if (
      this.#isArraysEqual(this.initialState.flat(), this.state.flat()) &&
      this.#isMovePossible(this.state) &&
      this.#getMaxValue(this.state) < 2048
    ) {
      this.#gameStatus = 'idle';
    } else if (this.#getMaxValue(this.state) >= 2048) {
      this.#gameStatus = 'win';
    } else if (
      !this.#isMovePossible(this.state) &&
      this.#getMaxValue(this.state) < 2048
    ) {
      this.#gameStatus = 'lose';
    } else {
      this.#gameStatus = 'playing';
    }

    return this.#gameStatus;
  }
}

module.exports = Game;
