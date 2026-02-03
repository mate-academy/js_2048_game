'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;

    this.initialState = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();

    this.restart();
  }

  /* =======================
     Required public API
  ======================= */

  moveLeft() {
    return this.makeMove(board =>
      board.map(row => this.mergeRow(row)),
    );
  }

  moveRight() {
    return this.makeMove(board =>
      board.map(row => this.mergeRow([...row].reverse()).reverse()),
    );
  }

  moveUp() {
    return this.makeMove(board => {
      const rotated = this.rotateLeft(board);
      const moved = rotated.map(row => this.mergeRow(row));
      return this.rotateRight(moved);
    });
  }

  moveDown() {
    return this.makeMove(board => {
      const rotated = this.rotateRight(board);
      const moved = rotated.map(row => this.mergeRow(row));
      return this.rotateLeft(moved);
    });
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.board = this.cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  /* =======================
     Game engine internals
  ======================= */

  makeMove(transformFn) {
    if (this.status !== 'playing') {
      return false;
    }

    const newBoard = transformFn(this.cloneBoard(this.board));

    if (!this.boardsEqual(this.board, newBoard)) {
      this.board = newBoard;
      this.spawnTile();
      this.updateStatus();
      return true;
    }

    return false;
  }

  mergeRow(row) {
    const filtered = row.filter(value => value !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;
        result.push(merged);
        this.score += merged;
        i += 1;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return result;
  }

  /* =======================
     Board utilities
  ======================= */

  createEmptyBoard() {
    return Array.from({ length: this.size }, () =>
      Array(this.size).fill(0),
    );
  }

  cloneBoard(board) {
    return board.map(row => [...row]);
  }

  boardsEqual(boardA, boardB) {
    return boardA.every((row, i) =>
      row.every((cell, j) => cell === boardB[i][j]),
    );
  }

  // 90° counter-clockwise
  rotateLeft(board) {
    return board[0].map((_, i) =>
      board.map(row => row[row.length - 1 - i]),
    );
  }

  // 90° clockwise
  rotateRight(board) {
    return board[0].map((_, i) =>
      board.map(row => row[i]).reverse(),
    );
  }

  /* =======================
     Game state checks
  ======================= */

  spawnTile() {
    const emptyCells = [];

    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push([i, j]);
        }
      });
    });

    if (!emptyCells.length) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  hasMoves() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (
          j < this.size - 1 &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return true;
        }

        if (
          i < this.size - 1 &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
