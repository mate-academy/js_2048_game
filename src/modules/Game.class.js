'use strict';

export default class Game {
  constructor(initialState) {
    this.gameBoard = initialState || this.createEmptyBoard();
    this.gameScore = 0;
    this.gameStatus = 'idle';
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  updateGameStatus() {
    if (this.gameBoard.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    } else if (this.isGameOver()) {
      this.gameStatus = 'lose';
    }
  }

  mergeRow(row) {
    const result = [];
    let skip = false;

    for (let i = 0; i < row.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (i + 1 < row.length && row[i] === row[i + 1]) {
        const merged = row[i] * 2;

        this.gameScore += merged;
        result.push(merged);
        skip = true;
      } else {
        result.push(row[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      const originalRow = [...this.gameBoard[r]];
      const nonZero = originalRow.filter((val) => val !== 0);
      const newRow = this.mergeRow(nonZero);

      if (!this.arraysEqual(originalRow, newRow)) {
        moved = true;
        this.gameBoard[r] = newRow;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.updateGameStatus();
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      const originalRow = [...this.gameBoard[r]];
      const reversed = originalRow
        .slice()
        .reverse()
        .filter((val) => val !== 0);
      const merged = this.mergeRow(reversed);
      const newRow = merged.reverse();

      if (!this.arraysEqual(originalRow, newRow)) {
        moved = true;
        this.gameBoard[r] = newRow;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.updateGameStatus();
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      const originalCol = this.gameBoard.map((row) => row[c]);
      const nonZero = originalCol.filter((val) => val !== 0);
      const merged = this.mergeRow(nonZero);

      if (!this.arraysEqual(originalCol, merged)) {
        moved = true;

        for (let r = 0; r < 4; r++) {
          this.gameBoard[r][c] = merged[r];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.updateGameStatus();
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      const originalCol = this.gameBoard.map((row) => row[c]);
      const reversed = originalCol
        .slice()
        .reverse()
        .filter((val) => val !== 0);
      const merged = this.mergeRow(reversed);
      const newCol = merged.reverse();

      if (!this.arraysEqual(originalCol, newCol)) {
        moved = true;

        for (let r = 0; r < 4; r++) {
          this.gameBoard[r][c] = newCol[r];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.updateGameStatus();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.gameBoard[r][c] === 0) {
          empty.push({ rr: r, cc: c });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const { rr, cc } = empty[Math.floor(Math.random() * empty.length)];

    this.gameBoard[rr][cc] = Math.random() < 0.9 ? 2 : 4;
  }

  getScore() {
    return this.gameScore;
  }

  getState() {
    return this.gameBoard;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.gameBoard = this.createEmptyBoard();
    this.gameStatus = 'playing';
    this.gameScore = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.gameBoard = this.createEmptyBoard();
    this.gameStatus = 'idle';
    this.gameScore = 0;
  }

  isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.gameBoard[r][c] === 0) {
          return false;
        }

        if (
          (r < 3 && this.gameBoard[r][c] === this.gameBoard[r + 1][c]) ||
          (c < 3 && this.gameBoard[r][c] === this.gameBoard[r][c + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
