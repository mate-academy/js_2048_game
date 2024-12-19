/* eslint-disable prettier/prettier */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState = null) {
    this.boardSize = 4; // Fixed 4x4 grid
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle'; // Possible values: 'idle', 'playing', 'win', 'lose'
  }

  createEmptyBoard() {
    return Array(this.boardSize)
      .fill()
      .map(() => Array(this.boardSize).fill(0));
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slide(row) {
    const filteredRow = row.filter((num) => num !== 0); // Remove all zeros
    const newRow = [];

    while (filteredRow.length > 0) {
      if (filteredRow.length > 1 && filteredRow[0] === filteredRow[1]) {
        newRow.push(filteredRow[0] * 2);
        this.score += filteredRow[0] * 2;
        filteredRow.splice(0, 2); // Remove the merged cells
      } else {
        newRow.push(filteredRow[0]);
        filteredRow.splice(0, 1);
      }
    }

    while (newRow.length < this.boardSize) {
      newRow.push(0);
    } // Fill with zeros

    return newRow;
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.slide(row));

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.slide(row.reverse()).reverse());

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
      this.checkGameState();
    }
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
      this.board.map((row) => row[colIndex]));
  }

  checkGameState() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    // Check for empty cells
    if (this.board.flat().includes(0)) {
      return true;
    }

    // Check for possible merges
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    for (let c = 0; c < this.boardSize; c++) {
      for (let r = 0; r < this.boardSize - 1; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
