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
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rows = 0; rows < 4; rows++) {
      for (let cols = 0; cols < 4; cols++) {
        if (this.board[rows][cols] === 0) {
          emptyCells.push({ rows, cols });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((val) => val !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow.splice(col + 1, 1);
          newRow.push(0);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (newRow.toString() !== this.board[row].toString()) {
        moved = true;
        this.board[row] = newRow;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());

    const moved = this.moveLeft();

    this.board.forEach((row) => row.reverse());

    return moved;
  }

  moveUp() {
    this.board = this.transpose(this.board);

    const moved = this.moveLeft();

    this.board = this.transpose(this.board);

    return moved;
  }

  moveDown() {
    this.board = this.transpose(this.board);

    const moved = this.moveRight();

    this.board = this.transpose(this.board);

    return moved;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
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
    this.addRandomTile();
    this.addRandomTile();
  }
}

module.exports = Game;
