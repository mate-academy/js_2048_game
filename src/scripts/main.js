/* eslint-disable function-paren-newline */
'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

export class Game {
  constructor(initialState = null) {
    this.size = 4; // 4x4 board
    this.board = initialState || this.generateEmptyBoard();
    this.score = 0;
    this.status = 'waiting';
  }

  generateEmptyBoard() {
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

  spawnTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  compressRow(row) {
    const newRow = row.filter((num) => num !== 0);

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  mergeRow(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row[i + 1] = 0;
      }
    }

    return row;
  }

  moveLeft() {
    let moved = false;

    this.board = this.board.map((row) => {
      const compressed = this.compressRow(row);
      const merged = this.mergeRow(compressed);
      const newRow = this.compressRow(merged);

      if (newRow.toString() !== row.toString()) {
        moved = true;
      }

      return newRow;
    });

    if (moved) {
      this.spawnTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
  }

  moveUp() {
    this.transposeBoard();
    this.moveLeft();
    this.transposeBoard();
  }

  moveDown() {
    this.transposeBoard();
    this.moveRight();
    this.transposeBoard();
  }

  transposeBoard() {
    this.board = this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );
  }

  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'won';
    } else if (!this.canMove()) {
      this.status = 'lost';
    }
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (
          col < this.size - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.size - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  start() {
    this.board = this.generateEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.start();
  }
}
