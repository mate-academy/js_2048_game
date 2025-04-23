'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.board = initialState || this.createEmptyBoard();
    this.hasMoved = false;

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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

  start() {
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  moveLeft() {
    this.handleMove(this.mergeLeft.bind(this));
  }

  moveRight() {
    this.handleMove((board) => {
      return this.reverse(this.mergeLeft(this.reverse(board)));
    });
  }

  moveUp() {
    this.handleMove((board) => {
      return this.transpose(this.mergeLeft(this.transpose(board)));
    });
  }

  moveDown() {
    this.handleMove((board) => {
      return this.transpose(
        this.reverse(this.mergeLeft(this.reverse(this.transpose(board)))),
      );
    });
  }

  handleMove(mergeFunction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.copyBoard(this.board);
    const newBoard = mergeFunction(this.copyBoard(this.board));

    if (!this.boardsEqual(oldBoard, newBoard)) {
      this.board = newBoard;
      this.addRandomTile();
      this.updateGameStatus();
    }
  }

  mergeLeft(board) {
    const newBoard = [];

    for (const row of board) {
      const newRow = row.filter((val) => val !== 0);
      const mergedRow = [];

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      while (mergedRow.length < this.size) {
        mergedRow.push(0);
      }
      newBoard.push(mergedRow);
    }

    return newBoard;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ r: row, c: col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  updateGameStatus() {
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

  copyBoard(board) {
    return board.map((row) => [...row]);
  }

  reverse(board) {
    return board.map((row) => row.slice().reverse());
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  boardsEqual(a, b) {
    return a.every((row, i) => row.every((val, j) => val === b[i][j]));
  }
}

module.exports = Game;
