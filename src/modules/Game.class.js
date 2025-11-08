'use strict';

const SIZE = 4;
const TARGET = 2048;
const START_TILES = 2;
const PROB_4 = 0.1;

class Game {
  constructor(initialState) {
    if (
      Array.isArray(initialState) &&
      initialState.length === SIZE &&
      initialState.every((r) => Array.isArray(r) && r.length === SIZE)
    ) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    }

    this.score = 0;
    this.status = 'idle';
    this.initialState = this.board.map((row) => [...row]);
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  _getEmptyCells() {
    const cells = [];

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.board[r][c] === 0) {
          cells.push([r, c]);
        }
      }
    }

    return cells;
  }

  _spawnRandomTile() {
    const empty = this._getEmptyCells();

    if (empty.length === 0) {
      return false;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < PROB_4 ? 4 : 2;

    return true;
  }

  _arraysEqual(a, b) {
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

  _getColumn(c) {
    const col = new Array(SIZE);

    for (let r = 0; r < SIZE; r++) {
      col[r] = this.board[r][c];
    }

    return col;
  }

  _setColumn(c, arr) {
    for (let r = 0; r < SIZE; r++) {
      this.board[r][c] = arr[r];
    }
  }

  _normalizeLine(line) {
    const compact = line.filter((x) => x !== 0);
    let gain = 0;

    for (let i = 0; i < compact.length - 1; i++) {
      if (compact[i] === compact[i + 1]) {
        compact[i] *= 2;
        gain += compact[i];
        compact[i + 1] = 0;
        i++;
      }
    }

    const merged = compact.filter((x) => x !== 0);

    while (merged.length < SIZE) {
      merged.push(0);
    }

    return { line: merged, gain };
  }

  _canMergeOrMove() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const v = this.board[r][c];

        if (v === 0) {
          return true;
        }

        if (c + 1 < SIZE && this.board[r][c + 1] === v) {
          return true;
        }

        if (r + 1 < SIZE && this.board[r + 1][c] === v) {
          return true;
        }
      }
    }

    return false;
  }

  _checkWin() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.board[r][c] >= TARGET) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    this.score = 0;

    for (let i = 0; i < START_TILES; i++) {
      this._spawnRandomTile();
    }
    this.status = 'playing';
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  reset() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    let gainTotal = 0;

    for (let r = 0; r < SIZE; r++) {
      const beforeArr = [...this.board[r]];
      const { line, gain } = this._normalizeLine(beforeArr);

      this.board[r] = line;

      if (!this._arraysEqual(beforeArr, line)) {
        moved = true;
      }
      gainTotal += gain;
    }

    if (!moved) {
      return false;
    }
    this.score += gainTotal;

    if (this._checkWin()) {
      return true;
    }

    this._spawnRandomTile();

    if (!this._canMergeOrMove()) {
      this.status = 'lose';
    }

    return true;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    let gainTotal = 0;

    for (let r = 0; r < SIZE; r++) {
      const beforeArr = [...this.board[r]];
      const reversed = [...beforeArr].reverse();
      const { line, gain } = this._normalizeLine(reversed);
      const afterArr = line.reverse();

      this.board[r] = afterArr;

      if (!this._arraysEqual(beforeArr, afterArr)) {
        moved = true;
      }
      gainTotal += gain;
    }

    if (!moved) {
      return false;
    }
    this.score += gainTotal;

    if (this._checkWin()) {
      return true;
    }

    this._spawnRandomTile();

    if (!this._canMergeOrMove()) {
      this.status = 'lose';
    }

    return true;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    let gainTotal = 0;

    for (let c = 0; c < SIZE; c++) {
      const beforeArr = this._getColumn(c);
      const { line, gain } = this._normalizeLine(beforeArr);

      this._setColumn(c, line);

      if (!this._arraysEqual(beforeArr, line)) {
        moved = true;
      }
      gainTotal += gain;
    }

    if (!moved) {
      return false;
    }
    this.score += gainTotal;

    if (this._checkWin()) {
      return true;
    }

    this._spawnRandomTile();

    if (!this._canMergeOrMove()) {
      this.status = 'lose';
    }

    return true;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    let gainTotal = 0;

    for (let c = 0; c < SIZE; c++) {
      const beforeArr = this._getColumn(c);
      const reversed = [...beforeArr].reverse();
      const { line, gain } = this._normalizeLine(reversed);
      const afterArr = line.reverse();

      this._setColumn(c, afterArr);

      if (!this._arraysEqual(beforeArr, afterArr)) {
        moved = true;
      }
      gainTotal += gain;
    }

    if (!moved) {
      return false;
    }
    this.score += gainTotal;

    if (this._checkWin()) {
      return true;
    }

    this._spawnRandomTile();

    if (!this._canMergeOrMove()) {
      this.status = 'lose';
    }

    return true;
  }
}

module.exports = Game;
