'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = this.copyBoard(initialState);
    this.board = this.copyBoard(initialState);
    this.score = 0;
    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.copyBoard(this.board);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.board = this.copyBoard(this.initialState);
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.status = 'idle';
    this.board = this.copyBoard(this.initialState);
    this.score = 0;
  }

  moveLeft() {
    this.performMove((board) => this.merge(board));
  }

  moveRight() {
    this.performMove((board) => this.reverse(this.merge(this.reverse(board))));
  }

  moveUp() {
    this.performMove((board) => {
      const transposed = this.transpose(board);
      const merged = this.merge(transposed);

      return this.transpose(merged);
    });
  }

  moveDown() {
    this.performMove((board) => {
      const transposed = this.transpose(board);
      const reversed = this.reverse(transposed);
      const merged = this.merge(reversed);
      const restored = this.reverse(merged);

      return this.transpose(restored);
    });
  }

  performMove(moveFn) {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.copyBoard(this.board);

    this.board = moveFn(this.board);

    if (!this.areBoardsEqual(this.board, prevBoard)) {
      this.addRandomTile();
    }

    if (this.has2048()) {
      this.status = 'win';
    } else if (this.isGameOver()) {
      this.status = 'lose';
    }
  }

  areBoardsEqual(b1, b2) {
    return b1.every((row, r) => row.every((val, c) => val === b2[r][c]));
  }

  merge(board) {
    return board.map((row) => {
      const filtered = row.filter((n) => n !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      return filtered;
    });
  }

  transpose(board) {
    return board[0].map((_, col) => board.map((row) => row[col]));
  }

  reverse(board) {
    return board.map((row) => [...row].reverse());
  }

  copyBoard(board) {
    return board.map((row) => [...row]);
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  has2048() {
    return this.board.flat().includes(2048);
  }

  isGameOver() {
    if (this.board.flat().includes(0)) {
      return false;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const curr = this.board[r][c];

        if (
          (r < 3 && curr === this.board[r + 1][c]) ||
          (c < 3 && curr === this.board[r][c + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
