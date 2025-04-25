'use strict';

class Game {
  constructor(initialState) {
    if (!initialState) {
      this.board = [];
      this.size = 4;

      for (let i = 0; i < this.size; i++) {
        const numberNull = [];

        for (let j = 0; j < this.size; j++) {
          numberNull.push(0);
        }
        this.board.push(numberNull);
      }
    } else if (initialState && Array.isArray(initialState)) {
      this.board = initialState;
    }
    this.score = 0;
    this.status = 'idle';
  }

  prepareMove() {
    if (this.status !== 'playing' && this.status !== 'win') {
      return null;
    }

    const oldBoard = JSON.parse(JSON.stringify(this.board));

    return { oldBoard };
  }

  handleMove(oldBoard) {
    const hasChanged = this.board.some((row, i) => {
      return row.some((cell, j) => cell !== oldBoard[i][j]);
    });

    if (hasChanged) {
      this.allRandomTile();
    }

    const has2048 = this.board.some((row) => row.includes(2048));

    if (has2048 && this.status !== 'win') {
      this.status = 'win';
    }

    if (!this.canMove() && !has2048) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    const moveData = this.prepareMove();

    if (!moveData) {
      return;
    }

    const { oldBoard } = moveData;

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.processRow(this.board[i]);
    }

    this.handleMove(oldBoard);
  }

  moveRight() {
    const moveData = this.prepareMove();

    if (!moveData) {
      return;
    }

    const { oldBoard } = moveData;

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.processRow(this.board[i].reverse()).reverse();
    }

    this.handleMove(oldBoard);
  }

  moveUp() {
    const moveData = this.prepareMove();

    if (!moveData) {
      return;
    }

    const { oldBoard } = moveData;
    const transposed = [];

    for (let i = 0; i < 4; i++) {
      transposed[i] = [];

      for (let j = 0; j < 4; j++) {
        transposed[i][j] = this.board[j][i];
      }
    }

    for (let i = 0; i < 4; i++) {
      transposed[i] = this.processRow(transposed[i]);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = transposed[j][i];
      }
    }

    this.handleMove(oldBoard);
  }

  moveDown() {
    const moveData = this.prepareMove();

    if (!moveData) {
      return;
    }

    const { oldBoard } = moveData;
    const transposed = [];

    for (let i = 0; i < 4; i++) {
      transposed[i] = [];

      for (let j = 0; j < 4; j++) {
        transposed[i][j] = this.board[j][i];
      }
    }

    for (let i = 0; i < 4; i++) {
      transposed[i] = this.processRow(transposed[i].reverse()).reverse();
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = transposed[j][i];
      }
    }

    this.handleMove(oldBoard);
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 3; i++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
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

  allRandomTile() {
    const emptyTile = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyTile.push([i, j]);
        }
      }
    }

    if (emptyTile.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyTile.length);
    const [row, col] = emptyTile[randomIndex];
    const randomNumber = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = randomNumber;
  }

  start() {
    this.status = 'playing';
    this.score = 0;
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.allRandomTile();
    this.allRandomTile();
  }

  processRow(row) {
    const nonZero = row.filter((x) => x !== 0);
    const result = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
        result.push(nonZero[i] * 2);
        this.score += nonZero[i] * 2;
        i++;
      } else {
        result.push(nonZero[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  restart() {
    this.status = 'playing';
    this.score = 0;
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.allRandomTile();
    this.allRandomTile();
  }
}

module.exports = Game;
