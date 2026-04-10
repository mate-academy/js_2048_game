'use strict';

// src/modules/Game.class.js

const SIZE = 4;

export class Game {
  constructor(initialState = null) {
    this.initialState = initialState || this.createEmptyBoard();
    this.restart();
  }

  createEmptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status; // 'idle' | 'playing' | 'win' | 'lose'
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // ---------------- MOVE LOGIC ----------------

  moveLeft() {
    return this.move(this.board);
  }

  moveRight() {
    const reversed = this.board.map((row) => [...row].reverse());
    const moved = this.move(reversed);

    this.board = reversed.map((row) => row.reverse());

    return moved;
  }

  moveUp() {
    const transposed = this.transpose(this.board);
    const moved = this.move(transposed);

    this.board = this.transpose(transposed);

    return moved;
  }

  moveDown() {
    const transposed = this.transpose(this.board).map((row) => row.reverse());
    const moved = this.move(transposed);

    this.board = this.transpose(transposed.map((row) => row.reverse()));

    return moved;
  }

  move(boardRef) {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let i = 0; i < SIZE; i++) {
      const original = [...boardRef[i]];
      const { newRow, gained } = this.processRow(boardRef[i]);

      boardRef[i] = newRow;
      this.score += gained;

      if (!this.arraysEqual(original, newRow)) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }

    return moved;
  }

  processRow(row) {
    let arr = row.filter((x) => x !== 0);
    let gained = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        gained += arr[i];
        arr[i + 1] = 0;
        i++; // skip next (merged once rule)
      }
    }

    arr = arr.filter((x) => x !== 0);

    while (arr.length < SIZE) {
      arr.push(0);
    }

    return { newRow: arr, gained };
  }

  // ---------------- HELPERS ----------------

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  arraysEqual(a, b) {
    return a.every((v, i) => v === b[i]);
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.has2048()) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  has2048() {
    return this.board.some((row) => row.includes(2048));
  }

  canMove() {
    // empty exists
    if (this.board.some((row) => row.includes(0))) {
      return true;
    }

    // horizontal
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    // vertical
    for (let c = 0; c < SIZE; c++) {
      for (let r = 0; r < SIZE - 1; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}
