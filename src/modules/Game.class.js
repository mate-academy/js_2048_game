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
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Creates an empty 4x4 board.
   *
   * @returns {number[][]} An empty 4x4 board.
   */
  createEmptyBoard() {
    return Array(4)
      .fill()
      .map(() => Array(4).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    let moved = false;
    let scoreThisMove = 0;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((val) => val !== 0);
      const mergedRow = [];

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          scoreThisMove += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      if (JSON.stringify(mergedRow) !== JSON.stringify(this.board[row])) {
        moved = true;
      }
      this.board[row] = mergedRow;
    }

    if (moved) {
      this.score += scoreThisMove;
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  moveUp() {
    this.transposeBoard();
    this.moveLeft();
    this.transposeBoard();
  }

  moveDown() {
    this.transposeBoard();
    this.moveRight();
    this.transposeBoard();
  }

  transposeBoard() {
    for (let r = 0; r < 4; r++) {
      for (let c = r + 1; c < 4; c++) {
        const temp = this.board[r][c];

        this.board[r][c] = this.board[c][r];
        this.board[c][r] = temp;
      }
    }
  }

  checkGameOver() {
    let gameOver = true;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          gameOver = false;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          gameOver = false;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          gameOver = false;
        }
      }
    }

    if (gameOver) {
      this.status = 'lose';
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  /**
   * Gets the current score of the game.
   *
   * @returns {number} The current score.
   */
  getScore() {
    return this.score;
  }

  /**
   * Gets the current state of the board.
   *
   * @returns {number[][]} The board state.
   */
  getState() {
    return this.board;
  }

  /**
   * Gets the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game by changing the status to 'playing'.
   */
  start() {
    this.status = 'playing';
  }

  /**
   * Resets the game to its initial state.
   */
  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }
}

module.exports = Game;
