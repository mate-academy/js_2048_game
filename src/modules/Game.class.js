'use strict';

class Game {
  constructor(initialState = null) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move();

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.reverse();
    this.moveLeft();
    this.reverse();
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  move() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const arr = this.board[row].filter((v) => v);

      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          this.score += arr[i];
          arr[i + 1] = 0;
        }
      }

      const merged = arr.filter((v) => v);

      while (merged.length < 4) {
        merged.push(0);
      }

      if (this.board[row].join() !== merged.join()) {
        moved = true;
      }

      this.board[row] = merged;
    }

    return moved;
  }

  reverse() {
    this.board = this.board.map((row) => row.reverse());
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  checkGameStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (this.canMove()) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
