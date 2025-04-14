'use strict';

class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.gameStatus = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slideAndMergeRow(row) {
    const nonZeroCells = row.filter((cell) => cell !== 0);
    const newRow = [];
    let score = 0;

    while (nonZeroCells.length > 0) {
      if (nonZeroCells[0] === nonZeroCells[1]) {
        newRow.push(nonZeroCells[0] * 2);
        score += nonZeroCells[0] * 2;
        nonZeroCells.splice(0, 2);
      } else {
        newRow.push(nonZeroCells[0]);
        nonZeroCells.splice(0, 1);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, score };
  }

  moveLeft() {
    let moved = false;
    let score = 0;

    const newBoard = this.board.map((row) => {
      const { newRow, score: rowScore } = this.slideAndMergeRow(row);

      score += rowScore;
      moved = moved || row.toString() !== newRow.toString();

      return newRow;
    });

    if (moved) {
      this.board = newBoard;
      this.score += score;
      this.addRandomTile();
    }

    this.updateGameStatus();

    return moved;
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => row.reverse());

    return moved;
  }

  moveUp() {
    this.board = this.transposeBoard(this.board);

    const moved = this.moveLeft();

    this.board = this.transposeBoard(this.board);

    return moved;
  }

  moveDown() {
    this.board = this.transposeBoard(this.board);

    const moved = this.moveRight();

    this.board = this.transposeBoard(this.board);

    return moved;
  }

  transposeBoard(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.board[row][col];

        if (cell === 0) {
          return true;
        }

        if (
          (col < 3 && cell === this.board[row][col + 1]) ||
          (row < 3 && cell === this.board[row + 1][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  updateGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    } else if (!this.hasAvailableMoves()) {
      this.gameStatus = 'lose';
    } else {
      this.gameStatus = 'playing';
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.gameStatus = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }
}

module.exports = Game;
