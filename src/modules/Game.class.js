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
    // console.log(initialState);
    this.size = 4;
    this.score = 0;
    this.started = false;

    this.board =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
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
    if (!this.started) {
      return 'idle';
    }

    if (this.board.some((row) => row.includes(2048))) {
      return 'win';
    }

    if (!this.canMove()) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.started = true;

    // eslint-disable-next-line prettier/prettier
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0),
      // eslint-disable-next-line function-paren-newline
    );

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.started = false;

    // eslint-disable-next-line prettier/prettier
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0),
      // eslint-disable-next-line function-paren-newline
    );

    this.score = 0;
  }

  // Add your own metherehods

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (val === 0) {
          return true;
        }

        if (r < this.size - 1 && this.board[r + 1][c] === val) {
          return true;
        }

        if (c < this.size - 1 && this.board[r][c + 1] === val) {
          return true;
        }
      }
    }

    return false;
  }

  slideAndCombine(row) {
    const arr = row.filter((v) => v !== 0);
    const result = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === arr[i + 1]) {
        const merged = arr[i] * 2;

        result.push(merged);
        this.score += merged;
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

  moveLeft() {
    let changed = false;

    for (let r = 0; r < this.size; r++) {
      const newRow = this.slideAndCombine(this.board[r]);

      if (newRow.toString() !== this.board[r].toString()) {
        changed = true;
      }
      this.board[r] = newRow;
    }

    if (changed) {
      this.afterMove();
    }

    return changed;
  }

  moveRight() {
    let changed = false;

    for (let r = 0; r < this.size; r++) {
      const reverse = [...this.board[r]].reverse();
      const newRow = this.slideAndCombine(reverse).reverse();

      if (newRow.toString() !== this.board[r].toString()) {
        changed = true;
      }
      this.board[r] = newRow;
    }

    if (changed) {
      this.afterMove();
    }

    return changed;
  }

  moveUp() {
    let changed = false;

    for (let c = 0; c < this.size; c++) {
      const col = [];

      for (let r = 0; r < this.size; r++) {
        col.push(this.board[r][c]);
      }

      const newCol = this.slideAndCombine(col);

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          changed = true;
        }
        this.board[r][c] = newCol[r];
      }
    }

    if (changed) {
      this.afterMove();
    }

    return changed;
  }

  moveDown() {
    let changed = false;

    for (let c = 0; c < this.size; c++) {
      const col = [];

      for (let r = 0; r < this.size; r++) {
        col.push(this.board[r][c]);
      }

      const newCol = this.slideAndCombine(col.reverse()).reverse();

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          changed = true;
        }
        this.board[r][c] = newCol[r];
      }
    }

    if (changed) {
      this.afterMove();
    }

    return changed;
  }
  afterMove() {
    this.addRandomTile();
  }
}

module.exports = Game;
