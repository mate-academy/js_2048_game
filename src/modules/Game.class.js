'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  // How many cells created in the beginning of the game
  #numOfInitialCells = 2;
  #defaultState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

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
  constructor(initialState = this.#defaultState) {
    this.initialState = initialState;
    this.state = [];
    this.score = 0;
    this.prevState = [];
    this.isChanged = false;
    this.status = `idle`;

    for (const rowArr of initialState) {
      this.state.push([...rowArr]);
    }
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

  setStatus(stat) {
    this.status = stat;
  }

  // checks if there are any duplicate values next to each other
  gameEnd() {
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 1; col < this.state[0].length; col++) {
        if (
          this.state[row][col - 1] === this.state[row][col] ||
          this.state[col - 1][row] === this.state[col][row] ||
          this.state[row][col - 1] === 0 ||
          this.state[row][col] === 0
        ) {
          return false;
        }
      }
    }
    this.setStatus('lose');

    return true;
  }

  // tracks if there are any changes in any direction
  // (if not then no need to add new value)
  // but maybe it is a loss, so check for it as well
  changes(state) {
    this.isChanged = false;

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state[0].length; col++) {
        if (this.state[row][col] !== state[row][col]) {
          this.isChanged = true;
          this.addValue();

          return this.isChanged;
        }
      }
    }

    return this.isChanged;
  }

  freeSpaceToLeft(state) {
    for (const row of state) {
      for (let i = 0; i < row.length; i++) {
        const indexOfVal = row.findIndex((el, index, array) => {
          if (array[index - 1] === 0 && el !== 0) {
            return true;
          }
        });
        const rowUpToValue = row.slice(0, indexOfVal);
        const firstEmpty = rowUpToValue.indexOf(0);

        if (firstEmpty !== -1 && indexOfVal !== -1) {
          row[firstEmpty] = row[indexOfVal];
          row[indexOfVal] = 0;
        }
      }
    }

    return state;
  }

  updateState(arr = this.state) {
    let state = this.copyState(arr);

    // clears free space up to the left
    state = this.freeSpaceToLeft(state);
    // adds same values that are close neighbours in a row
    state = this.addUp(state);
    // clears free space up to the left after adding and updates the state
    state = this.freeSpaceToLeft(state);

    return state;
  }

  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }
    this.prevState = this.copyState(this.state);
    // this.addValue();
    this.state = this.updateState();
    this.changes(this.prevState);
    this.gameEnd();
  }

  moveRight(arr = this.state) {
    if (this.getStatus() !== 'playing') {
      return;
    }

    // check if moveRight was called by moveDown
    let isCb = true;

    if (arr === this.state) {
      isCb = false;
      this.prevState = this.copyState(this.state);
    }

    let state = [];

    for (const row of arr) {
      state.push([...row].toReversed());
    }

    state = this.updateState(state);

    this.state = [];

    for (const row of state) {
      this.state.push([...row].toReversed());
    }

    if (!isCb) {
      this.changes(this.prevState);
      this.gameEnd();
    }

    return this.state;
  }

  // creates a state where columns become rows and vice versa
  transposeMatrix(initial = this.state) {
    const transposed = this.copyState(initial);

    for (let row = 0; row < initial.length; row++) {
      for (let col = 0; col < initial[0].length; col++) {
        transposed[col][row] = initial[row][col];
      }
    }

    return transposed;
  }

  moveUp() {
    this.upOrDown(this.updateState);
  }

  moveDown() {
    this.upOrDown(this.moveRight);
  }

  // helper function to avoid duplication
  upOrDown(callback) {
    if (this.getStatus() !== 'playing') {
      return;
    }

    this.prevState = this.copyState(this.state);

    let state = this.transposeMatrix();

    // Call the callback function with the `state`
    state = callback.call(this, state);

    this.state = this.transposeMatrix(state);
    this.changes(this.prevState);
    this.gameEnd();
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
   * Starts the game.
   */
  start() {
    // change status of the game to playing;
    this.setStatus('playing');
    // no need to add values at the start if the values are correct
    // (add 'return' if this.validateInitialState() is true)

    this.validateInitialState();

    // Choose randomly what two columns and rows get initial values of 2/4;
    for (let j = 0; j < this.#numOfInitialCells; j++) {
      this.addValue();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.copyState();
    this.setStatus('idle');
    this.score = 0;

    // this.start();
  }

  // Creates 2-level deep copy for an array
  copyState(initState = this.initialState) {
    const resetArr = [];

    for (const rowArr of initState) {
      resetArr.push([...rowArr]);
    }

    return resetArr;
  }

  // add new value to the game randomly
  addValue() {
    // in case of an infinite loop
    let attempt = 0;

    for (let i = 0; i < 1; i++) {
      const col = Math.floor(Math.random() * this.state.length);
      const row = Math.floor(Math.random() * this.state[0].length);
      const value = Math.random() < 0.9 ? 2 : 4;

      // in case of an infinite loop
      if (attempt++ > 1000) {
        break;
      }

      if (this.state[row][col] !== 0) {
        i--;
        continue;
      }

      this.state[row][col] = value;
    }
  }

  // add up all possible siblings with the same values
  addUp(state) {
    for (const row of state) {
      for (let i = 1; i < row.length; i++) {
        if (row[i - 1] === row[i]) {
          row[i - 1] = row[i - 1] + row[i];
          this.score += row[i - 1];
          row[i] = 0;

          if (row[i - 1] >= 2048) {
            this.setStatus('win');
          }
        }
      }
    }

    return state;
  }

  // in case a user provided initial state of the game
  // validate custom initial state
  validateInitialState() {
    let sum = 0;
    // if the user added incorrect value then the game starts with default;

    for (const row of this.state) {
      for (const cell of row) {
        if (cell % 2 !== 0 || cell > 2048 || cell < 0) {
          this.state = this.copyState(this.#defaultState);

          return false;
        }
      }

      sum += row.reduce((acc, curr) => acc + curr);
    }

    // if sum > 0 then all validation is passed successfully
    // hence the initial state is custom
    // else it will be default (see this.start() if/else statement)
    return sum !== 0;
  }
}

module.exports = Game;
