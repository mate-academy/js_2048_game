'use strict';

class Game {
  constructor(initialState) {
    this.board =
      initialState ||
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }

  // Helper to clone the board
  cloneBoard() {
    return this.board.map((row) => [...row]);
  }

  // Generate a random number (2 or 4)
  generateRandomTile() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  // Place a random tile on the board
  placeRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = this.generateRandomTile();

    return true;
  }

  // Shift tiles in one row/column
  shiftLine(line) {
    const filtered = line.filter((value) => value !== 0);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        this.score += filtered[i] * 2;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    return [...merged, ...Array(4 - merged.length).fill(0)];
  }

  // Rotate board 90 degrees clockwise (for vertical moves)
  rotateClockwise() {
    const newBoard = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[j][3 - i] = this.board[i][j];
      }
    }
    this.board = newBoard;
  }

  // Rotate board 90 degrees counter-clockwise
  rotateCounterClockwise() {
    this.rotateClockwise();
    this.rotateClockwise();
    this.rotateClockwise();
  }

  moveLeft() {
    const previousState = this.cloneBoard();

    this.board = this.board.map(this.shiftLine.bind(this));

    if (JSON.stringify(previousState) !== JSON.stringify(this.board)) {
      this.placeRandomTile();
    }
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
  }

  moveUp() {
    this.rotateClockwise();
    this.moveLeft();
    this.rotateCounterClockwise();
  }

  moveDown() {
    this.rotateCounterClockwise();
    this.moveLeft();
    this.rotateClockwise();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.status === 'win' || this.status === 'lose') {
      return this.status;
    }

    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return 'win';
    }

    if (!this.placeRandomTile() && !this.canMove()) {
      this.status = 'lose';

      return 'lose';
    }

    return 'playing';
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  start() {
    this.board = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.placeRandomTile();
    this.placeRandomTile();
  }

  restart() {
    this.start();
  }
}

module.exports = Game;
