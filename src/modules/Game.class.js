/* eslint-disable no-shadow */
'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.history = [];
    this.scoreHistory = [];

    this.undoCount = 2;
    this.shuffleCount = 1;
    this.removeCount = 0;

    this.has256 = false;
    this.has512 = false;

    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    this.savePreviousState();

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const row = this.board[i].filter((val) => val !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
          this.checkWin(row[j]);
          this.checkUnlocks(row[j]);
        }
      }

      const newRow = row.filter((val) => val !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (this.board[i].toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[i] = newRow;
    }

    if (moved) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      }
    }
  }

  moveRight() {
    this.board = this.reverseRows(this.board);
    this.moveLeft();

    if (this.status === 'win') {
      return;
    }
    this.board = this.reverseRows(this.board);
  }

  moveUp() {
    this.board = this.transpose(this.board);
    this.moveLeft();

    if (this.status === 'win') {
      return;
    }
    this.board = this.transpose(this.board);
  }

  moveDown() {
    this.board = this.transpose(this.board);
    this.board = this.reverseRows(this.board);
    this.moveLeft();

    if (this.status === 'win') {
      return;
    }
    this.board = this.reverseRows(this.board);
    this.board = this.transpose(this.board);
  }

  start() {
    if (this.status !== 'playing') {
      this.board = this.createEmptyBoard();
      this.addRandomTile();
      this.addRandomTile();
      this.score = 0;
      this.status = 'playing';
      this.undoCount = 2;
      this.shuffleCount = 1;
      this.removeCount = 0;
      this.has256 = false;
      this.has512 = false;
    }
  }

  restart() {
    this.status = 'idle';
    this.start();
  }

  savePreviousState() {
    this.history.push(this.board.map((row) => [...row]));
    this.scoreHistory.push(this.score);

    if (this.history.length > 2) {
      this.history.shift();
      this.scoreHistory.shift();
    }
  }

  undo() {
    if (this.undoCount > 0 && this.history.length > 0) {
      this.board = this.history.pop();
      this.score = this.scoreHistory.pop();
      this.undoCount--;
    }
  }

  shuffle() {
    if (this.shuffleCount === 0) {
      return;
    }

    const flat = this.board.flat().filter((v) => v !== 0);

    for (let i = flat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [flat[i], flat[j]] = [flat[j], flat[i]];
    }

    const newBoard = this.createEmptyBoard();

    flat.forEach((val, i) => {
      const row = Math.floor(i / this.size);
      const col = i % this.size;

      newBoard[row][col] = val;
    });

    this.board = newBoard;
    this.shuffleCount--;
  }

  remove() {
    if (this.removeCount === 0) {
      return;
    }

    const filled = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] !== 0) {
          filled.push([i, j]);
        }
      }
    }

    if (filled.length === 0) {
      return;
    }

    const [i, j] = filled[Math.floor(Math.random() * filled.length)];

    this.board[i][j] = 0;
    this.removeCount--;
  }

  checkWin(value) {
    if (value === 2048) {
      this.status = 'win';
    }
  }

  checkUnlocks(value) {
    if (value === 256 && !this.has256) {
      this.shuffleCount++;
      this.has256 = true;
    }

    if (value === 512 && this.removeCount < 2) {
      this.removeCount++;
      this.has512 = true;
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length > 0) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  isGameOver() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }

        if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  reverseRows(matrix) {
    return matrix.map((row) => [...row].reverse());
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
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
}

module.exports = Game;
