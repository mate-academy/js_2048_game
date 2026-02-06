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
    this.size = 4;

    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));

    this.board = this.initialState.map((row) => [...row]);
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  slideAndMerge(row) {
    const arr = row.filter((x) => x !== 0);
    const result = [];

    for (let i = 0; i < arr.length; i++) {
      if (i < arr.length - 1 && arr[i] === arr[i + 1]) {
        const newValue = arr[i] * 2;

        result.push(newValue);
        this.score += newValue;
        i++;
      } else {
        result.push(arr[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return result;
  }

  moveLeft(addTile = true) {
    if (this.status !== 'playing') {
      return false;
    }

    const old = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.slideAndMerge(this.board[i]);
    }

    if (old !== JSON.stringify(this.board)) {
      if (addTile) {
        this.addRandomTile();
      }
      this.checkStatus();

      return true;
    }

    return false;
  }

  moveRight(addTile = true) {
    if (this.status !== 'playing') {
      return false;
    }

    const old = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      let row = [...this.board[i]].reverse();

      row = this.slideAndMerge(row);
      this.board[i] = row.reverse();
    }

    if (old !== JSON.stringify(this.board)) {
      if (addTile) {
        this.addRandomTile();
      }
      this.checkStatus();

      return true;
    }

    return false;
  }

  moveUp(addTile = true) {
    if (this.status !== 'playing') {
      return false;
    }

    const old = JSON.stringify(this.board);

    for (let j = 0; j < 4; j++) {
      let col = [];

      for (let i = 0; i < 4; i++) {
        col.push(this.board[i][j]);
      }

      col = this.slideAndMerge(col);

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = col[i];
      }
    }

    if (old !== JSON.stringify(this.board)) {
      if (addTile) {
        this.addRandomTile();
      }
      this.checkStatus();

      return true;
    }

    return false;
  }

  moveDown(addTile = true) {
    if (this.status !== 'playing') {
      return false;
    }

    const old = JSON.stringify(this.board);

    for (let j = 0; j < 4; j++) {
      let col = [];

      for (let i = 0; i < 4; i++) {
        col.push(this.board[i][j]);
      }

      col.reverse();
      col = this.slideAndMerge(col);
      col.reverse();

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = col[i];
      }
    }

    if (old !== JSON.stringify(this.board)) {
      if (addTile) {
        this.addRandomTile();
      }
      this.checkStatus();

      return true;
    }

    return false;
  }

  checkStatus() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && this.board[i][j] === this.board[i + 1][j]) ||
          (j < 3 && this.board[i][j] === this.board[i][j + 1])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  /**
   *
   */

  /**
   *
   */

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

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
    this.checkStatus();
  }

  /**
   * Resets the game.
   */

  restart() {
    this.score = 0;
    this.status = 'idle';

    this.board = this.initialState.map((row) => [...row]);
  }
  // Add your own methods here
}

module.exports = Game;
