'use strict';

class Game {
  constructor(initialState) {
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : defaultState;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => this._slideRow(row));

    if (!this._statesEqual(prev, this.state)) {
      this._addRandomTile();
      this._updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => this._reverseSlideRow(row));

    if (!this._statesEqual(prev, this.state)) {
      this._addRandomTile();
      this._updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = this.state.map((row) => [...row]);

    this._transpose();
    this.state = this.state.map((row) => this._slideRow(row));
    this._transpose();

    if (!this._statesEqual(prev, this.state)) {
      this._addRandomTile();
      this._updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = this.state.map((row) => [...row]);

    this._transpose();

    this.state = this.state.map((row) => this._reverseSlideRow(row));
    this._transpose();

    if (!this._statesEqual(prev, this.state)) {
      this._addRandomTile();
      this._updateStatus();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }
  _slideRow(row) {
    const tiles = row.filter((n) => n !== 0);
    const result = [];
    let i = 0;

    while (i < tiles.length) {
      if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
        const merged = tiles[i] * 2;

        result.push(merged);
        this.score += merged;
        i += 2;
      } else {
        result.push(tiles[i]);
        i++;
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  _reverseSlideRow(row) {
    return this._slideRow([...row].reverse()).reverse();
  }

  _transpose() {
    const next = [];

    for (let col = 0; col < 4; col++) {
      next[col] = [];

      for (let row = 0; row < 4; row++) {
        next[col].push(this.state[row][col]);
      }
    }

    this.state = next;
  }

  _statesEqual(a, b) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  _addRandomTile() {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [tileRow, tileCol] = empty[Math.floor(Math.random() * empty.length)];

    this.state[tileRow][tileCol] = Math.random() < 0.9 ? 2 : 4;
  }

  _updateStatus() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (!this._hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  _hasAvailableMoves() {
    for (const row of this.state) {
      if (row.includes(0)) {
        return true;
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.state[r][c];

        if (c + 1 < 4 && this.state[r][c + 1] === val) {
          return true;
        }

        if (r + 1 < 4 && this.state[r + 1][c] === val) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
