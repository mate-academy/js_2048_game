'use strict';

export default class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle'; // idle | playing | win | lose

    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();
  }

  /* ================== PUBLIC API ================== */

  getState() {
    return this.cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';
    this.board = this.createEmptyBoard();
  }

  moveLeft() {
    return this.makeMove((row) => this.mergeLine(row));
  }

  moveRight() {
    return this.makeMove((row) => this.mergeLine([...row].reverse()).reverse());
  }

  moveUp() {
    return this.makeMove(
      (_, colIndex) => this.mergeLine(this.getColumn(colIndex)),
      true,
    );
  }

  moveDown() {
    return this.makeMove(
      (_, colIndex) =>
        this.mergeLine(this.getColumn(colIndex).reverse()).reverse(),
      true,
    );
  }

  /* ================== CORE LOGIC ================== */

  makeMove(processLine, isVertical = false) {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newBoard = this.createEmptyBoard();

    for (let i = 0; i < this.size; i++) {
      const line = processLine(this.board[i], i);

      for (let j = 0; j < this.size; j++) {
        const value = line[j];

        if (isVertical) {
          newBoard[j][i] = value;

          if (value !== this.board[j][i]) {
            moved = true;
          }
        } else {
          newBoard[i][j] = value;

          if (value !== this.board[i][j]) {
            moved = true;
          }
        }
      }
    }

    if (!moved) {
      return false;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  mergeLine(line) {
    const filtered = line.filter((x) => x !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        this.score += merged;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return result;
  }

  /* ================== HELPERS ================== */

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  getColumn(index) {
    return this.board.map((row) => row[index]);
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

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

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (
          this.board[i][j] === this.board[i]?.[j + 1] ||
          this.board[i][j] === this.board[i + 1]?.[j]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
