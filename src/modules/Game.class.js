'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map(row => [...row])
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  reverseRows(board) {
    return board.map(row => [...row].reverse());
  }

  transposeBoard(board = null) {
    const b = board || this.board;
    return b[0].map((_, col) => b.map(row => row[col]));
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      let newRow = this.board[row].filter(val => val !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          newRow[col + 1] = 0;
          this.score += newRow[col];
        }
      }

      newRow = newRow.filter(val => val !== 0);
      while (newRow.length < this.size) newRow.push(0);

      if (newRow.toString() !== this.board[row].toString()) {
        moved = true;
        this.board[row] = newRow;
      }
    }

    if (moved) {
      this.createRandomTile();
    }

    this.updateStatus();
    return moved;
  }

  moveRight() {
    this.board = this.reverseRows(this.board);
    const moved = this.moveLeft();
    this.board = this.reverseRows(this.board);
    return moved;
  }

  moveUp() {
    this.board = this.transposeBoard();
    const moved = this.moveLeft();
    this.board = this.transposeBoard(this.board);
    return moved;
  }

  moveDown() {
    this.board = this.transposeBoard();
    const moved = this.moveRight();
    this.board = this.transposeBoard(this.board);
    return moved;
  }

  updateStatus() {
    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }

  checkWin() {
    return this.board.some(row => row.includes(2048));
  }

  checkLose() {
    if (this.board.some(row => row.includes(0))) return false;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];
        if (
          (r > 0 && this.board[r - 1][c] === val) ||
          (r < this.size - 1 && this.board[r + 1][c] === val) ||
          (c > 0 && this.board[r][c - 1] === val) ||
          (c < this.size - 1 && this.board[r][c + 1] === val)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map(row => [...row]);
  }

  getStatus() {
    return this.status;
  }

  initGame() {
    this.board = this.createEmptyBoard();
    this.createRandomTile();
    this.createRandomTile();
    this.score = 0;
    this.status = 'playing';
  }

  start() {
    this.initGame();
  }

  restart() {
    this.initGame();
  }

  randomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  generateCellValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  createRandomTile() {
    const emptyCells = [];
    this.board.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === 0) emptyCells.push({ r, c });
      })
    );

    if (emptyCells.length === 0) return;

    const { r, c } = emptyCells[this.randomNumber(emptyCells.length - 1)];
    this.board[r][c] = this.generateCellValue();
  }
}
