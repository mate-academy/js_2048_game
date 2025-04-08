/* eslint-disable function-paren-newline */
'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.state[row][col];

        if (row < 3 && this.state[row + 1][col] === value) {
          return true;
        }

        if (col < 3 && this.state[row][col + 1] === value) {
          return true;
        }
      }
    }

    return false;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.state[row].filter((cell) => cell !== 0);
      const merged = new Array(4).fill(false);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1] && !merged[i] && !merged[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
          merged[i] = true;
          moved = true;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (this.state[row].some((cell, idx) => cell !== newRow[idx])) {
        moved = true;
        this.state[row] = newRow;
      }
    }

    if (moved) {
      this.addRandomTile();

      if (this.checkWin()) {
        return true;
      }

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    return moved;
  }

  moveRight() {
    this.state = this.state.map((row) => [...row].reverse());

    const moved = this.moveLeft();

    this.state = this.state.map((row) => [...row].reverse());

    return moved;
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

  transpose() {
    this.state = this.state[0].map((_, col) =>
      this.state.map((row) => row[col]),
    );
  }
}

module.exports = Game;
