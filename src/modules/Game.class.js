'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'start';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
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

  generateRandomTile(count = 1) {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    for (let i = 0; i < count; i++) {
      if (emptyCells.length > 0) {
        const { row, col } = emptyCells.splice(
          Math.floor(Math.random() * emptyCells.length),
          1,
        )[0];

        this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
      }
    }
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  moveRowLeft(row) {
    const filteredRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        this.score += filteredRow[i];
        filteredRow[i + 1] = 0;
      }
    }

    const mergedRow = filteredRow.filter((cell) => cell !== 0);

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  moveLeft() {
    const previousBoard = this.board.map((row) => [...row]);

    this.board = this.board.map((row) => this.moveRowLeft(row));

    if (!this.areBoardsEqual(previousBoard, this.board)) {
      this.generateRandomTile(1);
    }
    this.checkGameStatus();
  }

  moveRight() {
    const previousBoard = this.board.map((row) => [...row]);

    this.board = this.board.map((row) => {
      const reversedRow = row.reverse();
      const movedRow = this.moveRowLeft(reversedRow);

      return movedRow.reverse();
    });

    if (!this.areBoardsEqual(previousBoard, this.board)) {
      this.generateRandomTile(1);
    }
    this.checkGameStatus();
  }

  moveUp() {
    const previousBoard = this.board.map((row) => [...row]);

    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);

    if (!this.areBoardsEqual(previousBoard, this.board)) {
      this.generateRandomTile(1);
    }
    this.checkGameStatus();
  }

  moveDown() {
    const previousBoard = this.board.map((row) => [...row]);

    this.board = this.transpose(this.board);
    this.moveRight();
    this.board = this.transpose(this.board);

    if (!this.areBoardsEqual(previousBoard, this.board)) {
      this.generateRandomTile(1);
    }
    this.checkGameStatus();
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  areBoardsEqual(board1, board2) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board1[row][col] !== board2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.generateRandomTile(2);
  }

  restart() {
    this.start();
  }
}

module.exports = Game;
