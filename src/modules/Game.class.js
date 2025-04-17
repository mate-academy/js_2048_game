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
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : null;

    if (this.initialState) {
      this.board = this.initialState.map((row) => [...row]);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;

    for (let i = 0; i < 4; i++) {
      const origRow = [...this.board[i]];
      const newRow = this.MergeOrigRow(origRow);

      if (!this.ArraysEqual(origRow, newRow)) {
        this.board[i] = newRow;
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addRandomTile();
      this.CheckGameStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;

    for (let i = 0; i < 4; i++) {
      const origRow = [...this.board[i]];
      const reversed = origRow.slice().reverse();
      const newRow = this.MergeOrigRow(reversed).reverse();

      if (!this.ArraysEqual(origRow, newRow)) {
        this.board[i] = newRow;
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addRandomTile();
      this.CheckGameStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const newCol = this.MergeOrigRow(column);

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];
          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.addRandomTile();
      this.CheckGameStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const reversed = column.slice().reverse();
      const newCol = this.MergeOrigRow(reversed).reverse();

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];
          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.addRandomTile();
      this.CheckGameStatus();
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
    return this.board.map((row) => [...row]);
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart(initialState = this.initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : null;

    if (this.initialState) {
      this.board = this.initialState.map((row) => [...row]);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  addRandomTile() {
    const emptCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptCells.push({ x: i, y: j });
        }
      }
    }

    if (emptCells.length > 0) {
      const { x, y } = emptCells[Math.floor(Math.random() * emptCells.length)];

      this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  MergeOrigRow(row) {
    const newRow = [...row];

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1] && newRow[i] !== 0) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    const merged = newRow.filter((n) => n !== 0);

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  CheckGameStatus() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (const row of this.board) {
      if (row.includes(0)) {
        return;
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  ArraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }
}

module.exports = Game;
