'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'start';
    this.board = this.createEmptyBoard();

    if (initialState) {
      this.board = initialState;
    } else {
      this.addRandomTitle();
      this.addRandomTitle();
    }
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTitle();
    this.addRandomTitle();
  }

  restart() {
    this.start();
  }

  addRandomTitle() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row: randRow, col: randCol } = emptyCells[randomIndex];

    this.board[randRow][randCol] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const newRow = this.compress(this.board[row]);
      const mergedRow = this.merge(newRow);
      const finalRow = this.compress(mergedRow);

      if (this.board[row].join(',') !== finalRow.join(',')) {
        moved = true;
        this.board[row] = finalRow;
      }
    }

    if (moved) {
      this.addRandomTitle();
      this.updateStatus();
    }
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
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

  compress(row) {
    return row
      .filter((val) => val !== 0)
      .concat(Array(this.size - row.filter((val) => val !== 0).length).fill(0));
  }

  merge(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row[i + 1] = 0;
      }
    }

    return row;
  }

  transpose() {
    const newBoard = this.createEmptyBoard();

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newBoard[i][j] = this.board[j][i];
      }
    }
    this.board = newBoard;
  }

  updateStatus() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}
