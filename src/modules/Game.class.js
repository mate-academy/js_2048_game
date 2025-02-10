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
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  isGameOver() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < this.size - 1; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        if (
          this.board[row][col] === this.board[row][col + 1] ||
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  checkWin() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      let newRow = this.board[row].filter((val) => val !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
          moved = true;
        }
      }

      newRow = newRow.filter((val) => val !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (JSON.stringify(this.board[row]) !== JSON.stringify(newRow)) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.isGameOver()) {
      this.status = 'lose';
    } else if (this.checkWin()) {
      this.status = 'win';
    }
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      let newRow = this.board[row].filter((val) => val !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i - 1] = 0;
          moved = true;
        }
      }

      newRow = newRow.filter((val) => val !== 0);

      while (newRow.length < this.size) {
        newRow.unshift(0);
      }

      if (JSON.stringify(this.board[row]) !== JSON.stringify(newRow)) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.isGameOver()) {
      this.status = 'lose';
    } else if (this.checkWin()) {
      this.status = 'win';
    }
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < this.size; col++) {
      let column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      column = column.filter((value) => value !== 0);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          moved = true;
        }
      }

      column = column.filter((value) => value !== 0);

      while (column.length < this.size) {
        column.push(0);
      }

      if (moved) {
        moved = true;
      }

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = column[row];
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.isGameOver()) {
      this.status = 'lose';
    } else if (this.checkWin()) {
      this.status = 'win';
    }
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < this.size; col++) {
      let column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      column = column.filter((value) => value !== 0);

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          column[i - 1] = 0;
          this.score += column[i];
          moved = true;
        }
      }

      column = column.filter((value) => value !== 0);

      while (column.length < this.size) {
        column.unshift(0);
      }

      if (moved) {
        moved = true;
      }

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = column[row];
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.isGameOver()) {
      this.status = 'lose';
    } else if (this.checkWin()) {
      this.status = 'win';
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
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let cell = 0; cell < this.size; cell++) {
        if (this.board[row][cell] === 0) {
          emptyCells.push({ row, cell });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, cell } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][cell] = Math.random() > 0.9 ? 4 : 2;
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.board = this.createEmptyBoard();
    this.score = 0;
  }
}

module.exports = Game;
