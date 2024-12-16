/* eslint-disable prettier/prettier */
'use strict';

export class Game {
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
    this.status = 'playing';
    this.spawnTile();
    this.spawnTile();
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
    this.start();
  }

  moveLeft() {
    this.performMove(this.shiftRowLeft.bind(this));
  }

  moveRight() {
    this.performMove(this.shiftRowRight.bind(this));
  }

  moveUp() {
    this.performMove(this.shiftColumnUp.bind(this));
  }

  moveDown() {
    this.performMove(this.shiftColumnDown.bind(this));
  }

  performMove(shiftFunction) {
    const oldBoard = JSON.stringify(this.board);

    this.board = shiftFunction();

    if (oldBoard !== JSON.stringify(this.board)) {
      this.spawnTile();
      this.updateStatus();
    }
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  hasMoves() {
    return (
      this.board.flat().includes(0) ||
      this.board.some((row, i) => row.some((cell, j) => this.canMerge(i, j)))
    );
  }

  canMerge(i, j) {
    const cell = this.board[i][j];

    return (
      (i > 0 && this.board[i - 1][j] === cell) ||
      (i < 3 && this.board[i + 1][j] === cell) ||
      (j > 0 && this.board[i][j - 1] === cell) ||
      (j < 3 && this.board[i][j + 1] === cell)
    );
  }

  spawnTile() {
    const emptyCells = [];

    this.board.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push([i, j]);
        }
      }));

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  shiftRowLeft() {
    return this.board.map((row) => this.mergeRow(row));
  }

  shiftRowRight() {
    return this.board.map((row) => this.mergeRow(row.reverse()).reverse());
  }

  shiftColumnUp() {
    return this.transpose(this.shiftRowLeft(this.transpose(this.board)));
  }

  shiftColumnDown() {
    return this.transpose(this.shiftRowRight(this.transpose(this.board)));
  }

  mergeRow(row) {
    const filteredRow = row.filter((num) => num !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        this.score += filteredRow[i];
        filteredRow[i + 1] = 0;
      }
    }

    return [
      ...filteredRow.filter((num) => num !== 0),
      ...Array(4 - filteredRow.filter((num) => num !== 0).length).fill(0),
    ];
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
}
