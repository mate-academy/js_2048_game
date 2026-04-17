'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i];

      const newRow = [];

      for (let j = 0; j < 4; j++) {
        if (row[j] !== 0) {
          newRow.push(row[j]);
        }
      }

      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow[j + 1] = 0;
        }
      }

      const finalRow = [];

      for (let j = 0; j < newRow.length; j++) {
        if (newRow[j] !== 0) {
          finalRow.push(newRow[j]);
        }
      }

      while (finalRow.length < 4) {
        finalRow.push(0);
      }

      if (row.join() !== finalRow.join()) {
        moved = true;
      }

      this.board[i] = finalRow;
    }

    if (moved) {
      this.addTile();
      this.checkGame();
    }
  }

  moveRight() {
    this.reverseRows();
    this.moveLeft();
    this.reverseRows();
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

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addTile();
    this.addTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  addTile() {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const rand = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[rand[0]][rand[1]] = value;
  }

  reverseRows() {
    for (let i = 0; i < 4; i++) {
      this.board[i].reverse();
    }
  }

  transpose() {
    const newBoard = [];

    for (let i = 0; i < 4; i++) {
      newBoard[i] = [];

      for (let j = 0; j < 4; j++) {
        newBoard[i][j] = this.board[j][i];
      }
    }

    this.board = newBoard;
  }

  checkGame() {
    for (let i = 0; i < 4; i++) {
      if (this.board[i].includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
