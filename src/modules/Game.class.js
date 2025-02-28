'use strict';

class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  appearRandomTile() {
    const emptyCellsCoord = [];
    const randomNumber = Math.random() > 0.9 ? 4 : 2;

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCellsCoord.push([rowIndex, cellIndex]);
        }
      });
    });

    if (emptyCellsCoord.length) {
      const randomIndex = Math.floor(Math.random() * emptyCellsCoord.length);
      const [rowCoord, cellCoord] = emptyCellsCoord[randomIndex];

      this.board[rowCoord][cellCoord] = randomNumber;
    }
  }

  shiftAndMerge(row) {
    const nonEmptyCells = row.filter((cell) => cell !== 0);
    const shiftRow = [];

    while (nonEmptyCells.length) {
      if (nonEmptyCells[0] === nonEmptyCells[1]) {
        shiftRow.push(nonEmptyCells[0] * 2);
        this.score += nonEmptyCells[0] * 2;
        nonEmptyCells.splice(0, 2);
      } else {
        shiftRow.push(nonEmptyCells[0]);
        nonEmptyCells.splice(0, 1);
      }
    }

    while (shiftRow.length < 4) {
      shiftRow.push(0);
    }

    return shiftRow;
  }

  moveLeft() {
    let hasMoved = false;

    const newBoard = this.board.map((row) => {
      const newRow = this.shiftAndMerge(row);

      hasMoved = hasMoved || newRow.toString() !== row.toString();

      return newRow;
    });

    if (hasMoved) {
      this.board = newBoard;
      this.appearRandomTile();
    }

    this.updateStatus();

    return hasMoved;
  }

  moveRight() {
    this.board.map((row) => row.reverse());

    const hasMoved = this.moveLeft();

    this.board.map((row) => row.reverse());

    return hasMoved;
  }

  rotateBoard(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  moveUp() {
    this.board = this.rotateBoard(this.board);

    const hasMoved = this.moveLeft();

    this.board = this.rotateBoard(this.board);

    return hasMoved;
  }

  moveDown() {
    this.board = this.rotateBoard(this.board);

    const hasMoved = this.moveRight();

    this.board = this.rotateBoard(this.board);

    return hasMoved;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.board.some((row) => row.includes(0))) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.appearRandomTile();
    this.appearRandomTile();
  }

  restart() {
    this.start();
  }
}

module.exports = Game;
