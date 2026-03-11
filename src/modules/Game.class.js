/* eslint-disable indent */
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
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];

    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  _slideRowLeft(row) {
    const tiles = row.filter((v) => v !== 0);
    let gained = 0;

    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] === tiles[i + 1]) {
        tiles[i] *= 2;
        gained += tiles[i];
        tiles.splice(i + 1, 1);
      }
    }

    while (tiles.length < 4) {
      tiles.push(0);
    }

    return { newRow: tiles, gained };
  }

  _applyMove(transform, inverseTransform) {
    if (this.status !== 'playing') {
      return false;
    }

    const transformed = transform(this.board);
    let totalGained = 0;
    let changed = false;

    const newTransformed = transformed.map((row) => {
      const original = [...row];
      const { newRow, gained } = this._slideRowLeft(row);

      if (newRow.some((v, i) => v !== original[i])) {
        changed = true;
      }

      totalGained += gained;

      return newRow;
    });

    if (!changed) {
      return false;
    }

    this.board = inverseTransform(newTransformed);
    this.score += totalGained;

    this._addRandomTile();
    this._updateStatus();

    return true;
  }

  _rotateCW(board) {
    return board[0].map((_, colIdx) => {
      const column = board.map((row) => row[colIdx]).reverse();

      return column;
    });
  }

  _rotateCCW(board) {
    return board[0].map((_, colIdx) => {
      const column = board.map((row) => row[row.length - 1 - colIdx]);

      return column;
    });
  }

  _flipH(board) {
    return board.map((row) => [...row].reverse());
  }

  moveLeft() {
    return this._applyMove(
      (b) => b,
      (b) => b,
    );
  }

  moveRight() {
    return this._applyMove(
      (b) => this._flipH(b),
      (b) => this._flipH(b),
    );
  }

  moveUp() {
    return this._applyMove(
      (b) => this._rotateCCW(b),
      (b) => this._rotateCW(b),
    );
  }

  moveDown() {
    return this._applyMove(
      (b) => this._rotateCW(b),
      (b) => this._rotateCCW(b),
    );
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [rowIndex, colIndex] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[rowIndex][colIndex] = value;
    this.score += value;

    return value;
  }

  _updateStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.board[r][c];

        if (r + 1 < 4 && this.board[r + 1][c] === val) {
          return;
        }

        if (c + 1 < 4 && this.board[r][c + 1] === val) {
          return;
        }
      }
    }

    this.status = 'lose';
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
    return this.board.map((row) => [...row]);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
