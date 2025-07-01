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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
    this.rows = 4;
    this.columns = 4;
  }

  /**
   * Helper method to filter out zeros from a row.
   * @param {number[]} row
   * @returns {number[]}
   * @private
   */
  _filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  /**
   * Core sliding and merging logic for a single row/column.
   * @param {number[]} row
   * @returns {number[]}
   * @private
   */
  _slide(row) {
    // Phase 1: Filter out zeros (compression)
    let processedRow = this._filterZero(row);

    // Phase 2: Merge identical adjacent tiles
    for (let i = 0; i < processedRow.length - 1; i++) {
      if (processedRow[i] === processedRow[i + 1]) {
        processedRow[i] *= 2;
        this.score += processedRow[i]; // Update score
        processedRow[i + 1] = 0; // Mark the merged tile as zero
      }
    }

    // Phase 3: Filter out zeros again (re-compression after merging)
    processedRow = this._filterZero(processedRow);

    // Add zeros back to the end to maintain board size
    while (processedRow.length < this.columns) {
      processedRow.push(0);
    }

    return processedRow;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    const originalBoard = JSON.parse(JSON.stringify(this.board)); // Deep copy

    for (let r = 0; r < this.rows; r++) {
      const row = this.board[r];
      const newRow = this._slide(row);

      this.board[r] = newRow;
    }

    // Check if the board has changed
    if (JSON.stringify(originalBoard) !== JSON.stringify(this.board)) {
      boardChanged = true;
    }

    if (boardChanged) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return boardChanged; // Return if board changed for UI update
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    const originalBoard = JSON.parse(JSON.stringify(this.board));

    for (let r = 0; r < this.rows; r++) {
      const row = this.board[r];

      row.reverse(); // Reverse for right slide

      const newRow = this._slide(row);

      newRow.reverse(); // Reverse back
      this.board[r] = newRow;
    }

    if (JSON.stringify(originalBoard) !== JSON.stringify(this.board)) {
      boardChanged = true;
    }

    if (boardChanged) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return boardChanged;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    const originalBoard = JSON.parse(JSON.stringify(this.board));

    for (let c = 0; c < this.columns; c++) {
      const col = [];

      for (let r = 0; r < this.rows; r++) {
        col.push(this.board[r][c]);
      }

      const newCol = this._slide(col);

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = newCol[r];
      }
    }

    if (JSON.stringify(originalBoard) !== JSON.stringify(this.board)) {
      boardChanged = true;
    }

    if (boardChanged) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return boardChanged;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    const originalBoard = JSON.parse(JSON.stringify(this.board));

    for (let c = 0; c < this.columns; c++) {
      const col = [];

      for (let r = 0; r < this.rows; r++) {
        col.push(this.board[r][c]);
      }

      col.reverse(); // Reverse for down slide

      const newCol = this._slide(col);

      newCol.reverse(); // Reverse back

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = newCol[r];
      }
    }

    if (JSON.stringify(originalBoard) !== JSON.stringify(this.board)) {
      boardChanged = true;
    }

    if (boardChanged) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return boardChanged;
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
    this.addRandomTile();
    this.addRandomTile();
    this.checkGameStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  /**
   * Adds a random tile (2 or 4) to an empty spot on the board.
   */
  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  /**
   * Checks if there are any empty tiles on the board.
   * @returns {boolean}
   * @private
   */
  _hasEmptyTile() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks if there are any possible moves left on the board.
   * @returns {boolean}
   */
  hasPossibleMoves() {
    // Check for horizontal merges
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns - 1; c++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r][c + 1]
        ) {
          return true;
        }
      }
    }

    // Check for vertical merges
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows - 1; r++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r + 1][c]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks the current game status (win/lose).
   */
  checkGameStatus() {
    // Check for win condition (2048 tile)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // Check for lose condition (no empty cells and no possible moves)
    const hasEmptyCells = this._hasEmptyTile();

    if (!hasEmptyCells && !this.hasPossibleMoves()) {
      this.status = 'lose';
    } else if (hasEmptyCells || this.hasPossibleMoves()) {
      this.status = 'playing';
    }
  }
}

module.exports = Game;
