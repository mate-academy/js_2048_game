'use strict';

export default class Game {
  constructor(initialState) {
    this._initialState = initialState ? this._copy(initialState) : null;

    this._state = initialState ? this._copy(initialState) : this._emptyBoard();

    this._status = 'idle';
    this._score = 0;
    this._started = false;
  }

  getState() {
    return this._copy(this._state);
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

  start() {
    this._started = true;
    this._status = 'playing';
    this._score = 0;

    this._state = this._initialState
      ? this._copy(this._initialState)
      : this._emptyBoard();

    this._addRandomTile();
    this._addRandomTile();

    this._updateStatus();
  }

  restart() {
    this._started = false;
    this._status = 'idle';
    this._score = 0;

    this._state = this._initialState
      ? this._copy(this._initialState)
      : this._emptyBoard();
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

  _move(direction) {
    if (!this._started || this._status !== 'playing') {
      return;
    }

    const prevState = this._copy(this._state);

    let board = this._copy(this._state);

    if (direction === 'right') {
      board = this._mirror(board);
    }

    if (direction === 'up') {
      board = this._transpose(board);
    }

    if (direction === 'down') {
      board = this._transpose(board);
      board = this._mirror(board);
    }

    const { board: moved, scoreGain } = this._process(board);

    let result = moved;

    if (direction === 'right') {
      result = this._mirror(result);
    }

    if (direction === 'up') {
      result = this._transpose(result);
    }

    if (direction === 'down') {
      result = this._mirror(result);
      result = this._transpose(result);
    }

    if (!this._equal(prevState, result)) {
      this._state = result;
      this._score += scoreGain;
      this._addRandomTile();
    }

    this._updateStatus();
  }

  _process(board) {
    let scoreGain = 0;

    const newBoard = board.map((row) => {
      const filtered = row.filter((v) => v !== 0);
      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          const value = filtered[i] * 2;

          merged.push(value);
          scoreGain += value;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      return merged;
    });

    return {
      board: newBoard,
      scoreGain,
    };
  }

  _addRandomTile() {
    const empty = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this._state[row][col] === 0) {
          empty.push([row, col]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const randomCell = empty[Math.floor(Math.random() * empty.length)];
    const randomRow = randomCell[0];
    const randomCol = randomCell[1];

    this._state[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
  }

  _updateStatus() {
    if (this._has2048()) {
      this._status = 'win';

      return;
    }

    this._status = this._canMove() ? 'playing' : 'lose';
  }

  _has2048() {
    return this._state.flat().some((v) => v >= 2048);
  }

  _canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const value = this._state[r][c];

        if (value === 0) {
          return true;
        }

        if (r < 3 && this._state[r + 1][c] === value) {
          return true;
        }

        if (c < 3 && this._state[r][c + 1] === value) {
          return true;
        }
      }
    }

    return false;
  }

  _transpose(matrix) {
    const res = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        res[c][r] = matrix[r][c];
      }
    }

    return res;
  }

  _mirror(matrix) {
    return matrix.map((row) => [...row].reverse());
  }

  _emptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  _copy(board) {
    return board.map((row) => [...row]);
  }

  _equal(a, b) {
    return a.every((row, r) => row.every((v, c) => v === b[r][c]));
  }
}
