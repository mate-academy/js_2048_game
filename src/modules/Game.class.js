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
    this.size = 4;
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
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  moveLeft() {
    this.slideTiles('left');
  }

  moveRight() {
    this.slideTiles('right');
  }

  moveUp() {
    this.slideTiles('up');
  }

  moveDown() {
    this.slideTiles('down');
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slideTiles(direction) {
    const originalBoard = JSON.parse(JSON.stringify(this.board));

    if (direction === 'left') {
      for (let row = 0; row < this.size; row++) {
        this.board[row] = this.slideAndMergeRow(this.board[row]);
      }
    } else if (direction === 'right') {
      for (let row = 0; row < this.size; row++) {
        this.board[row] = this.slideAndMergeRow(
          this.board[row].reverse(),
        ).reverse();
      }
    } else if (direction === 'up') {
      this.board = this.transpose(this.board);

      for (let row = 0; row < this.size; row++) {
        this.board[row] = this.slideAndMergeRow(this.board[row]);
      }
      this.board = this.transpose(this.board);
    } else if (direction === 'down') {
      this.board = this.transpose(this.board);

      for (let row = 0; row < this.size; row++) {
        this.board[row] = this.slideAndMergeRow(
          this.board[row].reverse(),
        ).reverse();
      }
      this.board = this.transpose(this.board);
    }

    if (JSON.stringify(originalBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.status = 'win';
    } else if (!this.checkMovesAvailable()) {
      this.status = 'lose';
    }
  }

  slideAndMergeRow(row) {
    const filteredRow = row.filter((value) => value !== 0);
    const mergedRow = [];

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        mergedRow.push(filteredRow[i] * 2);
        this.score += filteredRow[i] * 2;
        i++;
      } else {
        mergedRow.push(filteredRow[i]);
      }
    }

    while (mergedRow.length < this.size) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkMovesAvailable() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (
          col < this.size - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.size - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
