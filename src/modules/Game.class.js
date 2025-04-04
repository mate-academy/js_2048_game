/* eslint-disable no-shadow */
/* eslint-disable function-paren-newline */
'use strict';

export class Game {
  constructor() {
    this.size = 4;
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing'; // playing, won, lost
    this.addRandomTile();
    this.addRandomTile();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(null));
  }

  addRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === null) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let newRow = this.board[r].filter((val) => val !== null);

      for (let c = newRow.length - 1; c > 0; c--) {
        if (newRow[c] === newRow[c - 1]) {
          newRow[c] *= 2;
          newRow[c - 1] = null;
          this.score += newRow[c];
          moved = true;
        }
      }
      newRow = newRow.filter((val) => val !== null);

      while (newRow.length < this.size) {
        newRow.unshift(null);
      }

      if (this.board[r].join() !== newRow.join()) {
        moved = true;
      }
      this.board[r] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      let newCol = [];

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== null) {
          newCol.push(this.board[r][c]);
        }
      }

      for (let r = 0; r < newCol.length - 1; r++) {
        if (newCol[r] === newCol[r + 1]) {
          newCol[r] *= 2;
          newCol[r + 1] = null;
          this.score += newCol[r];
          moved = true;
        }
      }
      newCol = newCol.filter((val) => val !== null);

      while (newCol.length < this.size) {
        newCol.push(null);
      }

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          moved = true;
        }
        this.board[r][c] = newCol[r];
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      let newCol = [];

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== null) {
          newCol.push(this.board[r][c]);
        }
      }

      for (let r = newCol.length - 1; r > 0; r--) {
        if (newCol[r] === newCol[r - 1]) {
          newCol[r] *= 2;
          newCol[r - 1] = null;
          this.score += newCol[r];
          moved = true;
        }
      }
      newCol = newCol.filter((val) => val !== null);

      while (newCol.length < this.size) {
        newCol.unshift(null);
      }

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          moved = true;
        }
        this.board[r][c] = newCol[r];
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let newRow = this.board[r].filter((val) => val !== null);

      for (let c = 0; c < newRow.length - 1; c++) {
        if (newRow[c] === newRow[c + 1]) {
          newRow[c] *= 2;
          newRow[c + 1] = null;
          this.score += newRow[c];
          moved = true;
        }
      }
      newRow = newRow.filter((val) => val !== null);

      while (newRow.length < this.size) {
        newRow.push(null);
      }

      if (this.board[r].join() !== newRow.join()) {
        moved = true;
      }
      this.board[r] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkGameOver() {
    return (
      !this.board.some((row) => row.includes(null)) &&
      !this.board.some((row, r) =>
        row.some(
          (val, c) =>
            (c < this.size - 1 && val === row[c + 1]) ||
            (r < this.size - 1 && val === this.board[r + 1][c]),
        ),
      )
    );
  }
}
