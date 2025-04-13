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
    this.board = initialState || this.generateEmptyBoard();
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
  }

  generateEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
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

    if (emptyCells.length > 0) {
      const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((cell) => cell !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
          newRow.push(0);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== newRow[col]) {
          moved = true;
          break;
        }
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameOver();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((cell) => cell !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i - 1, 1);
          newRow.unshift(0);
        }
      }

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== newRow[col]) {
          moved = true;
          break;
        }
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameOver();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol.splice(i + 1, 1);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          moved = true;
        }
        this.board[row][col] = newCol[row];
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameOver();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = newCol.length - 1; i > 0; i--) {
        if (newCol[i] === newCol[i - 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol.splice(i - 1, 1);
          newCol.unshift(0);
        }
      }

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          moved = true;
        }
        this.board[row][col] = newCol[row];
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameOver();
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
   * idle - the game has not started yet (the initial state);
   * playing - the game is in progress;
   * win - the game is won;
   * lose - the game is lost
   */

  checkGameOver() {
    if (this.isWin()) {
      this.status = 'win';
    } else if (this.isLose()) {
      this.status = 'lose';
    }
  }

  isWin() {
    for (const i of this.board) {
      if (i.includes(2048)) {
        return true;
      }
    }

    return false;
  }

  isLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }

  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (
      this.status === 'idle' ||
      this.status === 'lose' ||
      this.status === 'win'
    ) {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.board = this.generateEmptyBoard();
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
