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
    this.state = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status === 'playing') {
      this.state = this.moveHorizontally(this.state, 'ArrowLeft');

      this.addTile();
      this.isGameContinue();
    }
  }
  moveRight() {
    if (this.status === 'playing') {
      this.state = this.moveHorizontally(this.state, 'ArrowRight');

      this.addTile();
      this.isGameContinue();
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      this.state = this.moveVertically(this.state, 'ArrowUp');

      this.addTile();
      this.isGameContinue();
    }
  }
  moveDown() {
    if (this.status === 'playing') {
      this.state = this.moveVertically(this.state, 'ArrowDown');

      this.addTile();
      this.isGameContinue();
    }
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
    this.addTile();
    this.addTile();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  getEmptyCells() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        if (item === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    return emptyCells;
  }

  addTile() {
    const number = Math.random() <= 0.1 ? 4 : 2;

    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const emptyCellIndex = Math.floor(Math.random() * emptyCells.length);

      const { rowIndex, colIndex } = emptyCells[emptyCellIndex];

      this.state[rowIndex][colIndex] = number;
    }
  }

  moveHorizontally(currentState, direction) {
    return currentState.map((line) => {
      let oldLine = line.filter((item) => item !== 0);

      if (direction === 'ArrowRight') {
        oldLine = oldLine.reverse();
      }

      const newLine = [];

      for (let i = 0; i < oldLine.length; i++) {
        if (oldLine[i] === oldLine[i + 1]) {
          newLine.push(oldLine[i] * 2);
          i++;

          this.score += oldLine[i] * 2;
          continue;
        }

        newLine.push(oldLine[i]);
      }

      if (newLine.length < 4) {
        do {
          newLine.push(0);
        } while (newLine.length < 4);
      }

      return direction === 'ArrowRight' ? newLine.reverse() : newLine;
    });
  }

  moveVertically(currentState, direction) {
    let newState = currentState;

    if (direction === 'ArrowDown') {
      newState = newState.reverse();
    }

    newState = newState[0].map((_, colI) => newState.map((row) => row[colI]));

    newState = this.moveHorizontally(newState, 'ArrowLeft');

    newState = newState[0].map((_, colI) => newState.map((row) => row[colI]));

    if (direction === 'ArrowDown') {
      newState = newState.reverse();
    }

    return newState;
  }

  isBoardHas2048() {
    let res = false;

    this.state.forEach((row) => {
      if (row.includes(2048)) {
        res = true;
      }
    });

    return res;
  }

  isMoveAvailable() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[0].length - 1; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < this.state[0].length; col++) {
      for (let row = 0; row < this.state.length - 1; row++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  isGameContinue() {
    if (this.isBoardHas2048()) {
      this.status = 'win';

      return false;
    }

    if (this.isMoveAvailable()) {
      return true;
    } else {
      this.status = 'lose';

      return false;
    }
  }
}

module.exports = Game;
