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
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.hasWon = false;
  }

  createEmptyBoard() {
    return Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
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

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.hasWon = false;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const previousBoard = this.copyBoard();
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const newRow = this.slideAndMergeLeft(this.board[row]);

      if (JSON.stringify(newRow) !== JSON.stringify(this.board[row])) {
        moved = true;
      }
      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }
  slideAndMergeLeft(row) {
    let filtered = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((cell) => cell !== 0);

    while (filtered.length < this.size) {
      filtered.push(0);
    }

    return filtered;
  }

  copyBoard() {
    return this.board.map((row) => [...row]);
  }

  checkGameStatus() {
    if (!this.hasWon) {
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          if (this.board[row][col] === 2048) {
            this.status = 'win';
            this.hasWon = true;

            return;
          }
        }
      }
    }

    if (this.getEmptyCells().length === 0 && !this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.board[row][col];

        if (col < this.size - 1 && current === this.board[row][col + 1]) {
          return true;
        }

        if (row < this.size - 1 && current === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  rotateBoard() {
    const newBoard = [];

    for (let col = 0; col < this.size; col++) {
      const newRow = [];

      for (let row = this.size - 1; row >= 0; row--) {
        newRow.push(this.board[row][col]);
      }
      newBoard.push(newRow);
    }
    this.board = newBoard;
  }

  rotateCounterClockwise() {
    const newBoard = [];

    for (let col = this.size - 1; col >= 0; col--) {
      const newRow = [];

      for (let row = 0; row < this.size; row++) {
        newRow.push(this.board[row][col]);
      }
      newBoard.push(newRow);
    }
    this.board = newBoard;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.rotateBoard();
    this.rotateBoard();
    this.moveLeft();
    this.rotateBoard();
    this.rotateBoard();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.rotateCounterClockwise();
    this.moveLeft();
    this.rotateBoard();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.rotateBoard();
    this.moveLeft();
    this.rotateCounterClockwise();
  }
}

export default Game;
