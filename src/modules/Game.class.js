'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();

    this.board = this.cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
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
    this.board = this.cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.makeMove((board) => board.map((row) => this.mergeRow(row)));
  }

  moveRight() {
    this.makeMove((board) => {
      return board.map((row) => this.mergeRow([...row].reverse()).reverse());
    });
  }

  moveUp() {
    this.makeMove((board) => {
      const t = this.transpose(board);

      return this.transpose(t.map((row) => this.mergeRow(row)));
    });
  }

  moveDown() {
    this.makeMove((board) => {
      const t = this.transpose(board);

      return this.transpose(
        t.map((row) => this.mergeRow([...row].reverse()).reverse()),
      );
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

  makeMove(transformFn) {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = transformFn(this.board);
    const changed = !this.boardsEqual(this.board, newBoard);

    if (changed) {
      this.board = newBoard;
      this.addRandomTile();
    }

    this.updateStatus();
  }

  updateStatus() {
    if (this.has2048()) {
      this.status = 'win';
    } else if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  mergeRow(row) {
    const filtered = row.filter((v) => v !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        this.score += merged;
        result.push(merged);
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  addRandomTile() {
    const empty = [];

    for (let rI = 0; rI < 4; rI++) {
      for (let cl = 0; cl < 4; cl++) {
        if (this.board[rI][cl] === 0) {
          empty.push([rI, cl]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [rowIndex, colIndex] =
      empty[Math.floor(Math.random() * empty.length)];

    this.board[rowIndex][colIndex] = Math.random() < 0.1 ? 4 : 2;
  }

  has2048() {
    return this.board.some((row) => row.includes(2048));
  }

  hasMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const v = this.board[row][col];

        if (v === 0) {
          return true;
        }

        if (col < 3 && v === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && v === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  boardsEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }
}

module.exports = Game;
