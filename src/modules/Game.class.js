/* eslint-disable function-paren-newline */
/* eslint-disable comma-dangle */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'ready';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(null));
  }

  spawnTile() {
    const emptyCells = [];

    this.board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (!cell) {
          emptyCells.push({ rowIndex: rIndex, colIndex: cIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { rowIndex, colIndex } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[rowIndex][colIndex] = Math.random() < 0.1 ? 4 : 2;
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

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === null) {
          return true;
        }

        if (
          (col < 3 && this.board[row][col] === this.board[row][col + 1]) ||
          (row < 3 && this.board[row][col] === this.board[row + 1][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  slideAndMerge(row) {
    const filteredRow = row.filter((val) => val !== null);
    const mergedRow = [];
    let skip = false;

    for (let i = 0; i < filteredRow.length; i++) {
      if (
        !skip &&
        i < filteredRow.length - 1 &&
        filteredRow[i] === filteredRow[i + 1]
      ) {
        mergedRow.push(filteredRow[i] * 2);
        this.score += filteredRow[i] * 2;
        skip = true;
      } else {
        mergedRow.push(filteredRow[i]);
        skip = false;
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(null);
    }

    return mergedRow;
  }
  moveLeft() {
    const previousState = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.slideAndMerge(row));

    if (JSON.stringify(this.board) !== previousState) {
      this.spawnTile();
      this.checkGameOver();
    }
  }
  moveRight() {
    const previousState = JSON.stringify(this.board);

    this.board = this.board.map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.slideAndMerge(row.slice().reverse()).reverse());

    if (JSON.stringify(this.board) !== previousState) {
      this.spawnTile();
      this.checkGameOver();
    }
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }
  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }
  transpose() {
    this.board = this.board[0].map((_, colIndex) =>
      // eslint-disable-next-line prettier/prettier
      this.board.map((row) => row[colIndex]));
  }
  checkGameOver() {
    if (!this.canMove()) {
      this.status = 'lost';
    } else if (this.board.flat().includes(2048)) {
      this.status = 'won';
    }
  }
  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'in_progress';
    this.spawnTile();
    this.spawnTile();
  }
  restart() {
    this.start();
  }
}
