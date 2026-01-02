'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.size = 4;

    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.score = 0;
    this.status = 'idle';
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

  _addRandomTile() {
    const empty = [];

    for (let row = 0; row < this.size; row++) {
      for (let colIdx = 0; colIdx < this.size; colIdx++) {
        if (this.board[row][colIdx] === 0) {
          empty.push([row, colIdx]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  _checkLose() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }

        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return false;
        }

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
  }

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let row = this.board[r].filter((v) => v !== 0);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];

          if (row[i] === 2048) {
            this.status = 'win';
          }

          row[i + 1] = 0;
          i++;
        }
      }
      row = row.filter((v) => v !== 0);

      while (row.length < this.size) {
        row.push(0);
      }

      if (row.some((v, idx) => v !== this.board[r][idx])) {
        moved = true;
      }

      this.board[r] = row;
    }

    if (moved && this.status === 'playing') {
      this._addRandomTile();
      this._checkLose();
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let row = this.board[r].filter((v) => v !== 0);

      for (let i = row.length - 1; i > 0; i--) {
        if (row[i] === row[i - 1]) {
          row[i] *= 2;
          this.score += row[i];

          if (row[i] === 2048) {
            this.status = 'win';
          }

          row[i - 1] = 0;
          i--;
        }
      }
      row = row.filter((v) => v !== 0);

      while (row.length < this.size) {
        row.unshift(0);
      }

      if (row.some((v, idx) => v !== this.board[r][idx])) {
        moved = true;
      }

      this.board[r] = row;
    }

    if (moved && this.status === 'playing') {
      this._addRandomTile();
      this._checkLose();
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      let col = [];

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== 0) {
          col.push(this.board[r][c]);
        }
      }

      for (let i = 0; i < col.length - 1; i++) {
        if (col[i] === col[i + 1]) {
          col[i] *= 2;
          this.score += col[i];

          if (col[i] === 2048) {
            this.status = 'win';
          }
          col[i + 1] = 0;
          i++;
        }
      }

      col = col.filter((v) => v !== 0);

      while (col.length < this.size) {
        col.push(0);
      }

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== col[r]) {
          moved = true;
        }
        this.board[r][c] = col[r];
      }
    }

    if (moved && this.status === 'playing') {
      this._addRandomTile();
      this._checkLose();
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      let col = [];

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== 0) {
          col.push(this.board[r][c]);
        }
      }

      for (let i = col.length - 1; i > 0; i--) {
        if (col[i] === col[i - 1]) {
          col[i] *= 2;
          this.score += col[i];

          if (col[i] === 2048) {
            this.ststus = 'win';
          }
          col[i - 1] = 0;
          i--;
        }
      }

      col = col.filter((v) => v !== 0);

      while (col.length < this.size) {
        col.unshift(0);
      }

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== col[r]) {
          moved = true;
          this.board[r][c] = col[r];
        }
      }
    }

    if (moved && this.status === 'playing') {
      this._addRandomTile();
      this._checkLose();
    }

    return moved;
  }
}

export default Game;
export { Game };
