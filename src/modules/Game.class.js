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
    this.status = `idle`;
  }

  transposeBoard() {
    this.board = this.board[0].map(
      (_, colIndex) => this.board.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );
  }

  moveLeft() {
    const newBoard = this.board.map((row) => {
      const filteredRow = row.filter((cell) => cell > 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      return filteredRow;
    });

    if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
      this.board = newBoard;
      this.generateRandomTile();
    }
  }

  moveRight() {
    this.board = this.board.map((row) => row?.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row?.reverse());
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
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.generateRandomTile();
    this.generateRandomTile();
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

    this.generateRandomTile();
    this.generateRandomTile();

    this.status = 'playing';
  }

  generateRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push([i, j]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[x][y] = Math.random() < 0.1 ? 4 : 2;
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  updateBoard() {
    if (!this.canMove()) {
      this.status = 'lose';
    }

    this.board.forEach((row) => {
      if (row.find((el) => el === 2048)) {
        this.status = 'win';
      }
    });
  }
}

module.exports = Game;
