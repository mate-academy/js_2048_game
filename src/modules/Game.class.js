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
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);

    this.board = this.board.map((row) => this.moveRow(row, 'left'));

    if (!this.checkBords(prevBoard, this.board)) {
      this.generateRandomCells();
    }
    this.checkGameStatus();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);

    this.board = this.board.map((row) => this.moveRow(row, 'right'));

    if (!this.checkBords(prevBoard, this.board)) {
      this.generateRandomCells();
    }
    this.checkGameStatus();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);

    this.board = this.flipMatrix(this.board);
    this.moveLeft();
    this.board = this.flipMatrix(this.board);

    if (!this.checkBords(prevBoard, this.board)) {
      this.checkGameStatus();
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);

    this.board = this.flipMatrix(this.board);
    this.moveRight();
    this.board = this.flipMatrix(this.board);

    if (!this.checkBords(prevBoard, this.board)) {
      this.checkGameStatus();
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
    this.generateRandomCells();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.score = 0;
  }

  /**
   * Create empty board.
   */
  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  /**
   * Generate random cells.
   */
  generateRandomCells() {
    const cells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          cells.push({ row, col });
        }
      }
    }

    if (cells.length > 0) {
      const { row, col } = cells[Math.floor(Math.random() * cells.length)];

      this.board[row][col] = Math.random() < 0.5 ? 2 : 4;
    }
  }
  /**
   * Check game status.
   */
  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.checkSpace()) {
      this.status = 'lose';
    }
  }

  /**
   * Check can we move.
   */
  checkSpace() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Move row.
   */
  moveRow(row, direction) {
    const filteredRow = row.filter((cell) => cell !== 0);

    if (direction === 'left') {
      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow[i + 1] = 0;
        }
      }
    }

    if (direction === 'right') {
      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow[i - 1] = 0;
        }
      }
    }

    const mergedRow = filteredRow.filter((cell) => cell !== 0);

    if (direction === 'left') {
      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }
    }

    if (direction === 'right') {
      while (mergedRow.length < 4) {
        mergedRow.unshift(0);
      }
    }

    return mergedRow;
  }

  /**
   * Check boars are equal.
   */
  checkBords(board1, board2) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board1[row][col] !== board2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  flipMatrix(matrix) {
    return matrix[0].map((val, colIndex) => matrix.map((row) => row[colIndex]));
  }
}

module.exports = Game;
