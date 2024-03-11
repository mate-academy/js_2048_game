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

  static get deafultSize() {
    return 4;
  }

  static get deafultInitialState() {
    return new Array(Game.deafultSize)
      .fill(null)
      .map((el) => new Array(Game.deafultSize).fill(0));
  }

  #status = 'idle';
  #score = 0;
  #isForCheck = false;
  #state;
  #initialState;

  constructor(initialState = Game.deafultInitialState, isForCheck = false) {
    this.#initialState = initialState.map((arr) => [...arr]);
    this.#applyInitialState();
    this.#isForCheck = isForCheck;
  }

  moveLeft() {
    let isStateChanged = false;

    if (this.#status !== 'playing' && !this.#isForCheck) {
      return isStateChanged;
    }

    const stateBeforeMove = this.getState();

    this.#state.forEach((arr) => {
      const mergedCellsIndexes = new Set();
      const emptyIndexes = [];

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
          emptyIndexes.push(i);
          continue;
        }

        let cellIndex = i;

        if (emptyIndexes.length) {
          cellIndex = emptyIndexes.shift();
          emptyIndexes.push(i);

          arr[cellIndex] = arr[i];
          arr[i] = 0;
        }

        const previousCellIndex = cellIndex - 1;

        if (
          previousCellIndex >= 0 &&
          arr[previousCellIndex] === arr[cellIndex] &&
          !mergedCellsIndexes.has(previousCellIndex)
        ) {
          mergedCellsIndexes.add(previousCellIndex);
          arr[previousCellIndex] *= 2;
          arr[cellIndex] = 0;
          emptyIndexes.unshift(cellIndex);
          this.#score += arr[previousCellIndex];

          if (arr[previousCellIndex] >= 2048) {
            this.#status = 'win';
          }
        }
      }
    });

    if (!this.#isSameState(stateBeforeMove)) {
      this.#addNumber();

      isStateChanged = true;
    }

    if (!this.#isForCheck && !this.#isMovePossible()) {
      this.#status = 'lose';
    }

    return isStateChanged;
  }
  moveRight() {
    this.#reverse();

    const result = this.moveLeft();

    this.#reverse();

    return result;
  }
  moveUp() {
    this.#rotate();

    const result = this.moveLeft();

    this.#rotate();

    return result;
  }
  moveDown() {
    this.#rotate();

    const result = this.moveRight();

    this.#rotate();

    return result;
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
    return this.#state.map((arr) => [...arr]);
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#addNumber();
    this.#addNumber();
    this.#status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#applyInitialState();
    this.#score = 0;
    this.#status = 'idle';
  }

  // Add your own methods here
  #applyInitialState() {
    this.#state = this.#initialState.map((arr) => [...arr]);
  }

  #isMovePossible() {
    const gameCopy = new Game(this.getState(), true);

    return (
      gameCopy.moveLeft() ||
      gameCopy.moveRight() ||
      gameCopy.moveUp() ||
      gameCopy.moveDown()
    );
  }

  #addNumber() {
    const number = Math.random() > 0.1 ? 2 : 4;
    const emptyFields = this.#findEmptyFields();

    if (!emptyFields.length) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyFields.length);
    const { x, y } = emptyFields[randomIndex];

    this.#state[y][x] = number;

    return true;
  }

  #findEmptyFields() {
    const result = [];

    this.#state.forEach((arr, y) => {
      arr.forEach((cell, x) => {
        if (cell === 0) {
          result.push({ x, y });
        }
      });
    });

    return result;
  }

  #reverse() {
    this.#state.forEach((arr) => arr.reverse());
  }

  #rotate() {
    this.#state = this.#state.map((arr, j) => {
      const newArr = [];

      for (let i = 0; i < arr.length; i++) {
        newArr.push(this.#state[i][j]);
      }

      return newArr;
    });
  }

  #isSameState(state) {
    return this.#state.every((arr, i) => {
      return arr.every((el, j) => el === state[i][j]);
    });
  }
}

module.exports = Game;
