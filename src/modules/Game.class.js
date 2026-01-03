/* eslint-disable prettier/prettier */
'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this._createEmptyBoard();

    this.score = 0;
    this.status = 'idle'; // idle | playing | win | lose
  }

  /* ---------- PUBLIC API (USED IN TESTS) ---------- */

  moveLeft() {
    this._move((board) => board.map((row) => this._mergeRowLeft(row)));
  }

  moveRight() {
    this._move(board => board.map(row =>
      this._mergeRowLeft([...row].reverse()).reverse()));
  }

  moveUp() {
    this._move((board) => {
      const t = this._transpose(board);
      const merged = t.map((row) => this._mergeRowLeft(row));

      return this._transpose(merged);
    });
  }

  moveDown() {
    this._move(board => {
      const transposed = this._transpose(board);

      const merged = transposed.map(row =>
        this._mergeRowLeft([...row].reverse()).reverse());

      return this._transpose(merged);
    });
  }


  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this._addRandomTile();
    this._addRandomTile();
    this.status = 'playing';
  }

  restart() {
    this.board = this._createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  /* ---------- INTERNAL HELPERS ---------- */

  _createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  _move(transformFn) {
    if (this.status !== 'playing') {
      return;
    }

    const prev = JSON.stringify(this.board);

    this.board = transformFn(this.board);

    if (JSON.stringify(this.board) === prev) {
      return;
    }

    this._addRandomTile();

    if (this._has2048()) {
      this.status = 'win';
    } else if (!this._canMove()) {
      this.status = 'lose';
    }
  }

  _mergeRowLeft(row) {
    const filtered = row.filter((v) => v !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        this.score += merged;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  _transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  _addRandomTile() {
    const empty = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          empty.push([row, col]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  _has2048() {
    return this.board.some((row) => row.includes(2048));
  }

  _canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const v = this.board[r][c];

        if (v === 0) {
          return true;
        }

        if (this.board[r]?.[c + 1] === v) {
          return true;
        }

        if (this.board[r + 1]?.[c] === v) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
