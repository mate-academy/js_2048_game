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

  constructor(initialState = Game.deafultInitialState) {
    this.state = initialState.map((arr) => [...arr]);
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    const mergedCellsIndexes = new Set();

    this.state.forEach((arr) => {
      const emptyIndexes = [];

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
          emptyIndexes.push(i);
          continue;
        }

        let cellIndex = i;

        if (emptyIndexes.length) {
          cellIndex = emptyIndexes.shift();

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
        }
      }
    });

    this.#addNumber();
  }
  moveRight() {
    this.#reverse();
    this.moveLeft();
    this.#reverse();
  }
  moveUp() {
    this.#rotate();
    this.moveLeft();
    this.#rotate();
  }
  moveDown() {
    this.#rotate();
    this.moveRight();
    this.#rotate();
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
    return this.state.map((arr) => [...arr]);
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
    this.#status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#clearState();
    this.start();
  }

  // Add your own methods here
  #addNumber() {
    const number = Math.random() > 0.1 ? 2 : 4;
    const emptyFields = this.#findEmptyFields();

    if (!emptyFields.length) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyFields.length);
    const { x, y } = emptyFields[randomIndex];

    this.state[y][x] = number;

    return true;
  }

  #findEmptyFields() {
    const result = [];

    this.state.forEach((arr, y) => {
      arr.forEach((cell, x) => {
        if (cell === 0) {
          result.push({ x, y });
        }
      });
    });

    return result;
  }

  #clearState() {
    this.state = this.state.map((arr) => new Array(arr.length).fill(0));
  }

  #reverse() {
    this.state.forEach((arr) => arr.reverse());
  }

  #rotate() {
    this.state = this.state.map((arr, j) => {
      const newArr = [];

      for (let i = 0; i < arr.length; i++) {
        newArr.push(this.state[i][j]);
      }

      return newArr;
    });
  }
}

module.exports = Game;
