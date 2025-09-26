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
    this.board = initialState || this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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
    return this.board;
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    this.lastSpawned = { row, col };
  }
  compress(row) {
    const filtered = row.filter((v) => v !== 0);

    while (filtered.length < this.size) {
      filtered.push(0);
    }

    return filtered;
  }
  merge(row, coordMapper) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;

        if (row[i] > this.score) {
          this.score = row[i];
        }
        row[i + 1] = 0;

        if (!this.mergedPositions) {
          this.mergedPositions = [];
        }
        this.mergedPositions.push(coordMapper(i));
      }
    }

    return row;
  }
  operate(row, coordMapper) {
    let r = this.compress(row);

    r = this.merge(r, coordMapper);
    r = this.compress(r);

    return r;
  }

  moveLeft() {
    let changed = false;

    for (let r = 0; r < this.size; r++) {
      const newRow = this.operate(this.board[r], (i) => ({ row: r, col: i }));

      if (newRow.toString() !== this.board[r].toString()) {
        changed = true;
      }
      this.board[r] = newRow;
    }

    if (changed) {
      this.addRandomTile();
    }
  }
  moveRight() {
    let changed = false;

    for (let r = 0; r < this.size; r++) {
      const reversed = [...this.board[r]].reverse();
      const newRow = this.operate(reversed, (i) => ({
        row: r,
        col: this.size - 1 - i,
      })).reverse();

      if (newRow.toString() !== this.board[r].toString()) {
        changed = true;
      }
      this.board[r] = newRow;
    }

    if (changed) {
      this.addRandomTile();
    }
  }
  moveUp() {
    let changed = false;

    for (let c = 0; c < this.size; c++) {
      const col = this.board.map((row) => row[c]);
      const newCol = this.operate(col, (i) => ({ row: i, col: c }));

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          changed = true;
        }
        this.board[r][c] = newCol[r];
      }
    }

    if (changed) {
      this.addRandomTile();
    }
  }
  moveDown() {
    let changed = false;

    for (let c = 0; c < this.size; c++) {
      const col = this.board.map((row) => row[c]).reverse();
      const newCol = this.operate(col, (i) => ({
        row: this.size - 1 - i,
        col: c,
      })).reverse();

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          changed = true;
        }
        this.board[r][c] = newCol[r];
      }
    }

    if (changed) {
      this.addRandomTile();
    }
  }

  isMovePossible() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  isWin() {
    if (this.score === 2048) {
      this.status = 'win';
    }
  }
}

export default Game;
