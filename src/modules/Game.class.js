'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.gameStatus = 'idle';
    this.board = initialState || this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    const changed = this.handleMove(this.board, false);

    if (changed) {
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  moveRight() {
    const changed = this.handleMove(this.board, true);

    if (changed) {
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  moveUp() {
    const transposed = this.transpose(this.board);
    const changed = this.handleMove(transposed, false);

    if (changed) {
      this.board = this.transpose(transposed);
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  moveDown() {
    const transposed = this.transpose(this.board);
    const changed = this.handleMove(transposed, true);

    if (changed) {
      this.board = this.transpose(transposed);
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    if (this.gameStatus === 'idle') {
      this.gameStatus = 'playing';
      this.board = this.createEmptyBoard();
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.score = 0;
    this.gameStatus = 'idle';
    this.start();
  }

  handleMove(grid, reverse) {
    let changed = false;

    for (let i = 0; i < this.size; i++) {
      const row = [...grid[i]];

      if (reverse) {
        row.reverse();
      }

      const filtered = row.filter((v) => v !== 0);

      for (let j = 0; j < filtered.length - 1; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] *= 2;
          this.score += filtered[j];
          filtered[j + 1] = 0;

          if (filtered[j] === 2048) {
            this.gameStatus = 'win';
          }
        }
      }

      const merged = filtered.filter((v) => v !== 0);
      const newRow = [...merged, ...Array(this.size - merged.length).fill(0)];

      if (reverse) {
        newRow.reverse();
      }

      if (!this.arraysEqual(newRow, grid[i])) {
        grid[i] = newRow;
        changed = true;
      }
    }

    return changed;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  arraysEqual(a, b) {
    return a.every((val, i) => val === b[i]);
  }

  addRandomTile() {
    const empty = [];

    for (let a = 0; a < this.size; a++) {
      for (let b = 0; b < this.size; b++) {
        if (this.board[a][b] === 0) {
          empty.push([a, b]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [i, j] = empty[Math.floor(Math.random() * empty.length)];

    this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  checkGameOver() {
    if (this.board.some((row) => row.includes(2048))) {
      return;
    }

    if (this.board.some((row) => row.includes(0))) {
      return;
    }

    const directions = [
      this.moveLeftPreview,
      this.moveRightPreview,
      this.moveUpPreview,
      this.moveDownPreview,
    ];

    if (directions.some((fn) => fn.call(this))) {
      return;
    }

    this.gameStatus = 'lose';
  }

  moveLeftPreview() {
    return this.board.some((row) => {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          return true;
        }
      }

      return false;
    });
  }

  moveRightPreview() {
    return this.moveLeftPreview();
  }

  moveUpPreview() {
    const transposed = this.transpose(this.board);

    return transposed.some((row) => {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          return true;
        }
      }

      return false;
    });
  }

  moveDownPreview() {
    return this.moveUpPreview();
  }
}

module.exports = Game;
