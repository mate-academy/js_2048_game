'use strict';

class Game {
  constructor(initialState) {
    this.initialState =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
    this.score = 0;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    if (this.status !== 'playing') {
      return;
    }

    for (let col = 0; col < 4; col++) {
      let column = this.board.map((row) => row[col]).reverse();

      column = this.combineTiles(column).reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.endGame();
  }

  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    if (this.status !== 'playing') {
      return;
    }

    for (let col = 0; col < 4; col++) {
      let column = this.board.map((row) => row[col]);

      column = this.combineTiles(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.endGame();
  }

  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    if (this.status !== 'playing') {
      return;
    }

    for (let row = 0; row < 4; row++) {
      this.board[row] = this.combineTiles(this.board[row].reverse()).reverse();
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.endGame();
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    if (this.status !== 'playing') {
      return;
    }

    for (let row = 0; row < 4; row++) {
      this.board[row] = this.combineTiles(this.board[row]);
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.endGame();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
    this.score = 0;
  }

  combineTiles(row) {
    let newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    newRow = newRow.filter((val) => val !== 0);

    return newRow.concat(Array(4 - newRow.length).fill(0));
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  endGame() {
    let gameOver = true;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] >= 2048) {
          this.status = 'win';
        }

        if (
          (row < 3 && this.board[row][col] === this.board[row + 1][col]) ||
          (col < 3 && this.board[row][col] === this.board[row][col + 1])
        ) {
          gameOver = false;
        }
      }
    }

    if (this.getEmptyCells().length === 0 && gameOver) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
