'use strict';

const { shiftAndMerge } = require('./mergeLogic.js');

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.hasWon = false;

    this.board = this.isValidBoard(initialState)
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();

    // Initial status check
    this.updateStatus();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  isValidBoard(board) {
    return (
      Array.isArray(board) &&
      board.length === this.size &&
      board.every(
        (row) =>
          Array.isArray(row) &&
          row.length === this.size &&
          row.every((cell) => Number.isInteger(cell) && cell >= 0),
      )
    );
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.hasWon = false;
    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.start();
  }

  handleMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board;
    const { board: newBoard, totalScore } = shiftAndMerge(prevBoard, direction);

    if (!this.boardsEqual(prevBoard, newBoard)) {
      this.board = newBoard;
      this.score += totalScore;

      // Check for win before spawning a tile
      if (!this.hasWon && this.board.flat().some((val) => val >= 2048)) {
        this.hasWon = true;
        this.status = 'win';

        return;
      }

      this.spawnTile();
      this.updateStatus();
    }
  }

  moveLeft() {
    this.handleMove('left');
  }

  moveRight() {
    this.handleMove('right');
  }

  moveUp() {
    this.handleMove('up');
  }

  moveDown() {
    this.handleMove('down');
  }

  canMove() {
    return ['up', 'down', 'left', 'right'].some((dir) => {
      const { board: moved } = shiftAndMerge(this.board, dir);

      return !this.boardsEqual(this.board, moved);
    });
  }

  spawnTile() {
    if (this.status !== 'playing') {
      return;
    }

    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  boardsEqual(b1, b2) {
    return b1.every((row, r) => row.every((val, c) => val === b2[r][c]));
  }

  updateStatus() {
    if (this.hasWon) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    } else if (this.status === 'idle') {
      this.status = 'playing';
    }
  }
}

module.exports = Game;
