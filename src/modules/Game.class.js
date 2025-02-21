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
    this.initialState = initialState;

    if (!initialState) {
      this.initialState = Array.from({ length: 4 }, () => Array(4).fill(0));
    }

    this.state = structuredClone(this.initialState);
  }

  moveLeft() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state.length; j++) {
        if (this.state[i][j] !== 0) {
          this.moveCellLeft(i, j);
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state.length; j++) {
        if (j !== 3 && this.state[i][j] === this.state[i][j + 1]) {
          this.sumCells(i, j, i, j + 1);
        }
      }
    }
  }

  moveRight() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = this.state.length - 1; j >= 0; j--) {
        if (this.state[i][j] !== 0) {
          this.moveCellRight(i, j);
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = this.state.length - 1; j >= 0; j--) {
        if (j !== 0 && this.state[i][j] === this.state[i][j - 1]) {
          this.sumCells(i, j, i, j - 1);
        }
      }
    }
  }

  moveUp() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state.length; j++) {
        if (this.state[i][j] !== 0) {
          this.moveCellUp(i, j);
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state.length; j++) {
        if (i !== 3 && this.state[i][j] === this.state[i + 1][j]) {
          this.sumCells(i, j, i + 1, j);
        }
      }
    }
  }

  moveDown() {
    for (let i = this.state.length - 1; i >= 0; i--) {
      for (let j = 0; j < this.state.length; j++) {
        if (this.state[i][j] !== 0) {
          this.moveCellDown(i, j);
        }
      }
    }

    for (let i = this.state.length - 1; i >= 0; i--) {
      for (let j = 0; j < this.state.length; j++) {
        if (i !== 0 && this.state[i][j] === this.state[i - 1][j]) {
          this.sumCells(i, j, i - 1, j);
        }
      }
    }
  }

  moveCellUp(row, column) {
    let r = row;

    while (r !== 0 && this.state[r - 1][column] === 0) {
      this.state[r - 1][column] = this.state[r][column];
      this.state[r][column] = 0;
      r--;
    }
  }

  moveCellDown(row, column) {
    let r = row;

    while (r !== 3 && this.state[r + 1][column] === 0) {
      this.state[r + 1][column] = this.state[r][column];
      this.state[r][column] = 0;
      r++;
    }
  }

  moveCellLeft(row, column) {
    let c = column;

    while (c !== 0 && this.state[row][c - 1] === 0) {
      this.state[row][c - 1] = this.state[row][c];
      this.state[row][c] = 0;
      c--;
    }
  }

  moveCellRight(row, column) {
    let c = column;

    while (c !== 3 && this.state[row][c + 1] === 0) {
      this.state[row][c + 1] = this.state[row][c];
      this.state[row][c] = 0;
      c++;
    }
  }

  sumCells(rToSum, cToSum, rToClear, cToClear) {
    this.state[rToSum][cToSum] += this.state[rToClear][cToClear];
    this.state[rToClear][cToClear] = 0;
  }

  /**
   * @returns {number}
   */
  getScore() {
    let score = 0;

    for (const item of this.state) {
      score += item.reduce((prev, num) => prev + num, 0);
    }

    return score;
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
    // const score = this.getScore();

    if (this.state === this.initialState) {
      return 'idle';
    }

    for (const item of this.state) {
      for (const i of item) {
        if (i === 2048) {
          return 'win';
        }
      }
    }

    for (const item of this.state) {
      for (const i of item) {
        if (i === 0) {
          return 'playing';
        }
      }
    }
    // TODO: add check for similar cells

    return 'lose';
  }

  /**
   * Starts the game.
   */
  start() {
    const row1 = Math.floor(Math.random() * 4);
    const column1 = Math.floor(Math.random() * 4);
    const row2 = Math.floor(Math.random() * 4);
    const column2 = Math.floor(Math.random() * 4);

    this.state[row1][column1] = 2;
    this.state[row2][column2] = 2;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = structuredClone(this.initialState);
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
