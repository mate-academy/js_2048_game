'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
  }

  restart() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = [];
    let moved = false;

    for (const row of this.board) {
      let newRow = row.filter((v) => v !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }
      newRow = newRow.filter((v) => v !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }
      newBoard.push(newRow);

      if (newRow.join() !== row.join()) {
        moved = true;
      }
    }

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const original = this.cloneBoard(this.board);

    this.board = this.board.map((row) => row.slice().reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.slice().reverse());

    if (JSON.stringify(original) === JSON.stringify(this.board)) {
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const original = this.cloneBoard(this.board);

    this.transpose();
    this.moveLeft();
    this.transpose();

    if (JSON.stringify(original) === JSON.stringify(this.board)) {
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const original = this.cloneBoard(this.board);

    this.transpose();
    this.moveRight();
    this.transpose();

    if (JSON.stringify(original) === JSON.stringify(this.board)) {
      this.updateStatus();
    }
  }

  transpose() {
    const newBoard = this.createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        newBoard[r][c] = this.board[c][r];
      }
    }
    this.board = newBoard;
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
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

module.exports = Game;
