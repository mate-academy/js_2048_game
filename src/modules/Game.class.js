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
   */

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  /**
   * Returns the current game board state.
   * @returns {number[][]}
   */

  getState() {
    return this.board;
  }

  /**
   * Returns the current game score.
   * @returns {number}
   */

  getScore() {
    return this.score;
  }

  /**
   * Returns the current game status.
   * @returns {string}
   */

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
    this.resetBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  moveLeft() {
    this.move(
      (row) => row,
      (row) => row,
    );
  }

  moveRight() {
    this.move(
      (row) => row.reverse(),
      (row) => row.reverse(),
    );
  }

  moveUp() {
    this.moveTranspose(
      (row) => row,
      (row) => row,
    );
  }

  moveDown() {
    this.moveTranspose(
      (row) => row.reverse(),
      (row) => row.reverse(),
    );
  }

  resetBoard() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push([i, j]);
        }
      });
    });

    if (emptyCells.length > 0) {
      const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  /**
   * Moves and merges the tiles.
   * @param {Function} processRow
   * @param {Function} unprocessRow
   */

  move(processRow, unprocessRow) {
    let moved = false;
    const newBoard = this.board.map((row, rowIndex) => {
      const processedRow = processRow([...row]);
      const mergedRow = this.mergeRow(processedRow);

      if (!this.rowsEqual(processedRow, mergedRow)) {
        moved = true;
      }

      return unprocessRow(mergedRow);
    });

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
    }
    this.updateStatus();
  }

  /**
   * Moves tiles along a transposed version of the board.
   * @param {Function} processRow
   * @param {Function} unprocessRow
   */

  moveTranspose(processRow, unprocessRow) {
    this.board = this.transpose(this.board);

    this.move(processRow, unprocessRow);

    this.board = this.transpose(this.board);
  }

  /**
   * Merges a single row and returns the new row.
   * @param {number[]} row
   * @returns {number[]}
   */
  mergeRow(row) {
    const merged = [];
    let skip = false;

    for (let i = 0; i < row.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (row[i] !== 0 && row[i] === row[i + 1]) {
        merged.push(row[i] * 2);
        this.score += row[i] * 2;
        skip = true;
      } else if (row[i] !== 0) {
        merged.push(row[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  /**
   * Transposes a 2D array (flips rows and columns).
   * @param {number[][]} matrix
   * @returns {number[][]}
   */
  transpose(matrix) {
    return matrix[0].map((rowIndex, colIndex) =>
      matrix.map((row) => row[colIndex]),);
  }

  /**
   * Checks if two rows are equal.
   * @param {number[]} row1
   * @param {number[]} row2
   * @returns {boolean}
   */
  rowsEqual(row1, row2) {
    return row1.every((value, index) => value === row2[index]);
  }

  /**
   * Updates the game status (playing, win, lose).
   */
  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.board.flat().includes(0) && !this.canMakeMove()) {
      this.status = 'lose';
    }
  }

  /**
   * Checks if any move is possible.
   * @returns {boolean}
   */
  canMakeMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i > 0 && this.board[i][j] === this.board[i - 1][j]) ||
          (j > 0 && this.board[i][j] === this.board[i][j - 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
