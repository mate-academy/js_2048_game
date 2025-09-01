'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

class Game {
  constructor(initialState) {
    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';

    if (!initialState) {
      this.addRandomTile();
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }

      if (emptyCells.length) {
        const [r, c] =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];

        this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
      }
    }
  }

  getState() {
    return this.board.map((row) => [...row]);
  }
  getScore() {
    return this.score;
  }
  getStatus() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return 'win';
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          this.status = 'playing';

          return 'playing';
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          this.status = 'playing';

          return 'playing';
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          this.status = 'playing';

          return 'playing';
        }
      }
    }

    this.status = 'lose';

    return 'lose';
  }

  processRow(row) {
    let arr = row.filter((v) => v !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
        this.score += arr[i];
      }
    }

    arr = arr.filter((v) => v !== 0);

    while (arr.length < 4) {
      arr.push(0);
    }

    return arr;
  }

  moveLeft() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      this.board[row] = this.processRow(this.board[row]);
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }
  }

  moveRight() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      const reversed = [...this.board[row]].reverse();
      const processed = this.processRow(reversed);

      this.board[row] = processed.reverse();
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }
  }
  moveUp() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const processed = this.processRow(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = processed[row];
      }
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }
  }
  moveDown() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const reversed = column.reverse();
      let processed = this.processRow(reversed);

      processed = processed.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = processed[row];
      }
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }
  }
  start() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }
  restart() {
    this.start();
  }
}
module.exports = Game;
