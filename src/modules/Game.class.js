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

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => row.slice());

    switch (direction) {
      case 'left':
        this.board = this.board.map(
          function (row) {
            return this.combineRow(row);
          }.bind(this),
        );
        break;
      case 'right':
        this.board = this.board.map(
          function (row) {
            return this.combineRow(row.reverse()).reverse();
          }.bind(this),
        );
        break;
      case 'up':
        this.board = this.transposeBoard(this.board).map(
          function (row) {
            return this.combineRow(row);
          }.bind(this),
        );
        this.board = this.transposeBoard(this.board);
        break;
      case 'down':
        this.board = this.transposeBoard(this.board).map(
          function (row) {
            return this.combineRow(row.reverse()).reverse();
          }.bind(this),
        );
        this.board = this.transposeBoard(this.board);
        break;
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  combineRow(row) {
    const newRow = row.filter((num) => num);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    const finalRow = newRow.filter((num) => num);

    while (finalRow.length < 4) {
      finalRow.push(0);
    }

    return finalRow;
  }

  transposeBoard(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!this.board[r][c]) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameOver() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (
          this.board[r][c] ===
          (this.board[r][c + 1] || (this.board[r + 1] && this.board[r + 1][c]))
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
