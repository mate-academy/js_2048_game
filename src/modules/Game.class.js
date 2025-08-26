'use strict';

export default class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
  }

  restart() {
    this.start();
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newBoard = this.board.map((row) => {
      const compressed = row.filter((n) => n !== 0);
      const merged = [];
      let skip = false;

      for (let i = 0; i < compressed.length; i++) {
        if (!skip && compressed[i] === compressed[i + 1]) {
          merged.push(compressed[i] * 2);
          this.score += compressed[i] * 2;
          skip = true;
          moved = true;
        } else {
          if (skip) {
            skip = false;
          } else {
            merged.push(compressed[i]);
          }
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      if (!this.arraysEqual(merged, row)) {
        moved = true;
      }

      return merged;
    });

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkStatus();
    }

    return moved;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    const reversed = this.board.map((row) => [...row].reverse());
    const newGame = new Game(reversed);

    newGame.score = this.score;
    newGame.status = this.status;

    const moved = newGame.moveLeft();

    if (moved) {
      this.board = newGame.board.map((row) => [...row].reverse());
      this.score = newGame.score;
      this.checkStatus();
    }

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    const transposed = this.transpose(this.board);
    const newGame = new Game(transposed);

    newGame.score = this.score;
    newGame.status = this.status;

    const moved = newGame.moveLeft();

    if (moved) {
      this.board = this.transpose(newGame.board);
      this.score = newGame.score;
      this.checkStatus();
    }

    return moved;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    const rawTransposed = this.transpose(this.board);
    const transposed = rawTransposed.map((row) => [...row].reverse());
    const newGame = new Game(transposed);

    newGame.score = this.score;
    newGame.status = this.status;

    const moved = newGame.moveLeft();

    if (moved) {
      this.board = this.transpose(
        newGame.board.map((row) => [...row].reverse()),
      );
      this.score = newGame.score;
      this.checkStatus();
    }

    return moved;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r1 = 0; r1 < this.size; r1++) {
      for (let c2 = 0; c2 < this.size; c2++) {
        if (this.board[r1][c2] === 0) {
          emptyCells.push([r1, c2]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  arraysEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((v, i) => v === b[i]);
  }

  transpose(board) {
    const newBoard = this.createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        newBoard[c][r] = board[r][c];
      }
    }

    return newBoard;
  }

  checkStatus() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'won';

          return;
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'over';
    }
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
}
