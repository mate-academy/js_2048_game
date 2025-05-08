'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

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
    if (this.status === 'idle') {
      this.status = 'playing';
    }
  }

  restart() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  moveLeft() {
    this.makeMove(this.mergeRowLeft.bind(this));
  }

  moveRight() {
    this.makeMove((row) => this.mergeRowLeft(row.reverse()).reverse());
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

  makeMove(transformFn) {
    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const newRow = transformFn(this.board[i]);

      if (newRow.toString() !== this.board[i].toString()) {
        moved = true;
        this.board[i] = newRow;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  mergeRowLeft(row) {
    const newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    return newRow
      .filter((val) => val !== 0)
      .concat(Array(this.size).fill(0))
      .slice(0, this.size);
  }

  transpose() {
    const newBoard = this.createEmptyBoard();

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newBoard[j][i] = this.board[i][j];
      }
    }
    this.board = newBoard;
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

    if (emptyCells.length === 0) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const val = this.board[i][j];

        if (val === 0) {
          return true;
        }

        if (j < this.size - 1 && val === this.board[i][j + 1]) {
          return true;
        }

        if (i < this.size - 1 && val === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
