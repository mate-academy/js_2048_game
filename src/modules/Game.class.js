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
    console.log(initialState);

    this.size = 4;
    this.initialState = initialState;
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const newBoard = [];

    for (const row of this.board) {
      const newRow = this.slideAndMergeRow(row);

      newBoard.push(newRow);

      if (JSON.stringify(newRow) !== JSON.stringify(row)) {
        moved = true;
      }
    }

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const newBoard = [];

    for (const row of this.board) {
      const reversed = [...row].reverse();
      const newRow = this.slideAndMergeRow(reversed).reverse();

      if (JSON.stringify(newRow) !== JSON.stringify(row)) {
        moved = true;
      }
      newBoard.push(newRow);
    }

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.transpose();

    let moved = false;
    const newBoard = [];

    for (const row of this.board) {
      const newRow = this.slideAndMergeRow(row);

      if (JSON.stringify(newRow) !== JSON.stringify(row)) {
        moved = true;
      }
      newBoard.push(newRow);
    }

    if (moved) {
      this.board = newBoard;
      this.transpose();
      this.addRandomTile();
      this.checkGameStatus();
    } else {
      this.transpose();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.transpose();

    let moved = false;
    const newBoard = [];

    for (const row of this.board) {
      const reversed = [...row].reverse();
      const newRow = this.slideAndMergeRow(reversed).reverse();

      if (JSON.stringify(newRow) !== JSON.stringify(row)) {
        moved = true;
      }
      newBoard.push(newRow);
    }

    if (moved) {
      this.board = newBoard;
      this.transpose();
      this.addRandomTile();
      this.checkGameStatus();
    } else {
      this.transpose();
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
    this.board = this.initialState
      ? this.cloneBoard(this.initialState)
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState
      ? this.cloneBoard(this.initialState)
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  slideAndMergeRow(row) {
    const filtered = row.filter((val) => val !== 0);
    const merged = [];
    let i = 0;

    while (i < filtered.length) {
      if (filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;

        this.score += value;
        merged.push(value);
        i += 2;
      } else {
        merged.push(filtered[i]);
        i += 1;
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  transpose() {
    const newBoard = this.createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        newBoard[c][r] = this.board[r][c];
      }
    }
    this.board = newBoard;
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
  }

  checkGameStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  hasMoves() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (val === 0) {
          return true;
        }

        if (r < this.size - 1 && val === this.board[r + 1][c]) {
          return true;
        }

        if (c < this.size - 1 && val === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
