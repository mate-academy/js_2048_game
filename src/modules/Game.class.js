'use strict';
class Game {
  constructor(initialState) {
    this.size = 4;

    this._emptyBoard = () =>
      Array.from({ length: this.size }, () => Array(this.size).fill(0));

    this.field = this._emptyBoard();
    this.score = 0;
    this.status = 'idle';

    if (Array.isArray(initialState)) {
      this.field = initialState.map((r) => r.slice());
    } else if (initialState && Array.isArray(initialState.field)) {
      this.field = initialState.field.map((r) => r.slice());
      this.score = Number(initialState.score || 0);
      this.status = initialState.status || 'idle';
    }

    this._initialField = this.field.map((r) => r.slice());
  }

  _cloneField(field = this.field) {
    return field.map((r) => r.slice());
  }

  _emptyCells() {
    const res = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.field[r][c] === 0) {
          res.push([r, c]);
        }
      }
    }

    return res;
  }

  _spawnRandomTile() {
    const empties = this._emptyCells();

    if (!empties.length) {
      return;
    }

    const [r, c] = empties[Math.floor(Math.random() * empties.length)];

    this.field[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  _transpose(mat) {
    const t = this._emptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        t[c][r] = mat[r][c];
      }
    }

    return t;
  }

  _rowsEqual(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  _has2048() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.field[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  _hasMoves() {
    if (this._emptyCells().length) {
      return true;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this.field[r][c];

        if (r + 1 < this.size && this.field[r + 1][c] === v) {
          return true;
        }

        if (c + 1 < this.size && this.field[r][c + 1] === v) {
          return true;
        }
      }
    }

    return false;
  }

  _compressAndMergeRowLeft(row) {
    const vals = row.filter((x) => x !== 0);
    const res = [];
    let gained = 0;

    for (let i = 0; i < vals.length; i++) {
      if (vals[i] === vals[i + 1]) {
        const merged = vals[i] * 2;

        res.push(merged);
        gained += merged;
        i++;
      } else {
        res.push(vals[i]);
      }
    }

    while (res.length < this.size) {
      res.push(0);
    }

    return { row: res, gained };
  }

  _moveLeftCore(matrix) {
    const newMat = [];
    let totalGained = 0;
    let changed = false;

    for (let r = 0; r < this.size; r++) {
      const { row: newRow, gained } = this._compressAndMergeRowLeft(matrix[r]);

      newMat.push(newRow);
      totalGained += gained;

      if (!this._rowsEqual(matrix[r], newRow)) {
        changed = true;
      }
    }

    return { matrix: newMat, changed, totalGained };
  }

  _applyMove(result) {
    if (!result.changed) {
      return false;
    }

    this.field = result.matrix;

    if (result.totalGained > 0) {
      this.score += result.totalGained;
    }
    this._spawnRandomTile();

    if (this._has2048()) {
      this.status = 'win';
    } else if (!this._hasMoves()) {
      this.status = 'lose';
    }

    return true;
  }

  getState() {
    return this._cloneField();
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    if (this.status === 'running') {
      return 'playing';
    }

    return this.status;
  }

  start() {
    this.status = 'running';
    this._spawnRandomTile();
    this._spawnRandomTile();
  }

  restart() {
    this.field = this._initialField.map((r) => r.slice());
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'running') {
      return false;
    }

    const res = this._moveLeftCore(this.field);

    return this._applyMove(res);
  }

  moveRight() {
    if (this.status !== 'running') {
      return false;
    }

    const reversed = this.field.map((r) => r.slice().reverse());
    const res = this._moveLeftCore(reversed);

    res.matrix = res.matrix.map((r) => r.reverse());

    return this._applyMove(res);
  }

  moveUp() {
    if (this.status !== 'running') {
      return false;
    }

    const t = this._transpose(this.field);
    const res = this._moveLeftCore(t);

    res.matrix = this._transpose(res.matrix);

    return this._applyMove(res);
  }

  moveDown() {
    if (this.status !== 'running') {
      return false;
    }

    const t = this._transpose(this.field).map((r) => r.reverse());
    const res = this._moveLeftCore(t);

    res.matrix = this._transpose(res.matrix.map((r) => r.reverse()));

    return this._applyMove(res);
  }
}

module.exports = Game;
