/* eslint-disable function-paren-newline */
'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'playing';
    this.board = initialState || this.createEmptyBoard();

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
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

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      let newRow = this.board[row].filter((val) => val !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow[col + 1] = 0;
        }
      }

      newRow = newRow.filter((val) => val !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (!moved && newRow.toString() !== this.board[row].toString()) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
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
      this.board.map((row) => row[colIndex]),
    );
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'won';

      return;
    }

    if (this.board.flat().includes(0)) {
      return;
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = this.board[row][col];

        if (
          (col < this.size - 1 && cell === this.board[row][col + 1]) ||
          (row < this.size - 1 && cell === this.board[row + 1][col])
        ) {
          return;
        }
      }
    }

    this.status = 'game_over';
  }

  start() {
    this.status = 'playing';
    this.score = 0;
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }
}

export default Game;
