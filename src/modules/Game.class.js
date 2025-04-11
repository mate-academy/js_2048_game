/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
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

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  createEmptyBoard() {
    const board = [];

    for (let i = 0; i < this.size; i++) {
      board[i] = [];

      for (let j = 0; j < this.size; j++) {
        board[i][j] = 0;
      }
    }

    return board;
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].length !== arr2[i].length) {
        return false;
      }

      for (let j = 0; j < arr1[i].length; j++) {
        if (arr1[i][j] !== arr2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map(row => [...row]);

    for (let i = 0; i < this.size; i++) {
      const row = this.board[i].filter((num) => num !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
        }
      }

      const newRow = row.filter((num) => num !== 0);

      this.board[i] = [...newRow, ...Array(this.size - newRow.length).fill(0)];
    }

    if (!this.arraysEqual(previousBoard, this.board)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkGameOver()) {
      this.status = 'lose';
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map(row => [...row]);

    for (let i = 0; i < this.size; i++) {
      this.board[i].reverse();

      const row = this.board[i].filter((num) => num !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
        }
      }

      const newRow = row.filter((num) => num !== 0);

      this.board[i] = [...newRow, ...Array(this.size - newRow.length).fill(0)];
      this.board[i].reverse();
    }

    if (!this.arraysEqual(previousBoard, this.board)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkGameOver()) {
      this.status = 'lose';
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map(row => [...row]);

    for (let i = 0; i < this.size; i++) {
      const row = this.board[i].filter((num) => num !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
        }
      }

      const newRow = row.filter((num) => num !== 0);

      this.board[i] = [...newRow, ...Array(this.size - newRow.length).fill(0)];
    }

    this.board = this.transposeBoard();

    if (!this.arraysEqual(previousBoard, this.board)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkGameOver()) {
      this.status = 'lose';
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map(row => [...row]);

    this.board = this.transposeBoard();

    for (let i = 0; i < this.size; i++) {
      this.board[i].reverse();

      const row = this.board[i].filter((num) => num !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
        }
      }

      const newRow = row.filter((num) => num !== 0);

      this.board[i] = [...newRow, ...Array(this.size - newRow.length).fill(0)];
      this.board[i].reverse();
    }

    this.board = this.transposeBoard();

    if (!this.arraysEqual(previousBoard, this.board)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkGameOver()) {
      this.status = 'lose';
    }
  }

  transposeBoard(board = this.board) {
    const transposed = [];

    for (let i = 0; i < this.size; i++) {
      transposed[i] = [];

      for (let j = 0; j < this.size; j++) {
        transposed[i][j] = board[j][i];
      }
    }

    return transposed;
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
    this.createEmptyBoard();
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }


  render(updateUI) {
    if (typeof updateUI === 'function') {
      updateUI(this.board, this.score);
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      if (!this.board[i]) {
        continue;
      }

      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { i, j } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkGameOver() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }

        if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
