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
  constructor(initialState) {
    // eslint-disable-next-line no-console

    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  hasElement(element) {
    return this.initialState.some((row) => row.some((num) => num === element));
  }

  generateRandomNumber() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  fillEmptyCell() {
    const row = Math.floor(Math.random() * 4);
    const cell = Math.floor(Math.random() * 4);

    if (this.hasElement(0)) {
      if (this.initialState[row][cell] === 0) {
        this.initialState[row][cell] = this.generateRandomNumber();
      } else {
        this.fillEmptyCell();
      }
    }
  }

  addZerosToEnd(arr) {
    return arr.map((row) => {
      const numZeros = 4 - row.length;

      return row.concat(Array(numZeros).fill(0));
    });
  }

  removeZeros(arr) {
    return arr.map((row) => row.filter((num) => num !== 0));
  }

  mirrorArrVertycally(arr) {
    return arr.map((row) => row.reverse());
  }

  mirrorArrHorizontally(arr) {
    return arr.reverse();
  }

  rotateArr90CounterClockwise(arr) {
    const rotated = arr.map((row) => row.reverse());
    const transposed = rotated[0].map((_, colIndex) => {
      return rotated.map((row) => row[colIndex]);
    });

    return transposed;
  }

  rotateArr90Clockwise(arr) {
    const transposed = arr[0].map((_, colIndex) => {
      return arr.map((row) => row[colIndex]);
    });

    const rotated = transposed.map((row) => row.reverse());

    return rotated;
  }

  moveLeft() {
    let newState = this.removeZeros([...this.initialState]);

    const row = newState.length;

    for (let i = 0; i < row; i++) {
      for (let j = 0; j <= newState[i].length - 1; j++) {
        if (newState[i][j - 1] === 0 || newState[i][j - 1] === newState[i][j]) {
          newState[i][j - 1] += newState[i][j];
          this.score += newState[i][j];
          newState[i][j] = 0;
        }
      }
    }

    newState = this.addZerosToEnd(newState);

    this.initialState = newState;
    this.fillEmptyCell();
  }
  moveRight() {
    this.initialState = this.mirrorArrVertycally(this.initialState);
    this.moveLeft();
    this.initialState = this.mirrorArrVertycally(this.initialState);
  }
  moveUp() {
    this.initialState = this.rotateArr90CounterClockwise(this.initialState);
    this.moveLeft();
    this.initialState = this.rotateArr90Clockwise(this.initialState);
  }
  moveDown() {
    this.initialState = this.mirrorArrHorizontally(this.initialState);
    this.moveUp();
    this.initialState = this.mirrorArrHorizontally(this.initialState);
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.initialState;
  }

  setState() {}

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
    if (this.hasElement(0)) {
      return 'playing';
    } else if (!this.hasElement(0)) {
      return 'lose';
    } else if (this.hasElement(2048)) {
      return 'win';
    }

    return 'idle';
  }

  /**
   * Starts the game.
   */
  start() {
    this.fillEmptyCell();
    this.fillEmptyCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.fillEmptyCell();
    this.fillEmptyCell();
  }

  // Add your own methods here
}

module.exports = Game;
