'use strict';

export default class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? this.copyBoard(initialState)
      : this.createEmptyBoard();

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  copyBoard(board) {
    return board.map((row) => row.slice());
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.copyBoard(this.board);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
    this.status = 'playing';
  }

  restart() {
    this.start();
  }

  moveLeft() {
    this.move((board) => board);
  }

  moveRight() {
    this.move(
      (board) => board.map((row) => row.slice().reverse()),
      (board) => board.map((row) => row.slice().reverse()),
    );
  }

  moveUp() {
    this.move(this.transpose, this.transpose);
  }

  moveDown() {
    this.move(
      (board) => this.transpose(board).map((row) => row.reverse()),
      (board) => this.transpose(board.map((row) => row.reverse())),
    );
  }

  move(preprocess = (b) => b, postprocess = (b) => b) {
    if (this.status !== 'playing') {
      return;
    }

    const preBoard = preprocess(this.copyBoard(this.board));
    const [newBoard, gained] = this.slideAndMerge(preBoard);
    const finalBoard = postprocess(newBoard);

    if (!this.isBoardsEqual(this.board, finalBoard)) {
      this.board = finalBoard;
      this.score += gained;
      this.addRandomTile();

      if (this.has2048()) {
        this.status = 'win';
      } else if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  slideAndMerge(board) {
    let score = 0;
    const newBoard = board.map((row) => {
      const filtered = row.filter((v) => v !== 0);
      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          score += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      return merged;
    });

    return [newBoard, score];
  }

  addRandomTile() {
    const empty = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          empty.push([row, col]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  has2048() {
    return this.board.some((row) => row.includes(2048));
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (val === 0) {
          return true;
        }

        if (c < this.size - 1 && val === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && val === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  isBoardsEqual(b1, b2) {
    return JSON.stringify(b1) === JSON.stringify(b2);
  }
}
