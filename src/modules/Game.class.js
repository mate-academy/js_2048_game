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
    if (this.status !== 'idle' && this.status !== 'lose') {
      return; // Забороняємо перезапуск, якщо гра ще триває або вже виграна
    }

    this.status = 'playing';
    this.board = this.createEmptyBoard();
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

  setStatus(newStatus) {
    this.status = newStatus;
  }

  getStatus() {
    return this.status;
  }

  calculateBoardSum() {
    return this.board
      .flat()
      .filter(Boolean)
      .reduce((acc, val) => acc + val, 0);
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
      this.updateStatus(); // Оновлюємо статус

      return;
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
    let scoreGained = 0;

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        const mergedValue = nonZero[i] * 2;

        merged.push(mergedValue);
        scoreGained += mergedValue; // Add to score
        i++;
      } else {
        merged.push(nonZero[i]);
      }
    }

    while (merged.length < this.columns) {
      merged.push(0);
    }

    return { newRow: merged, scoreGained };
  }
  /**
   * Moves the board left.
   */
  moveLeft() {
    let moved = false;
    let totalScoreGained = 0;

    for (let r = 0; r < this.rows; r++) {
      const originalRow = [...this.board[r]];
      const { newRow, scoreGained } = this.slideRowLeft(this.board[r]);

      if (newRow.toString() !== originalRow.toString()) {
        moved = true;
      }

      this.board[r] = newRow;
      totalScoreGained += scoreGained;
    }

    if (moved) {
      this.score += totalScoreGained;
      this.addNewNumber();
    }

    return moved;
  }

  /**
   * Moves the board right.
   */
  moveRight() {
    let moved = false;
    let totalScoreGained = 0;

    this.board = this.board.map((row) => {
      const originalRow = [...row];
      const { newRow, scoreGained } = this.slideRowLeft(row.reverse());
      const reversedRow = newRow.reverse();

      if (reversedRow.toString() !== originalRow.toString()) {
        moved = true;
      }

      totalScoreGained += scoreGained;

      return reversedRow;
    });

    if (moved) {
      this.score += totalScoreGained;
      this.addNewNumber();
    }

    return moved;
  }

  /**
   * Moves the board up.
   */
  moveUp() {
    this.transposeBoard();

    const moved = this.moveLeft();

    this.transposeBoard();

    return moved;
  }

  /**
   * Moves the board down.
   */
  moveDown() {
    this.transposeBoard();

    const moved = this.moveRight();

    this.transposeBoard();

    return moved;
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
    let hasEmpty = false;
    let canMerge = false;

    for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
      for (let colIdx = 0; colIdx < this.columns; colIdx++) {
        if (this.board[rowIdx][colIdx] === 0) {
          hasEmpty = true;
        }

        if (
          (colIdx < this.columns - 1 &&
            this.board[rowIdx][colIdx] === this.board[rowIdx][colIdx + 1]) ||
          (rowIdx < this.rows - 1 &&
            this.board[rowIdx][colIdx] === this.board[rowIdx + 1][colIdx])
        ) {
          canMerge = true;
        }

        if (hasEmpty || canMerge) {
          this.status = 'playing';

          return;
        }

        if (this.board[rowIdx][colIdx] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    this.status = 'lose';
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
