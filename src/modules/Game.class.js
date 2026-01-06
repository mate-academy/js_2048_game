'use strict';

/**
 * 2048 Game logic (4x4)
 * - 0 means empty cell
 * - status: 'idle' | 'playing' | 'win' | 'lose'
 */
class Game {
  static SIZE = 4;

  /**
   * @param {number[][]} initialState
   */
  constructor(initialState) {
    const empty = Game._createEmptyBoard();

    this._initialState = Game._cloneBoard(initialState ?? empty);
    this._board = Game._cloneBoard(this._initialState);

    this._score = 0;
    this._status = 'idle';
  }

  // =========================
  // Public API (required)
  // =========================
  moveLeft() {
    return this._move('left');
  }

  moveRight() {
    return this._move('right');
  }

  moveUp() {
    return this._move('up');
  }

  moveDown() {
    return this._move('down');
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this._score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return Game._cloneBoard(this._board);
  }

  /**
   * @returns {'idle'|'playing'|'win'|'lose'}
   */
  getStatus() {
    return this._status;
  }

  /**
   * Starts the game.
   * - switches status from 'idle' -> 'playing' (unless already started)
   * - if the board is empty, spawns 2 tiles
   * - recalculates win/lose if initial state already has terminal condition
   */
  start() {
    if (this._status !== 'idle') {
      return;
    }

    this._status = 'playing';

    if (this._isBoardEmpty()) {
      this._addRandomTile();
      this._addRandomTile();
    }

    this._recalculateStatus();
  }

  /**

   * score=0, status='idle'.
   */
  restart() {
    this._board = Game._cloneBoard(this._initialState);
    this._score = 0;
    this._status = 'idle';
  }

  // =========================
  // Core movement
  // =========================
  /**
   * @param {'left'|'right'|'up'|'down'} direction
   * @returns {boolean} true if board changed
   */
  _move(direction) {
    if (this._status !== 'playing') {
      return false;
    }

    const before_ = Game._cloneBoard(this._board);

    const { board: nextBoard, scoreDelta } = this._computeMove(direction);

    const changed = !Game._boardsEqual(before_, nextBoard);

    if (!changed) {
      return false;
    }

    this._board = nextBoard;
    this._score += scoreDelta;

    this._addRandomTile();
    this._recalculateStatus();

    return true;
  }

  /**
   * Compute a move without side effects (except returned data).
   * @param {'left'|'right'|'up'|'down'} direction
   * @returns {{board:number[][], scoreDelta:number}}
   */
  _computeMove(direction) {
    const size = Game.SIZE;
    const board = Game._cloneBoard(this._board);

    let scoreDelta = 0;

    const applyLine = (line, reverse) => {
      const working = reverse ? [...line].reverse() : [...line];
      const { line: merged, gained } = Game._slideAndMergeLine(working);

      scoreDelta += gained;

      const out = reverse ? merged.reverse() : merged;

      return out;
    };

    if (direction === 'left' || direction === 'right') {
      const reverse = direction === 'right';

      for (let r = 0; r < size; r++) {
        board[r] = applyLine(board[r], reverse);
      }
    } else {
      const reverse = direction === 'down';

      for (let c = 0; c < size; c++) {
        const col = [];

        for (let r = 0; r < size; r++) {
          col.push(board[r][c]);
        }

        const nextCol = applyLine(col, reverse);

        for (let r = 0; r < size; r++) {
          board[r][c] = nextCol[r];
        }
      }
    }

    return { board, scoreDelta };
  }

  // =========================
  // Random tiles and status
  // =========================
  _addRandomTile() {
    const empties = [];

    for (let r = 0; r < Game.SIZE; r++) {
      for (let c = 0; c < Game.SIZE; c++) {
        if (this._board[r][c] === 0) {
          empties.push([r, c]);
        }
      }
    }

    if (empties.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * empties.length);
    const [row, col] = empties[index];

    // 4 has 10% probability
    const value = Math.random() < 0.1 ? 4 : 2;

    this._board[row][col] = value;
  }

  _recalculateStatus() {
    if (this._hasValue(2048)) {
      this._status = 'win';

      return;
    }

    if (!this._hasAvailableMoves()) {
      this._status = 'lose';
    }
  }

  _hasValue(target) {
    for (let r = 0; r < Game.SIZE; r++) {
      for (let c = 0; c < Game.SIZE; c++) {
        if (this._board[r][c] === target) {
          return true;
        }
      }
    }

    return false;
  }

  _hasAvailableMoves() {
    // any empty cell -> move possible
    for (let r = 0; r < Game.SIZE; r++) {
      for (let c = 0; c < Game.SIZE; c++) {
        if (this._board[r][c] === 0) {
          return true;
        }
      }
    }

    // any mergeable neighbors -> move possible
    for (let r = 0; r < Game.SIZE; r++) {
      for (let c = 0; c < Game.SIZE; c++) {
        const v = this._board[r][c];

        // right neighbor
        if (c + 1 < Game.SIZE && this._board[r][c + 1] === v) {
          return true;
        }

        // down neighbor
        if (r + 1 < Game.SIZE && this._board[r + 1][c] === v) {
          return true;
        }
      }
    }

    return false;
  }

  _isBoardEmpty() {
    for (let r = 0; r < Game.SIZE; r++) {
      for (let c = 0; c < Game.SIZE; c++) {
        if (this._board[r][c] !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  // =========================
  // Static helpers
  // =========================
  static _createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
  }
  static _cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  static _boardsEqual(a, b) {
    for (let r = 0; r < Game.SIZE; r++) {
      for (let c = 0; c < Game.SIZE; c++) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Slides non-zeros to the left, merges equal adjacent once, fills with zeros.
   * @param {number[]} line length=4
   * @returns {{line:number[], gained:number}}
   */
  static _slideAndMergeLine(line) {
    const size = Game.SIZE;
    const nonZero = line.filter((v) => v !== 0);

    const out = [];
    let gained = 0;

    for (let i = 0; i < nonZero.length; i++) {
      const current = nonZero[i];
      const next = nonZero[i + 1];

      if (next !== undefined && current === next) {
        const merged = current * 2;

        out.push(merged);
        gained += merged;
        i += 1; // skip next (merged once per move)
      } else {
        out.push(current);
      }
    }

    while (out.length < size) {
      out.push(0);
    }

    return { line: out, gained };
  }
}

module.exports = Game;
