/* eslint-disable function-paren-newline */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Game {
  constructor(initialState = null) {
    this.initialValue = initialState
      ? initialState.map((row) => [...row])
      : null;

    this.board = this.initialValue
      ? this.initialValue.map((row) => [...row])
      : this.createEmptyBoard();

    this.score = 0;
    this.status = 'idle';
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

  generateRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
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

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);

    this.board = this.board.map((row) => this.moveRowLeft(row));

    if (!this.areBoardsEqual(previousBoard, this.board)) {
      this.generateRandomTile();
    }
    this.checkGameStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);

    this.board = this.board.map((row) => this.moveRowRight(row));

    if (!this.areBoardsEqual(previousBoard, this.board)) {
      this.generateRandomTile();
    }
    this.checkGameStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);

    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);

    if (!this.areBoardsEqual(previousBoard, this.board)) {
      this.checkGameStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);

    this.board = this.transpose(this.board);
    this.moveRight();
    this.board = this.transpose(this.board);

    if (!this.areBoardsEqual(previousBoard, this.board)) {
      this.checkGameStatus();
    }
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  start() {
    this.status = 'playing';
    this.generateRandomTile();
    this.generateRandomTile();
  }

  restart() {
    this.board = this.initialValue
      ? this.initialValue.map((row) => [...row])
      : this.createEmptyBoard();

    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
