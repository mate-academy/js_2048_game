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
    this.addRandomTile();
    this.addRandomTile();
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

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const tileValue = Math.random() < 0.1 ? 4 : 2;

    this.board[randomCell.i][randomCell.j] = tileValue;
  }

  moveLeft() {
    const oldBoard = this.board.map((row) => row.slice());

    this.board.forEach((row, rowIndex) => {
      const newRow = row.filter((val) => val);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }
      this.board[rowIndex] = newRow;
    });

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.board.forEach((row, rowIndex) => {
      this.board[rowIndex] = row.reverse();
    });
    this.moveLeft();

    this.board.forEach((row, rowIndex) => {
      this.board[rowIndex] = row.reverse();
    });
  }

  moveUp() {
    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);
  }

  moveDown() {
    this.board = this.transpose(this.board);
    this.moveRight();
    this.board = this.transpose(this.board);
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
    this.score = 0;
    this.status = 'idle';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addRandomTile();
    this.addRandomTile();
  }

  checkGameStatus() {
    const isWin = this.board.flat().includes(2048);

    if (isWin) {
      this.status = 'win';
    } else if (
      this.board.flat().every((cell) => cell !== 0) &&
      !this.hasValidMoves()
    ) {
      this.status = 'lose';
    }
  }

  hasValidMoves() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
