'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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

    this.initialState = initialState || this._createEmptyBoard();

    this.board = initialState
      ? this._cloneBoard(initialState)
      : this._createEmptyBoard();
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  _cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  _createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  _moveRowLeft(row) {
    const filtered = row.filter((value) => value !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    const merged = filtered.filter((value) => value !== 0);

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  _moveLeft() {
    let moved = false;

    this.board = this.board.map((row) => {
      const newRow = this._moveRowLeft(row);

      if (!this._areRowsEqual(row, newRow)) {
        moved = true;
      }

      return newRow;
    });

    if (moved) {
      this._addRandomTile();

      if (this._checkLose()) {
        this.status = 'lose';
      }

      if (this._checkWin()) {
        this.status = 'win';
      }
    }
  }

  _areRowsEqual(a, b) {
    return a.every((value, index) => value === b[index]);
  }

  _reverseRows(board) {
    return board.map((row) => [...row].reverse());
  }

  _transpose(board) {
    return board[0].map((_, col) => board.map((row) => row[col]));
  }

  _checkLose() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size - 1; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }

  _checkWin() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    this._moveLeft();
  }

  moveRight() {
    this.board = this._reverseRows(this.board);
    this._moveLeft();
    this.board = this._reverseRows(this.board);
  }

  moveUp() {
    this.board = this._transpose(this.board);
    this._moveLeft();
    this.board = this._transpose(this.board);
  }
  moveDown() {
    this.board = this._transpose(this.board);
    this.board = this._reverseRows(this.board);
    this._moveLeft();
    this.board = this._reverseRows(this.board);
    this.board = this._transpose(this.board);
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
    return this._cloneBoard(this.board);
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

    this.score = 0;
    this.status = 'playing';

    this.board = this._createEmptyBoard();

    this._addRandomTile();
    this._addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.start();
  }

  // Add your own methods here
}
