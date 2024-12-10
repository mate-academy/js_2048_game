/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState = this.createEmptyBoard()) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  moveLeft() {
    let moved = false;

    for (const row of this.board) {
      let newRow = row.filter((val) => val);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
          moved = true;
        }
      }
      newRow = newRow.filter((val) => val);

      while (newRow.length < 4) {
        newRow.push(0);
      }
      row.splice(0, 4, ...newRow);
    }

    if (moved) {
      this.addRandomTile();
      this.gameStatus();
    }
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row].filter((val) => val).reverse();

      while (newRow.length < 4) {
        newRow.push(0);
      }

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
          moved = true;
        }
      }
      newRow = newRow.filter((val) => val).reverse();

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      if (this.board[row].join() !== newRow.join()) {
        this.board[row] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.gameStatus();
    }
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      let newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newCol[i + 1] = 0;
          this.score += newCol[i];
          moved = true;
        }
      }

      newCol = newCol.filter((val) => val);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.gameStatus();
    }
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      let newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let i = newCol.length - 1; i > 0; i--) {
        if (newCol[i] === newCol[i - 1]) {
          newCol[i] *= 2;
          newCol[i - 1] = 0;
          this.score += newCol[i];
          moved = true;
        }
      }

      newCol = newCol.filter((val) => val);

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.gameStatus();
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (this.board[row][cell] === 0) {
          emptyTiles.push({ row, cell });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { row, cell } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.board[row][cell] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  gameStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (this.board[row][cell] === 0) {
          return;
        }

        if (row > 0 && this.board[row][cell] === this.board[row - 1][cell]) {
          return;
        }

        if (cell > 0 && this.board[row][cell] === this.board[row][cell - 1]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
