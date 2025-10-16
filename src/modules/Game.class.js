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
    // eslint-disable-next-line no-console
    this.size = 4;
    this.initialState = initialState || this.createEmptyBoard();
    this.board = this.cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  moveLeft() {
    const moved = this._moveRows((row) => row.slice());

    if (moved) {
      this._afterSuccessfulMove();
    }

    return moved;
  }
  moveRight() {
    const moved = this._moveRows((row) => row.slice().reverse(), true);

    if (moved) {
      this._afterSuccessfulMove();
    }

    return moved;
  }
  moveUp() {
    const transposed = this._transpose(this.board);
    const moved = this._moveRows((row) => row.slice(), false, transposed);

    if (moved) {
      this._afterSuccessfulMove(true);
    }

    return moved;
  }
  moveDown() {
    const transposed = this._transpose(this.board);
    const moved = this._moveRows(
      (row) => row.slice().reverse(),
      true,
      transposed,
    );

    if (moved) {
      this._afterSuccessfulMove(true);
    }

    return moved;
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
    return this.board.map((row) => row.slice());
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

    // Add two starting tiles
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.score = 0;

    // Add two new tiles
    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here
  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return false;
    }

    const [a, b] = empty[Math.floor(Math.random() * empty.length)];

    this.board[a][b] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  _moveRows(mapRowFn, reverseFlag = false, matrixOverride = null) {
    const matrix = matrixOverride || this.board;
    const newMatrix = [];
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const origRow = matrix[r];
      const row = mapRowFn(origRow);

      // filter zeros
      const packed = row.filter((v) => v !== 0);

      const merged = [];
      let skip = false;

      for (let i = 0; i < packed.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (i + 1 < packed.length && packed[i] === packed[i + 1]) {
          // merge
          const newValue = packed[i] * 2;

          merged.push(newValue);
          this.score += newValue; // add merged value to score
          skip = true; // skip next (it has been merged)
        } else {
          merged.push(packed[i]);
        }
      }

      // pad with zeros to the right to fill the row
      while (merged.length < this.size) {
        merged.push(0);
      }

      const finalRow = reverseFlag ? merged.slice().reverse() : merged;

      newMatrix.push(finalRow);

      if (!this._rowsEqual(finalRow, origRow)) {
        moved = true;
      }
    }

    // If we used a matrixOverride (transposed), transpose back
    if (matrixOverride) {
      this.board = this._transpose(newMatrix);
    } else {
      this.board = newMatrix;
    }

    return moved;
  }

  _rowsEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  _transpose(board) {
    return board[0].map((_, c) => board.map((row) => row[c]));
  }

  // After a moved board
  _afterSuccessfulMove(transposed = false) {
    // If the game was 'idle', the first successful move starts the game.
    if (this.status === 'idle') {
      this.status = 'playing';
    }

    // Add new random tile
    this.addRandomTile();

    // Check win
    if (this._checkWin()) {
      this.status = 'win';

      return;
    }

    // If no moves possible, set to lose
    if (!this._canMove()) {
      this.status = 'lose';
    }
  }

  _checkWin() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  _canMove() {
    // any empty cell?
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    // any adjacent equal cells horizontally or vertically?
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this.board[r][c];

        if (r + 1 < this.size && this.board[r + 1][c] === v) {
          return true;
        }

        if (c + 1 < this.size && this.board[r][c + 1] === v) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
