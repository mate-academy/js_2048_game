'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
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
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
    this.status = 'playing';
  }

  restart() {
    this.start();
  }

  moveLeft() {
    this.performMove(this.board, false);
  }

  moveRight() {
    const reversed = this.board.map((row) => [...row].reverse());

    this.performMove(reversed, true, true);
  }

  moveUp() {
    const transposed = this.transpose(this.board);

    this.performMove(transposed, false, false, true);
  }

  moveDown() {
    const transposed = this.transpose(this.board);
    const reversed = transposed.map((row) => [...row].reverse());

    this.performMove(reversed, true, true, true);
  }

  performMove(
    inputBoard,
    reversed = false,
    reReverse = false,
    transposed = false,
  ) {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = [];
    let moved = false;
    let scoreToAdd = 0;

    for (const row of inputBoard) {
      const { newRow, mergedScore, changed } = this.slideAndMerge(row);

      scoreToAdd += mergedScore;

      if (changed) {
        moved = true;
      }

      newBoard.push(newRow);
    }

    if (!moved) {
      return;
    }

    let resultBoard = newBoard;

    if (reReverse) {
      resultBoard = resultBoard.map((row) => row.reverse());
    }

    if (transposed) {
      resultBoard = this.transpose(resultBoard);
    }

    this.board = resultBoard;
    this.score += scoreToAdd;

    this.addRandomTile();
    this.updateStatus();
  }

  slideAndMerge(row) {
    const nonZero = row.filter((val) => val !== 0);
    const newRow = [];
    let score = 0;
    let skip = false;

    for (let i = 0; i < nonZero.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;

        newRow.push(merged);
        score += merged;
        skip = true;
      } else {
        newRow.push(nonZero[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    const changed = !this.arraysEqual(row, newRow);

    return { newRow, mergedScore: score, changed };
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  addRandomTile() {
    const empty = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((val, colIndex) => {
        if (val === 0) {
          empty.push({ i: rowIndex, j: colIndex });
        }
      });
    });

    if (empty.length === 0) {
      return;
    }

    const { i, j } = empty[Math.floor(Math.random() * empty.length)];

    this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    if (this.has2048()) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  has2048() {
    return this.board.some((row) => row.includes(2048));
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
