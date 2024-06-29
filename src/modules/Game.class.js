'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
    this.size = this.board.length;
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyTiles.push({ row, col });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { row, col } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    let move = false;

    for (let row = 0; row < this.size; row++) {
      const newRow = this.board[row].filter((value) => value);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow.splice(col + 1, 1);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (!this.board[row].every((value, index) => value === newRow[index])) {
        this.board[row] = newRow;
        move = true;
      }

      if (move) {
        this.addRandomTile();
        this.checkGameOver();
      }
    }
  }
  moveRight() {
    let move = false;

    for (let row = 0; row < this.size; row++) {
      const newRow = this.board[row].filter((value) => value).reverse();

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow.splice(col + 1, 1);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      newRow.reverse();

      if (!this.board[row].every((value, index) => value === newRow[index])) {
        this.board[row] = newRow;
        move = true;
      }
    }

    if (move) {
      this.addRandomTile();
      this.checkGameOver();
    }
  }
  moveUp() {
    let move = false;

    for (let col = 0; col < this.size; col++) {
      const newCol = [];

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let row = 0; row < newCol.length - 1; row++) {
        if (newCol[row] === newCol[row + 1]) {
          newCol[row] *= 2;
          this.score += newCol[row];
          newCol.splice(row + 1, 1);
        }
      }

      while (newCol.length < this.size) {
        newCol.push(0);
      }

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];
          move = true;
        }
      }
    }

    if (move) {
      this.addRandomTile();
      this.checkGameOver();
    }
  }
  moveDown() {
    let move = false;

    for (let col = 0; col < this.size; col++) {
      const newCol = [];

      for (let row = 3; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let row = 0; row < newCol.length - 1; row++) {
        if (newCol[row] === newCol[row + 1]) {
          newCol[row] *= 2;
          this.score += newCol[row];
          newCol.splice(row + 1, 1);
        }
      }

      while (newCol.length < this.size) {
        newCol.push(0);
      }

      newCol.reverse();

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];
          move = true;
        }
      }
    }

    if (move) {
      this.addRandomTile();
      this.checkGameOver();
    }
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
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    return this.start();
  }

  checkGameOver() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }
}

module.exports = Game;
