'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;

    this._initial =
      Array.isArray(initialState) && initialState.length === this.size
        ? initialState.map((row) => row.slice())
        : this._emptyBoard();

    this._board = this._initial.map((row) => row.slice());
    this._score = 0;
    this._status = 'idle';
  }

  getState() {
    return this._board.map((r) => r.slice());
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

  start() {
    if (this._status !== 'idle') {
      return;
    }

    if (this._isBoardEmpty()) {
      this._spawnRandomTile();
      this._spawnRandomTile();
    }
    this._status = 'playing';
    this._recomputeStatus();
  }

  restart() {
    this._board = this._initial.map((row) => row.slice());
    this._score = 0;
    this._status = 'idle';
  }

  moveLeft() {
    this._move('left');
  }
  moveRight() {
    this._move('right');
  }
  moveUp() {
    this._move('up');
  }
  moveDown() {
    this._move('down');
  }

  _emptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  _isBoardEmpty() {
    return this._board.every((row) => row.every((v) => v === 0));
  }

  _spawnRandomTile() {
    const empties = [];

    for (let r1 = 0; r1 < this.size; r1++) {
      for (let c1 = 0; c1 < this.size; c1++) {
        if (this._board[r1][c1] === 0) {
          empties.push([r1, c1]);
        }
      }
    }

    if (!empties.length) {
      return false;
    }

    const [r2, c2] = empties[Math.floor(Math.random() * empties.length)];

    this._board[r2][c2] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  _move(direction) {
    if (this._status !== 'playing') {
      return;
    }

    const prevSerialized = this._serialize(this._board);
    let changed = false;

    if (direction === 'left') {
      changed = this._moveLeftInternal();
    } else if (direction === 'right') {
      this._reverseRows();
      changed = this._moveLeftInternal();
      this._reverseRows();
    } else if (direction === 'up') {
      this._transpose();
      changed = this._moveLeftInternal();
      this._transpose();
    } else if (direction === 'down') {
      this._transpose();
      this._reverseRows();
      changed = this._moveLeftInternal();
      this._reverseRows();
      this._transpose();
    }

    if (!changed || prevSerialized === this._serialize(this._board)) {
      return;
    }

    this._spawnRandomTile();
    this._recomputeStatus();
  }

  _serialize(board) {
    return board.flat().join(',');
  }

  _reverseRows() {
    for (let r1 = 0; r1 < this.size; r1++) {
      this._board[r1].reverse();
    }
  }

  _transpose() {
    const n = this.size;

    for (let r1 = 0; r1 < n; r1++) {
      for (let c1 = r1 + 1; c1 < n; c1++) {
        const t = this._board[r1][c1];

        this._board[r1][c1] = this._board[c1][r1];
        this._board[c1][r1] = t;
      }
    }
  }

  _moveLeftInternal() {
    let anyChange = false;

    for (let r1 = 0; r1 < this.size; r1++) {
      const rowArr = this._board[r1].slice();
      const compressed = rowArr.filter((v) => v !== 0);

      const merged = [];

      for (let i = 0; i < compressed.length; i++) {
        if (compressed[i] === compressed[i + 1]) {
          const v = compressed[i] * 2;

          merged.push(v);
          this._score += v;
          i++;
        } else {
          merged.push(compressed[i]);
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      for (let c1 = 0; c1 < this.size; c1++) {
        if (this._board[r1][c1] !== merged[c1]) {
          anyChange = true;
        }
        this._board[r1][c1] = merged[c1];
      }
    }

    return anyChange;
  }

  _has2048() {
    return this._board.some((r1) => r1.some((v) => v === 2048));
  }

  _canMove() {
    if (this._board.some((r1) => r1.some((v) => v === 0))) {
      return true;
    }

    const n = this.size;

    for (let r1 = 0; r1 < n; r1++) {
      for (let c1 = 0; c1 < n; c1++) {
        const v = this._board[r1][c1];

        if (
          (c1 + 1 < n && v === this._board[r1][c1 + 1]) ||
          (r1 + 1 < n && v === this._board[r1 + 1][c1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  _recomputeStatus() {
    if (this._has2048()) {
      this._status = 'win';

      return;
    }

    if (!this._canMove()) {
      this._status = 'lose';

      return;
    }
    this._status = 'playing';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
}

if (typeof window !== 'undefined') {
  window.Game = Game;
}
