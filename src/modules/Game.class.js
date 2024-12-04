'use strict';

class Game {
  /**
   * Creates a new game instance.
   * @param {number[][]} initialState
   */
  constructor(initialState = null) {
    this.rows = 4;
    this.columns = 4;
    this.score = 0;
    this.status = 'idle';
    this.board = initialState || this.createEmptyBoard();
  }

  /**
   * Creates an empty board.
   * @returns {number[][]}
   */
  createEmptyBoard() {
    return Array.from({ length: this.rows }, () => Array(this.columns).fill(0));
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    this.board = Array(this.rows)
      .fill()
      .map(() => Array(this.columns).fill(0));
    this.addNewNumber();
    this.addNewNumber();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
    this.score = 0;
  }

  /**
   * Returns the current score.
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * Returns the current board state.
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   * @returns {string}
   */
  getStatus() {
    return this.status;
  }

  /**
   * Adds a new number (2 or 4) to a random empty cell.
   */
  addNewNumber() {
    const emptyCells = [];

    for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
      for (let colIdx = 0; colIdx < this.columns; colIdx++) {
        if (this.board[rowIdx][colIdx] === 0) {
          emptyCells.push({ row: rowIdx, col: colIdx });
        }
      }
    }

    if (emptyCells.length === 0) {
      return; // Немає порожніх клітинок
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  /**
   * Slides and merges a row to the left.
   * @param {number[]} row
   * @returns {number[]}
   */
  slideRowLeft(row) {
    const nonZero = row.filter((num) => num !== 0);
    const merged = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        merged.push(nonZero[i] * 2);
        this.score += nonZero[i] * 2;
        i++;
      } else {
        merged.push(nonZero[i]);
      }
    }

    while (merged.length < this.columns) {
      merged.push(0);
    }

    return merged;
  }

  /**
   * Moves the board left.
   */
  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.rows; r++) {
      const originalRow = [...this.board[r]];
      const newRow = this.slideRowLeft(this.board[r]);

      if (newRow.toString() !== originalRow.toString()) {
        moved = true;
      }

      this.board[r] = newRow;
    }

    if (moved) {
      this.addNewNumber();
    }
  }

  /**
   * Moves the board right.
   */
  moveRight() {
    this.board = this.board.map((row) => {
      return this.slideRowLeft(row.reverse()).reverse();
    });

    this.addNewNumber();
  }

  /**
   * Moves the board up.
   */
  moveUp() {
    this.transposeBoard();
    this.moveLeft();
    this.transposeBoard();
  }

  /**
   * Moves the board down.
   */
  moveDown() {
    this.transposeBoard();
    this.moveRight();
    this.transposeBoard();
  }

  /**
   * Transposes the board (rows become columns and vice versa).
   */
  transposeBoard() {
    const transposed = this.createEmptyBoard();

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        transposed[c][r] = this.board[r][c];
      }
    }

    this.board = transposed;
  }

  /**
   * Checks the game status (win, lose, or continue playing).
   */
  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  /**
   * Checks if there are any valid moves left.
   * @returns {boolean}
   */
  hasMoves() {
    for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
      for (let colIdx = 0; colIdx < this.columns; colIdx++) {
        if (this.board[rowIdx][colIdx] === 0) {
          return true; // Є порожня клітинка
        }

        if (
          (colIdx < this.columns - 1 &&
            this.board[rowIdx][colIdx] === this.board[rowIdx][colIdx + 1]) ||
          (rowIdx < this.rows - 1 &&
            this.board[rowIdx][colIdx] === this.board[rowIdx + 1][colIdx])
        ) {
          return true; // Можливе злиття
        }
      }
    }

    return false;
  }
}

module.exports = Game;
