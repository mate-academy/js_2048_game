'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < this.size; i++) {
      let row = this.board[i].filter((val) => val !== 0);
      const merged = Array(this.size).fill(false);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1] && !merged[j] && !merged[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
          merged[j] = true;
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < this.size) {
        row.push(0);
      }
      this.board[i] = row;
    }

    const changed = !this.board.every((row, i) =>
      // eslint-disable-next-line
      row.every((val, j) => val === prevBoard[i][j]),);

    if (changed) {
      this.addRandomTile();
    }
    this.checkGameStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < this.size; i++) {
      let row = this.board[i].filter((val) => val !== 0);

      while (row.length < this.size) {
        row.unshift(0);
      }

      const merged = Array(this.size).fill(false);

      for (let j = this.size - 1; j > 0; j--) {
        if (
          row[j] === row[j - 1] &&
          !merged[j] &&
          !merged[j - 1] &&
          row[j] !== 0
        ) {
          row[j] *= 2;
          this.score += row[j];
          row[j - 1] = 0;
          merged[j] = true;
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < this.size) {
        row.unshift(0);
      }
      this.board[i] = row;
    }

    const changed = !this.board.every((row, i) =>
      // eslint-disable-next-line
      row.every((val, j) => val === prevBoard[i][j]),);

    if (changed) {
      this.addRandomTile();
    }
    this.checkGameStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < this.size; col++) {
      let column = [];

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      const merged = Array(this.size).fill(false);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1] && !merged[i] && !merged[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          merged[i] = true;
        }
      }

      column = column.filter((val) => val !== 0);

      while (column.length < this.size) {
        column.push(0);
      }

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = column[row];
      }
    }

    const changed = !this.board.every((row, i) =>
      // eslint-disable-next-line
      row.every((val, j) => val === prevBoard[i][j]),);

    if (changed) {
      this.addRandomTile();
    }
    this.checkGameStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < this.size; col++) {
      let column = [];

      for (let row = this.size - 1; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      const merged = Array(this.size).fill(false);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1] && !merged[i] && !merged[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          merged[i] = true;
        }
      }

      column = column.filter((val) => val !== 0);

      while (column.length < this.size) {
        column.push(0);
      }

      for (let row = this.size - 1, idx = 0; row >= 0; row--, idx++) {
        this.board[row][col] = column[idx];
      }
    }

    const changed = !this.board.every((row, i) =>
      // eslint-disable-next-line
      row.every((val, j) => val === prevBoard[i][j]),);

    if (changed) {
      this.addRandomTile();
    }
    this.checkGameStatus();
  }

  getScore() {
    return this.score;
  }

  getState(i, j) {
    return this.board[i][j];
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';

    // eslint-disable-next-line
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  checkGameStatus() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
