'use strict';

export class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'notStarted'; // 'notStarted', 'playing', 'won', 'lost'
    this.board = initialState || this.createEmptyBoard();
    this.hasMoved = false; // для перевірки, чи рух можливий
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;
    this.board = this.createEmptyBoard();
    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.start();
  }

  addRandomCell() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  checkWin() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'won';

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    if (this.hasEmptyCell()) {
      return false;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (
          (r < this.size - 1 && this.board[r + 1][c] === val) ||
          (c < this.size - 1 && this.board[r][c + 1] === val)
        ) {
          return false;
        }
      }
    }
    this.status = 'lost';

    return true;
  }

  hasEmptyCell() {
    return this.board.some((row) => row.includes(0));
  }

  // --- рухи ---
  moveLeft() {
    return this.move((row) => this.compressAndMerge(row));
  }

  moveRight() {
    return this.move((row) => {
      const reversed = [...row].reverse();
      const merged = this.compressAndMerge(reversed);

      return merged.reverse();
    });
  }

  moveUp() {
    this.transpose();

    const moved = this.moveLeft();

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();

    const moved = this.moveRight();

    this.transpose();

    return moved;
  }

  // --- допоміжні методи ---
  move(transformRow) {
    if (this.status !== 'playing') {
      return false;
    }

    this.hasMoved = false;

    for (let r = 0; r < this.size; r++) {
      const newRow = transformRow(this.board[r]);

      if (!this.arraysEqual(this.board[r], newRow)) {
        this.board[r] = newRow;
        this.hasMoved = true;
      }
    }

    if (this.hasMoved) {
      this.addRandomCell();
      this.checkWin();
      this.checkLose();
    }

    return this.hasMoved;
  }

  compressAndMerge(row) {
    const nonZero = row.filter((v) => v !== 0);
    const newRow = [];
    let skip = false;

    for (let i = 0; i < nonZero.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;

        newRow.push(merged);
        this.score += merged;
        skip = true;
      } else {
        newRow.push(nonZero[i]);
      }
    }

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  transpose() {
    const newBoard = this.createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        newBoard[r][c] = this.board[c][r];
      }
    }
    this.board = newBoard;
  }

  arraysEqual(a, b) {
    return a.every((v, i) => v === b[i]);
  }
}
