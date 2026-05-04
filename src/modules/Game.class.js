'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState || this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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

  addRandomTile() {
    const empty = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          empty.push({ r: row, c: col });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  slide(row) {
    let arr = row.filter((n) => n !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr[i + 1] = 0;
      }
    }

    arr = arr.filter((n) => n !== 0);

    while (arr.length < this.size) {
      arr.push(0);
    }

    return arr;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const oldRow = this.board[i];
      const newRow = this.slide(oldRow);

      if (oldRow.toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[i] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const reversed = [...this.board[i]].reverse();
      const newRow = this.slide(reversed).reverse();

      if (this.board[i].toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[i] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    this.board = this.transpose(this.board);

    for (let i = 0; i < this.size; i++) {
      const oldRow = this.board[i];
      const newRow = this.slide(oldRow);

      if (oldRow.toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[i] = newRow;
    }

    this.board = this.transpose(this.board);

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    this.board = this.transpose(this.board);

    for (let i = 0; i < this.size; i++) {
      const oldRow = [...this.board[i]];

      // ❗ reverse ПЕРЕД slide
      const newRow = this.slide([...oldRow].reverse()).reverse();

      if (oldRow.toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[i] = newRow;
    }

    this.board = this.transpose(this.board);

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  updateStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    for (const row of this.board) {
      if (row.includes(0)) {
        this.status = 'playing';

        return;
      }
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (this.board[r + 1]?.[c] === val || this.board[r]?.[c + 1] === val) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }
}
export default Game;
