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
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move((row) => this.mergeLeft(row));
  }
  moveRight() {
    this.move((row) => this.mergeRight(row));
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  move(transform) {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;
    const newBoard = this.board.map((row) => {
      const newRow = transform([...row]);

      if (newRow.toString() !== row.toString()) {
        changed = true;
      }

      return newRow;
    });

    if (changed) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  mergeLeft(row) {
    const nonZeroArray = row.filter((n) => n);
    const newRow = [0, 0, 0, 0];
    let index = 0;

    for (let i = 0; i < nonZeroArray.length; i++) {
      if (
        i < nonZeroArray.length - 1 &&
        nonZeroArray[i] === nonZeroArray[i + 1]
      ) {
        const merged = nonZeroArray[i] * 2;

        newRow[index] = merged;
        this.score += merged;
        i++;
      } else {
        newRow[index] = nonZeroArray[i];
      }
      index++;
    }

    return newRow;
  }

  mergeRight(row) {
    const nonZeroArray = row.filter((n) => n);
    const newRow = [0, 0, 0, 0];

    let index = 3;

    for (let i = nonZeroArray.length - 1; i >= 0; i--) {
      if (i > 0 && nonZeroArray[i] === nonZeroArray[i - 1]) {
        const merged = nonZeroArray[i] * 2;

        newRow[index] = merged;
        this.score += merged;
        i--;
      } else {
        newRow[index] = nonZeroArray[i];
      }
      index--;
    }

    return newRow;
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  addRandomTile() {
    const tile = Math.random() < 0.9 ? 2 : 4;
    const emptyCells = this.findEmpty();

    if (emptyCells.length > 0) {
      const random = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[random];

      this.board[row][col] = tile;
    }
  }

  findEmpty() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.board[row][col];

        if (cell === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.board[row][col];

        if (cell === 0) {
          return true;
        }

        if (col < 3 && cell === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && cell === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
