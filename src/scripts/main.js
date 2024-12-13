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

  moveLeft() {
    let moved = false;

    for (const row of this.board) {
      const filteredRow = row.filter((num) => num !== 0);
      const newRow = [];

      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          newRow.push(filteredRow[i] * 2);
          this.score += filteredRow[i] * 2;
          i++;
          moved = true;
        } else {
          newRow.push(filteredRow[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (newRow.toString() !== row.toString()) {
        moved = true;
      }
      row.splice(0, 4, ...newRow);
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  moveUp() {
    this.transposeBoard();
    this.moveLeft();
    this.transposeBoard();
  }

  moveDown() {
    this.transposeBoard();
    this.moveRight();
    this.transposeBoard();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.status === 'win' || this.status === 'lose') {
      return this.status;
    }

    for (const row of this.board) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';

          return 'win';
        }
      }
    }

    if (this.isBoardFull() && !this.hasValidMoves()) {
      this.status = 'lose';

      return 'lose';
    }
    this.status = 'playing';

    return 'playing';
  }

  start() {
    this.resetBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  restart() {
    this.start();
    this.score = 0;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  transposeBoard() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[i][j] = this.board[j][i];
      }
    }
    this.board = newBoard;
  }

  isBoardFull() {
    return this.board.every((row) => row.every((cell) => cell !== 0));
  }

  hasValidMoves() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = this.board[i][j];

        if (
          (i > 0 && this.board[i - 1][j] === cell) ||
          (i < 3 && this.board[i + 1][j] === cell) ||
          (j > 0 && this.board[i][j - 1] === cell) ||
          (j < 3 && this.board[i][j + 1] === cell)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  resetBoard() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
}

module.exports = Game;
