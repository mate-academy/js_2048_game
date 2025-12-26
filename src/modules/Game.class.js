'use strict';

class Game {
  constructor(initialState) {
    this.score = 0;
    this.status = 'idle';
    this._listener = null;

    this.board = initialState ?? [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  emptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  start() {
    this.status = 'playing';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.createCell();
    this.createCell();
    this.emit();
  }

  restart() {
    this.status = 'idle';
    this.emit();
  }

  emit() {
    if (this._listener) {
      this._listener(this.board, this.score, this.status);
    }
  }

  onChange(cb) {
    this._listener = cb;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const prev = JSON.stringify(this.board);

    if (direction === 'left') {
      this.moveLeft();
    }

    if (direction === 'right') {
      this.moveRight();
    }

    if (direction === 'up') {
      this.moveUp();
    }

    if (direction === 'down') {
      this.moveDown();
    }

    if (JSON.stringify(this.board) !== prev) {
      this.createCell();
      this.checkGame();
      this.emit();
    }
  }

  slide(row) {
    let arr = row.filter((v) => v);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter((v) => v);

    return [...arr, ...Array(this.size - arr.length).fill(0)];
  }

  moveLeft() {
    this.board = this.board.map((r) => this.slide(r));
  }

  moveRight() {
    this.board = this.board.map((r) => this.slide([...r].reverse()).reverse());
  }

  moveUp() {
    for (let c = 0; c < this.size; c++) {
      const col = this.board.map((r) => r[c]);
      const slid = this.slide(col);

      slid.forEach((value, rowIndex) => {
        this.board[rowIndex][c] = value;
      });
    }
  }

  moveDown() {
    for (let c = 0; c < this.size; c++) {
      const col = this.board.map((r) => r[c]).reverse();
      const slid = this.slide(col).reverse();

      slid.forEach((value, rowIndex) => {
        this.board[rowIndex][c] = value;
      });
    }
  }

  createCell() {
    const empty = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) {
          empty.push([rowIndex, colIndex]);
        }
      });
    });

    if (!empty.length) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  checkGame() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      return;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const v = this.board[i][j];

        if (v === this.board[i + 1]?.[j] || v === this.board[i][j + 1]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  getState() {
    return {
      board: this.board,
      score: this.score,
      status: this.status,
    };
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }
}

module.exports = Game;
