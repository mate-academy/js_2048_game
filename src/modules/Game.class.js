'use strict';

class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * If passed, the board will be initialized accordingly.
   */
  constructor(initialState = Game._emptyBoard()) {
    this.board = initialState;
    this.score = 0;
    this.status = 'new'; // 'new', 'playing', 'won', 'gameover'
  }

  static _emptyBoard() {
    // Creates a 4x4 board filled with nulls (empty cells)
    return Array.from({ length: 4 }, () => Array(4).fill(null));
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  /**
   * Inserts a random tile (2 or 4) at a random empty cell.
   * 10% chance to insert a 4, otherwise a 2.
   */
  insertRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === null) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newTileValue = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = newTileValue;
  }

  /**
   * Checks whether any moves are possible.
   */
  checkGameOver() {
    // If any cell is empty, the game is not over.
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === null) {
          return false;
        }
      }
    }

    // Check horizontally for possible merges
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return false;
        }
      }
    }

    // Check vertically for possible merges
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Helper method for merging a single row.
   * Returns the new row array.
   */
  _mergeRow(row) {
    const nonEmpty = row.filter((val) => val !== null);
    const mergedRow = [];
    let i = 0;

    while (i < nonEmpty.length) {
      if (i < nonEmpty.length - 1 && nonEmpty[i] === nonEmpty[i + 1]) {
        const merged = nonEmpty[i] * 2;

        mergedRow.push(merged);
        this.score += merged;
        i += 2;
      } else {
        mergedRow.push(nonEmpty[i]);
        i++;
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(null);
    }

    return mergedRow;
  }

  moveLeft() {
    let boardChanged = false;

    for (let r = 0; r < 4; r++) {
      const oldRow = [...this.board[r]];
      const newRow = this._mergeRow(oldRow);

      if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
        boardChanged = true;
      }
      this.board[r] = newRow;
    }

    if (boardChanged) {
      this.insertRandomTile();

      if (this.checkGameOver()) {
        this.status = 'gameover';
      }
    }
  }

  moveRight() {
    let boardChanged = false;

    for (let r = 0; r < 4; r++) {
      const oldRow = [...this.board[r]];
      const reversed = [...oldRow].reverse();
      const mergedReversed = this._mergeRow(reversed);
      const newRow = mergedReversed.reverse();

      if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
        boardChanged = true;
      }
      this.board[r] = newRow;
    }

    if (boardChanged) {
      this.insertRandomTile();

      if (this.checkGameOver()) {
        this.status = 'gameover';
      }
    }
  }

  moveUp() {
    let boardChanged = false;

    for (let col = 0; col < 4; col++) {
      const oldCol = [];

      for (let row = 0; row < 4; row++) {
        oldCol.push(this.board[row][col]);
      }

      const mergedCol = this._mergeRow(oldCol);

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== mergedCol[row]) {
          boardChanged = true;
        }
        this.board[row][col] = mergedCol[row];
      }
    }

    if (boardChanged) {
      this.insertRandomTile();

      if (this.checkGameOver()) {
        this.status = 'gameover';
      }
    }
  }

  moveDown() {
    let boardChanged = false;

    for (let col = 0; col < 4; col++) {
      const oldCol = [];

      for (let row = 0; row < 4; row++) {
        oldCol.push(this.board[row][col]);
      }

      const reversed = [...oldCol].reverse();
      const mergedReversed = this._mergeRow(reversed);
      const mergedCol = mergedReversed.reverse();

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== mergedCol[row]) {
          boardChanged = true;
        }
        this.board[row][col] = mergedCol[row];
      }
    }

    if (boardChanged) {
      this.insertRandomTile();

      if (this.checkGameOver()) {
        this.status = 'gameover';
      }
    }
  }

  start() {
    this.status = 'playing';
    this.board = Game._emptyBoard();
    this.score = 0;
    // Add two initial tiles
    this.insertRandomTile();
    this.insertRandomTile();
  }

  restart() {
    this.board = Game._emptyBoard(); // Reset the board
    this.score = 0; // Reset the score
    this.status = 'playing'; // Set the status to 'playing'
    this.insertRandomTile(); // Add the first random tile
    this.insertRandomTile(); // Add the second random tile
  }
}

module.exports = Game;
