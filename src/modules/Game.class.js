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
  //   [0, 16, 0, 8],
  //       [8, 0, 16, 0],
  //       [0, 8, 0, 32],
  //       [32, 0, 8, 0],
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

  checkVictory() {
    const isVictory = !!this.initialState.flat().find((item) => item === 2048);

    if (isVictory) {
      this.status = 'win';
    }
  }
// начало
  checkLose() {
    const canMove = this.canMoveLeft() && this.canMoveRight() && this.canMoveUp() && this.canMoveDown();
    if (!canMove) {
      this.status = 'lose';
    }
  }

  canMoveLeft() {
    for (let row = 0; row < this.count; row++) {
      for (let col = 1; col < this.count; col++) {
        if (this.initialState[row][col] !== 0) {
          if (this.initialState[row][col - 1] === 0 || this.initialState[row][col - 1] === this.initialState[row][col]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  canMoveRight() {
    for (let row = 0; row < this.count; row++) {
      for (let col = this.count - 2; col >= 0; col--) {
        if (this.initialState[row][col] !== 0) {
          if (this.initialState[row][col + 1] === 0 || this.initialState[row][col + 1] === this.initialState[row][col]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  canMoveUp() {
    for (let col = 0; col < this.count; col++) {
      for (let row = 1; row < this.count; row++) {
        if (this.initialState[row][col] !== 0) {
          if (this.initialState[row - 1][col] === 0 || this.initialState[row - 1][col] === this.initialState[row][col]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  canMoveDown() {
    for (let col = 0; col < this.count; col++) {
      for (let row = this.count - 2; row >= 0; row--) {
        if (this.initialState[row][col] !== 0) {
          if (this.initialState[row + 1][col] === 0 || this.initialState[row + 1][col] === this.initialState[row][col]) {
            return true;
          }
        }
      }
    }
    return false;
  }
// конец

  moveLeft() {
    if (!this.isStatusPlaying()) {
      return;
    }
    let isUpdated = false;
    for (let row = 0; row < this.count; row++) {
      for (let col = 0; col < this.count; col++) {
        for (let innerColumn = col + 1; innerColumn < this.count; innerColumn++) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[row][innerColumn];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[row][innerColumn] = 0;
            isUpdated = true
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            const mergedValue = currentItem * 2;
            this.initialState[row][col] = mergedValue;
            this.initialState[row][innerColumn] = 0;
            this.score += mergedValue;
            isUpdated = true
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

    if (isUpdated) {
      this.transposeState();
      this.checkVictory();
    }
    this.checkLose()
  }
  moveRight() {
    if (!this.isStatusPlaying()) {
      return;
    }

    let isUpdated = false;

    for (let row = 0; row < this.count; row++) {
      for (let col = this.count - 1; col >= 0; col--) {
        for (let innerColumn = col - 1; innerColumn >= 0; innerColumn--) {

          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[row][innerColumn];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[row][innerColumn] = 0;
            isUpdated = true;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            const mergedValue = currentItem * 2;
            this.initialState[row][col] = mergedValue;
            this.initialState[row][innerColumn] = 0;
            this.score += mergedValue;
            isUpdated = true;
            break;
          }

          if (currentItem !== 0 && nextItem === 0) {
            break;
          }


          if (currentItem !== 0 && nextItem !== currentItem) {
            break;
          }
        }
      }
    }

    if (isUpdated) {
      this.transposeState();
      this.checkVictory();
    }
    this.checkLose()
  }
  moveUp() {
    if (!this.isStatusPlaying()) {
      return;
    }

    let isUpdated = false;

    for (let col = 0; col < this.count; col++) {
      for (let row = 0; row < this.count; row++) {
        for (let innerRow = row + 1; innerRow < this.count; innerRow++) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[innerRow][col];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[innerRow][col] = 0;
            isUpdated = true;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            const mergedValue = currentItem * 2;
            this.initialState[row][col] = mergedValue;
            this.initialState[innerRow][col] = 0;
            this.score += mergedValue;
            isUpdated = true;
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

    if (isUpdated) {
      this.transposeState();
      this.checkVictory();
    }
    this.checkLose()
  }
  moveDown() {
    if (!this.isStatusPlaying()) {
      return;
    }
    let isUpdated = false;

    for (let col = 0; col < this.count; col++) {
      for (let row = this.count - 1; row >= 0; row--) {
        for (let innerRow = row - 1; innerRow >= 0; innerRow--) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[innerRow][col];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[innerRow][col] = 0;
            isUpdated = true;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            const mergedValue = currentItem * 2;
            this.initialState[row][col] = mergedValue;
            this.initialState[innerRow][col] = 0;
            this.score += mergedValue;
            isUpdated = true;
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
    if (isUpdated) {
      this.transposeState();
      this.checkVictory();
    }
    this.checkLose()
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
    if (this.status === 'playing') {
      return;
    }
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
