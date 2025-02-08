'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
    this.prevBoard = null;
  }

  createEmptyBoard() {
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

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomNumber();
    this.addRandomNumber();
  }

  restart() {
    this.status = 'idle';
    this.score = 0;
    this.board = this.createEmptyBoard();
  }

  // Moves
  moveLeft() {
    this.makeMove('left');
  }

  moveRight() {
    this.makeMove('right');
  }

  moveUp() {
    this.makeMove('up');
  }

  moveDown() {
    this.makeMove('down');
  }

  // Implements the game move logic
  makeMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    // Save a copy of the board for comparisons
    this.prevBoard = JSON.stringify(this.board);

    // Transpose or reverse board based on the move direction
    if (direction === 'up' || direction === 'down') {
      this.board = this.transpose(this.board);
    }

    if (direction === 'right' || direction === 'down') {
      this.board = this.board.map((row) => row.reverse());
    }

    // Perform the shift and merge logic
    this.board = this.board.map((row) => this.mergeRow(this.shiftRow(row)));

    // Reverse transformations to return board to its original state
    if (direction === 'right' || direction === 'down') {
      this.board = this.board.map((row) => row.reverse());
    }

    if (direction === 'up' || direction === 'down') {
      this.board = this.transpose(this.board);
    }

    // Check if the board has changed
    if (this.prevBoard !== JSON.stringify(this.board)) {
      this.addRandomNumber();
      this.checkGameStatus();
    }
  }

  // Shift a row to the left (remove all empty cells)
  shiftRow(row) {
    const filteredRow = row.filter((cell) => cell !== 0);

    return [...filteredRow, ...Array(this.size - filteredRow.length).fill(0)];
  }

  // Merge adjacent tiles in a row
  mergeRow(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2; // Merge tiles
        row[i + 1] = 0; // Clear merged tile
        this.score += row[i]; // Add score
      }
    }

    return this.shiftRow(row); // Re-shift row after merging
  }

  // Add a random number (2 or 4) to the board
  addRandomNumber() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  // Transpose a matrix (swap rows with columns)
  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  // Check if a move is possible (any merges or empty cells)
  canMakeMove() {
    if (this.board.some((row) => row.includes(0))) {
      return true;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        } // Horizontal

        if (this.board[j][i] === this.board[j + 1][i]) {
          return true;
        } // Vertical
      }
    }

    return false;
  }

  // Check the game state (win or lose)
  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMakeMove()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
