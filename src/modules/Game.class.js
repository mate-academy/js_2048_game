// src/modules/Game.class.js
'use strict';

export default class Game {
  constructor(size = 4) {
    this.size = size;
    this.score = 0;
    this.status = 'idle';
    this.board = this.createBoard();
  }

  createBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  start() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  getBoard() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  slideAndCombineRow(inputRow) {
    let newRow = inputRow.filter((n) => n !== 0); // копія для редагування

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    newRow = newRow.filter((n) => n !== 0);

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const newRow = this.slideAndCombineRow(this.board[row]);

      if (!moved && newRow.some((val, idx) => val !== this.board[row][idx])) {
        moved = true;
      }
      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkStatus();
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const newRow = this.slideAndCombineRow(
        this.board[row].slice().reverse(),
      ).reverse();

      if (!moved && newRow.some((val, idx) => val !== this.board[row][idx])) {
        moved = true;
      }
      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkStatus();
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  checkStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  addRandomTile() {
    const empty = [];

    for (let rowIdx = 0; rowIdx < this.size; rowIdx++) {
      for (let colIdx = 0; colIdx < this.size; colIdx++) {
        if (this.board[rowIdx][colIdx] === 0) {
          empty.push({ r: rowIdx, c: colIdx });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  canMove() {
    for (let rowIdx = 0; rowIdx < this.size; rowIdx++) {
      for (let colIdx = 0; colIdx < this.size; colIdx++) {
        if (this.board[rowIdx][colIdx] === 0) {
          return true;
        }

        if (
          colIdx < this.size - 1 &&
          this.board[rowIdx][colIdx] === this.board[rowIdx][colIdx + 1]
        ) {
          return true;
        }

        if (
          rowIdx < this.size - 1 &&
          this.board[rowIdx][colIdx] === this.board[rowIdx + 1][colIdx]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
