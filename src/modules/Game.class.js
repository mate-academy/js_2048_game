'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */


function copyState(state) {
  return state.map(row => [...row]);
}

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
  // initialStateDefault = [
  //   [0, 16, 32, 8],
  //   [0, 16, 32, 4],
  //   [8, 16, 64, 2],
  //   [8, 16, 128, 2],
  // ];
  initialStateDefault = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  count = 4;

  score = 0;
  status = 'idle';

  constructor(initialState = this.initialStateDefault) {
    this.initialState = copyState(initialState);
    this.initialStateDefault = copyState(initialState);
  }

  moveLeft() {
    if (!this.isStatusPlaying()) {
      return;
    }
    for (let row = 0; row < this.count; row++) {
      for (let col = 0; col < this.count; col++) {
        for (let innerColumn = col + 1; innerColumn < this.count; innerColumn++) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[row][innerColumn];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[row][innerColumn] = 0;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            this.initialState[row][col] = currentItem * 2;
            this.initialState[row][innerColumn] = 0;
            break;
          }


          if (currentItem !== 0 && nextItem === 0) {
            continue;
          }

          if (currentItem !== 0 && nextItem !== currentItem) {
            break;
          }
        }
      }
    }

    this.transposeState();
  }
  moveRight() {
    if (!this.isStatusPlaying()) {
      return;
    }
    for (let row = 0; row < this.count; row++) {
      for (let col = this.count - 1; col >= 0; col--) {
        for (let innerColumn = col - 1; innerColumn >= 0; innerColumn--) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[row][innerColumn];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[row][innerColumn] = 0;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            this.initialState[row][col] = currentItem * 2;
            this.initialState[row][innerColumn] = 0;
            break;
          }

          if (currentItem !== 0 && nextItem === 0) {
            continue;
          }


          if (currentItem !== 0 && nextItem !== currentItem) {
            break;
          }
        }
      }
    }

    this.transposeState();
  }
  moveUp() {
    if (!this.isStatusPlaying()) {
      return;
    }
    for (let col = 0; col < this.count; col++) {
      for (let row = 0; row < this.count; row++) {
        for (let innerRow = row + 1; innerRow < this.count; innerRow++) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[innerRow][col];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[innerRow][col] = 0;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            this.initialState[row][col] = currentItem * 2;
            this.initialState[innerRow][col] = 0;
            break;
          }

          if (currentItem !== 0 && nextItem === 0) {
            continue;
          }

          if (currentItem !== 0 && nextItem !== currentItem) {
            break;
          }
        }
      }
    }

    this.transposeState();
  }
  moveDown() {
    if (!this.isStatusPlaying()) {
      return;
    }

    for (let col = 0; col < this.count; col++) {
      for (let row = this.count - 1; row >= 0; row--) {
        for (let innerRow = row - 1; innerRow >= 0; innerRow--) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[innerRow][col];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[innerRow][col] = 0;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            this.initialState[row][col] = currentItem * 2;
            this.initialState[innerRow][col] = 0;
            break;
          }

          if (currentItem !== 0 && nextItem === 0) {
            continue;
          }

          if (currentItem !== 0 && nextItem !== currentItem) {
            break;
          }
        }
      }
    }
    this.transposeState();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  isStatusPlaying() {
    return this.status === 'playing';
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
    this.transposeState();
    this.transposeState();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.initialState = this.initialStateDefault;
    this.status = 'idle';
    this.score = 0;
  }

  // Add your own methods here

  setState() {

  }

  generateNewNumber() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  get count() {
    return this.initialState.flat().filter(n => !n).length;
  }

  getRandomNumber() {
    return Math.floor(Math.random() * this.count) + 1;
  }

  transposeState() {
    const randomNumber = this.getRandomNumber();
    let counter = 0;

    for (let col = 0; col < 4; col++) {

      for (let row = 0; row < 4; row++) {
        if (this.initialState[row][col] === 0) {
          counter++;

          const startRandomValue = counter === randomNumber
            ? this.generateNewNumber() : 0;

          this.initialState[row][col] = (startRandomValue);
          continue;
        }
        this.initialState[row][col] = (this.initialState[row][col]);
      }
    }
  }
}

module.exports = Game;
