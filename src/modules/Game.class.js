'use strict';
export class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'inProgress'; // 'inProgress' | 'win' | 'lose'
    this.board = initialState || this.createEmptyBoard();

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
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
  restart() {
    this.score = 0;
    this.status = 'inProgress';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }
  start() {
    this.restart();
  }
  moveLeft() {
    this.makeMove(this.slideLeft.bind(this));
  }
  moveRight() {
    this.makeMove(this.slideRight.bind(this));
  }
  moveUp() {
    this.makeMove(this.slideUp.bind(this));
  }
  moveDown() {
    this.makeMove(this.slideDown.bind(this));
  }
  makeMove(slideFn) {
    const prev = this.board.map((row) => row.slice());

    this.board = slideFn(this.board);

    if (!this.boardsEqual(prev, this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }
  boardsEqual(b1, b2) {
    return b1.flat().every((val, i) => val === b2.flat()[i]);
  }
  slideLeft(board) {
    return board.map((row) => this.mergeRow(row));
  }
  slideRight(board) {
    return board.map((row) => this.mergeRow(row.reverse()).reverse());
  }
  slideUp(board) {
    let rotated = this.rotateLeft(board);

    rotated = rotated.map((row) => this.mergeRow(row));

    return this.rotateRight(rotated);
  }
  slideDown(board) {
    let rotated = this.rotateLeft(board);

    rotated = rotated.map((row) => this.mergeRow(row.reverse()).reverse());

    return this.rotateRight(rotated);
  }
  rotateLeft(matrix) {
    return matrix[0].map((_, col) => matrix.map((row) => row[col])).reverse();
  }
  rotateRight(matrix) {
    return matrix.reverse()[0].map((_, col) => matrix.map((row) => row[col]));
  }
  mergeRow(row) {
    const nonZero = row.filter((num) => num !== 0);
    const merged = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        merged.push(nonZero[i] * 2);
        this.score += nonZero[i] * 2;
        i++; // пропускаємо наступний
      } else {
        merged.push(nonZero[i]);
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }
  addRandomTile() {
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
  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.canMove()) {
      return;
    }
    this.status = 'lose';
  }
  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}
