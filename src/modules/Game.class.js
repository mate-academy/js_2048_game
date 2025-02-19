'use strict';

class Game {
  constructor() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  addRandomTile() {
    let hasFreeTiles = false;
    let found = false;
    const value = Math.random() < 0.9 ? 2 : 4;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; ++c) {
        if (this.board[r][c] === 0) {
          hasFreeTiles = true;
        }
      }
    }

    if (hasFreeTiles === false) {
      return;
    }

    while (found === false) {
      const randomRow = Math.floor(Math.random() * 4);
      const randomCol = Math.floor(Math.random() * 4);

      if (this.board[randomRow][randomCol] === 0) {
        this.board[randomRow][randomCol] = value;

        found = true;
      }
    }
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let newRow = this.board[r].filter((tile) => tile !== 0);

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
          moved = true;
        }
      }

      newRow = newRow.filter((tile) => tile !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (!this.board[r].every((val, i) => val === newRow[i])) {
        moved = true;
      }

      this.board[r] = newRow;
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let newRow = this.board[r].filter((tile) => tile !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      for (let i = 3; i > 0; i--) {
        if (newRow[i] === newRow[i - 1] && newRow[i] !== 0) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i - 1] = 0;
          moved = true;
        }
      }

      newRow = newRow.filter((tile) => tile !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      if (!this.board[r].every((val, i) => val === newRow[i])) {
        moved = true;
      }

      this.board[r] = newRow;
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      const newCol = [];

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== 0) {
          newCol.push(this.board[r][c]);
        }
      }

      const merged = [];

      for (let i = 0; i < newCol.length; i++) {
        if (newCol[i] === newCol[i + 1] && !merged.includes(i)) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol.splice(i + 1, 1);
          merged.push(i);
          moved = true;
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== newCol[r]) {
          moved = true;
        }

        this.board[r][c] = newCol[r];
      }
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      const newCol = [];

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== 0) {
          newCol.push(this.board[r][c]);
        }
      }

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      const merged = [];

      for (let i = 3; i > 0; i--) {
        if (newCol[i] === newCol[i - 1] && !merged.includes(i)) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol.splice(i - 1, 1);
          newCol.unshift(0);
          merged.push(i);
          moved = true;
        }
      }

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== newCol[r]) {
          moved = true;
        }

        this.board[r][c] = newCol[r];
      }
    }

    return moved;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return {
      board: this.board,
      score: this.score,
      status: this.status,
    };
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  hasWon() {
    return this.board.some((row) => row.includes(2048));
  }

  hasLost() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return false;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
