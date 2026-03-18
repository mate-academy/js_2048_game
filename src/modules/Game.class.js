'use strict';

export default class Game {
  constructor(initialState = null) {
    this.size = 4;

    this.initialState = initialState
      ? this._clone(initialState)
      : this._createEmptyBoard();

    this.board = this._clone(this.initialState);
    this.score = 0;
    this.status = 'idle'; // idle | playing | win | lose
  }

  /* ================= PUBLIC METHODS ================= */

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
  }

  restart() {
    this.board = this._clone(this.initialState);
    this.score = 0;
    this.status = 'idle';
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

  getScore() {
    return this.score;
  }

  getState() {
    return this._clone(this.board);
  }

  getStatus() {
    return this.status;
  }

  /* ================= CORE LOGIC ================= */

  _move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = this._clone(this.board);

    if (direction === 'left') {
      this.board = this.board.map((row) => {
        return this._processRow(row);
      });
    }

    if (direction === 'right') {
      this.board = this.board.map((row) => {
        return this._reverse(this._processRow(this._reverse(row)));
      });
    }

    if (direction === 'up') {
      const transposed = this._transpose(this.board);

      const moved = transposed.map((row) => {
        return this._processRow(row);
      });

      this.board = this._transpose(moved);
    }

    if (direction === 'down') {
      const transposed = this._transpose(this.board);

      const moved = transposed.map((row) => {
        return this._reverse(this._processRow(this._reverse(row)));
      });

      this.board = this._transpose(moved);
    }

    if (!this._boardsEqual(oldBoard, this.board)) {
      this._addRandomTile();
      this._updateStatus();

      return true;
    }

    return false;
  }

  _processRow(row) {
    const filtered = row.filter((value) => value !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return result;
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }

  _updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this._canMove()) {
      this.status = 'lose';
    }
  }

  _canMove() {
    if (this.board.some((row) => row.includes(0))) {
      return true;
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size - 1; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  /* ================= HELPERS ================= */

  _createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  _clone(board) {
    return board.map((row) => {
      return [...row];
    });
  }

  _reverse(row) {
    return [...row].reverse();
  }

  _transpose(matrix) {
    return matrix[0].map((_, colIndex) => {
      return matrix.map((row) => {
        return row[colIndex];
      });
    });
  }

  _boardsEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
