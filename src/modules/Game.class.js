'use strict';

class Game {
  constructor(initialState) {
    this.board =
      initialState ||
      Array(4)
        .fill()
        .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
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
    this.board = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  moveLeft() {
    let moved = false;

    this.board = this.board.map((row) => {
      const filtered = row.filter((v) => v !== 0);
      const merged = Array(4).fill(false);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1] && !merged[i]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
          merged[i] = true;
          moved = true;
        }
      }

      const newRow = filtered.filter((v) => v !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (!moved && row.toString() !== newRow.toString()) {
        moved = true;
      }

      return newRow;
    });

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameState();
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
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

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push({ i, j });
        }
      });
    });

    if (emptyCells.length > 0) {
      const { i, j } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameState() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    const movesAvailable = this.board.some((row, i) => {
      row.some(
        (cell, j) =>
          cell === 0 ||
          (j < 3 && cell === this.board[i][j + 1]) ||
          (i < 3 && cell === this.board[i + 1][j]),
      );
    });

    if (!movesAvailable) {
      this.status = 'lose';
    }
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }
}

module.exports = Game;
