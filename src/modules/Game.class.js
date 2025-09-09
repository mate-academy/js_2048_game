'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    if (Array.isArray(initialState)) {
      this._initialState = initialState.map((row) => row.slice());
      this.board = initialState.map((row) => row.slice());
    } else {
      this._initialState = null;
      this.board = this._emptyBoard();
    }
  }

  getState() {
    return this.board.map((row) => row.slice());
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this._initialState) {
      this.board = this._initialState.map((row) => row.slice());
    } else {
      this.board = this._emptyBoard();
    }
    this.score = 0;
    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
  }

  restart() {
    // або restart(), залежно від вимог
    if (this._initialState) {
      this.board = this._initialState.map((row) => row.slice());
    } else {
      this.board = this._emptyBoard();
    }
    this.score = 0;
    this.status = 'idle';
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    // зберігаємо оригінал
    const originalBoard = this.board.map((row) => row.slice());

    let rotated = false;
    let reversed = false;

    switch (direction) {
      case 'right':
        this.board = this._reverseRows(this.board);
        reversed = true;
        break;
      case 'up':
        this.board = this._transpose(this.board);
        rotated = true;
        break;
      case 'down':
        this.board = this._transpose(this.board);
        this.board = this._reverseRows(this.board);
        rotated = true;
        reversed = true;
        break;
      case 'left':
        break;
      default:
        return false;
    }

    let moved = false;
    let gainedTotal = 0;

    const newBoard = this.board.map((row) => {
      const originalRow = row.slice();
      const { newRow, gained } = this._processRow(row);

      if (!this._rowEquals(originalRow, newRow)) {
        moved = true;
      }
      gainedTotal += gained;

      return newRow;
    });

    // якщо нічого не змінилось → повертаємо все як було
    if (!moved) {
      this.board = originalBoard;

      return false;
    }

    this.board = newBoard;
    this.score += gainedTotal;
    this._addRandomTile();
    this._checkStatus();

    if (reversed) {
      this.board = this._reverseRows(this.board);
    }

    if (rotated) {
      this.board = this._transpose(this.board);
    }

    return true;
  }

  moveLeft() {
    return this.move('left');
  }
  moveRight() {
    return this.move('right');
  }
  moveUp() {
    return this.move('up');
  }
  moveDown() {
    return this.move('down');
  }

  _emptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  _addRandomTile() {
    const empty = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          empty.push([row, col]);
        }
      }
    }

    if (!empty.length) {
      return false;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  _transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  _reverseRows(matrix) {
    return matrix.map((row) => row.slice().reverse());
  }

  _processRow(row) {
    const nonZero = row.filter((v) => v !== 0);
    const newRow = [];
    let gained = 0;
    let i = 0;

    while (i < nonZero.length) {
      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;

        newRow.push(merged);
        gained += merged;
        i += 2;
      } else {
        newRow.push(nonZero[i]);
        i++;
      }
    }

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    const moved = !this._rowEquals(row, newRow);

    return { newRow, gained, moved };
  }

  _rowEquals(a, b) {
    return a.every((v, i) => v === b[i]);
  }

  _canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c + 1 < this.size && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r + 1 < this.size && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  _checkStatus() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
    this.status = this._canMove() ? 'playing' : 'lose';
  }
}

module.exports = Game;
