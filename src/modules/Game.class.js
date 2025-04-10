'use strict';

export class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'
    this.board = initialState || this.createEmptyBoard();

    if (initialState) {
      this.status = 'playing';
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const original = [...this.board[row]];
      const newRow = this.mergeRow(this.board[row]);

      this.board[row] = newRow;

      if (!this.arraysEqual(original, newRow)) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
      this.checkWin();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.transpose();
    this.moveRight();
    this.transpose();
  }

  mergeRow(row) {
    let newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
        i++;
      }
    }

    newRow = newRow.filter((val) => val !== 0);

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  checkWin() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkGameOver() {
    const canMove = (r, c) => {
      const val = this.board[r][c];

      return (
        (c < this.size - 1 && this.board[r][c + 1] === val) ||
        (r < this.size - 1 && this.board[r + 1][c] === val)
      );
    };

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0 || canMove(r, c)) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}
