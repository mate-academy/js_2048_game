'use strict';

export default class Game {
  constructor(initialState) {
    this.size = 4;
    this._initial = this._normalizeInitial(initialState);
    this._board = this._clone(this._initial);
    this._score = 0;
    this._status = 'idle';
  }

  start() {
    this._board = this._clone(this._initial);
    this._score = 0;

    if (this._isEmptyBoard(this._board)) {
      this._addRandomTile();
      this._addRandomTile();
    }
    this._status = 'playing';
    this._updateStatus();
  }

  restart() {
    this._board = this._clone(this._initial);
    this._score = 0;
    this._status = 'idle';
    this.start();
  }

  getState() {
    return this._clone(this._board);
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

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

  _normalizeInitial(initial) {
    const size = this.size;
    const empty = Array.from({ length: size }, () => Array(size).fill(0));

    if (!initial) {
      return empty;
    }

    if (!Array.isArray(initial) || initial.length !== size) {
      return empty;
    }

    return Array.from({ length: size }, (_, r) => {
      const row = Array.isArray(initial[r]) ? initial[r] : [];

      // eslint-disable-next-line no-shadow
      return Array.from({ length: size }, (_, c) => {
        const v = row[c];

        return typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0;
      });
    });
  }

  _clone(board) {
    return board.map((row) => row.slice());
  }

  _isEmptyBoard(board) {
    return board.every((row) => row.every((v) => v === 0));
  }

  _getEmptyCells() {
    const cells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this._board[r][c] === 0) {
          cells.push([r, c]);
        }
      }
    }

    return cells;
  }

  _addRandomTile() {
    const empties = this._getEmptyCells();

    if (empties.length === 0) {
      return false;
    }

    const idx = (Math.random() * empties.length) | 0;
    const [r, c] = empties[idx];

    this._board[r][c] = Math.random() < 0.1 ? 4 : 2;

    return true;
  }

  _transpose(board) {
    const n = this.size;
    const out = Array.from({ length: n }, () => Array(n).fill(0));

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        out[c][r] = board[r][c];
      }
    }

    return out;
  }

  _reverseRows(board) {
    return board.map((row) => row.slice().reverse());
  }

  _compressAndMergeRowLeft(row) {
    const filtered = row.filter((v) => v !== 0);
    const out = [];
    let gained = 0;

    for (let i = 0; i < filtered.length; i++) {
      const curr = filtered[i];
      const next = filtered[i + 1];

      if (next !== undefined && curr === next) {
        const merged = curr * 2;

        out.push(merged);
        gained += merged;
        i++;
      } else {
        out.push(curr);
      }
    }

    while (out.length < this.size) {
      out.push(0);
    }

    return { row: out, gained };
  }

  _boardEquals(a, b) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  _has2048() {
    return this._board.some((row) => row.includes(2048));
  }

  _canMove() {
    if (this._getEmptyCells().length > 0) {
      return true;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this._board[r][c];

        if (r + 1 < this.size && this._board[r + 1][c] === v) {
          return true;
        }

        if (c + 1 < this.size && this._board[r][c + 1] === v) {
          return true;
        }
      }
    }

    return false;
  }

  _updateStatus() {
    if (this._status !== 'win' && this._has2048()) {
      this._status = 'win';

      return;
    }

    if (!this._canMove()) {
      this._status = 'lose';

      return;
    }

    if (this._status === 'idle') {
      this._status = 'playing';
    }
  }

  _move(dir) {
    if (this._status !== 'playing') {
      return false;
    }

    const prevBoard = this._clone(this._board);
    let working = this._clone(this._board);

    switch (dir) {
      case 'right':
        working = this._reverseRows(working);
        break;
      case 'up':
        working = this._transpose(working);
        break;
      case 'down':
        working = this._transpose(working);
        working = this._reverseRows(working);
        break;
    }

    let gainedTotal = 0;

    for (let r = 0; r < this.size; r++) {
      const { row, gained } = this._compressAndMergeRowLeft(working[r]);

      working[r] = row;
      gainedTotal += gained;
    }

    switch (dir) {
      case 'right':
        working = this._reverseRows(working);
        break;
      case 'up':
        working = this._transpose(working);
        break;
      case 'down':
        working = this._reverseRows(working);
        working = this._transpose(working);
        break;
    }

    if (!this._boardEquals(prevBoard, working)) {
      this._board = working;

      if (gainedTotal > 0) {
        this._score += gainedTotal;
      }
      this._addRandomTile();
      this._updateStatus();

      return true;
    }

    this._updateStatus();

    return false;
  }
}
