'use strict';

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
  constructor(initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]) {
    this.state = initialState;
    this.initialState = initialState.map(row => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  randomNum() {
    const keys = Object
      .entries(this.state.flat())
      .filter(([, value]) => value === 0)
      .map(([key]) => key);

    if (keys.length === 0) {
      return;
    }

    const index = keys[Math.floor(Math.random() * keys.length)];
    const rowKey = Math.floor(index / this.state.length);
    const columnKey = index % this.state.length;
    const num = Math.random() >= 0.9 ? 4 : 2;

    this.state[rowKey][columnKey] = num;
  }
  mergeArr(arr, inverse = false) {
    if (inverse) {
      for (let i = arr.length - 1; i > 0; i--) {
        if (arr[i] !== 0) {
          for (let j = i - 1; j >= 0; j--) {
            if (arr[i] === arr[j]) {
              arr[i] *= 2;
              arr[j] = 0;
              this.score += arr[i];

              break;
            } else if (arr[i] !== arr[j] && arr[j]) {
              break;
            }
          }
        }
      }

      for (let i = arr.length - 1; i > 0; i--) {
        if (arr[i] === 0) {
          for (let j = i - 1; j >= 0; j--) {
            if (arr[j] !== 0) {
              arr[i] = arr[j];
              arr[j] = 0;
              break;
            }
          }
        }
      }
    } else {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] !== 0) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
              arr[i] *= 2;
              arr[j] = 0;
              this.score += arr[i];

              break;
            } else if (arr[i] !== arr[j] && arr[j]) {
              break;
            }
          }
        }
      }

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] !== 0) {
              arr[i] = arr[j];
              arr[j] = 0;
              break;
            }
          }
        }
      }
    }
  }
  mergeColumn(index, inverse = false) {
    const column = this.state.map(row => row[index]);

    this.mergeArr(column, inverse);

    this.state.forEach((row, rowIndex) => {
      row[index] = column[rowIndex];
    });
  }
  mergeRow(index, inverse = false) {
    const row = this.state[index];

    this.mergeArr(row, inverse);
  }
  getStrState() {
    return this.getState().flat().join();
  }
  moveIfPlaying(callback) {
    if (this.status === 'playing') {
      const state = this.getStrState();

      for (let i = 0; i < this.state.length; i++) {
        callback(i);
      }

      if (state !== this.getStrState()) {
        this.randomNum();
      }
    }
  }
  moveLeft() {
    this.moveIfPlaying((i) => this.mergeRow(i));
  }
  moveRight() {
    this.moveIfPlaying((i) => this.mergeRow(i, true));
  }
  moveUp() {
    this.moveIfPlaying((i) => this.mergeColumn(i));
  }
  moveDown() {
    this.moveIfPlaying((i) => this.mergeColumn(i, true));
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
    if (this.status === 'idle') {
      return 'idle';
    }

    if (this.state.flat().findIndex(el => el === 2048) !== -1) {
      return 'win';
    }

    const copy = new Game(this.state.map(row => row.map(cell => cell)));

    copy.status = 'playing';
    copy.moveDown();
    copy.moveLeft();
    copy.moveRight();
    copy.moveUp();

    if (copy.getScore() === 0) {
      return 'lose';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.randomNum();
    this.randomNum();

    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState;

    this.score = 0;

    this.status = 'idle';
    // this.start();
  }
}

module.exports = Game;
