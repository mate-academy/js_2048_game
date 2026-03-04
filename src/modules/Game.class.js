'use strict';

class Game {
  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.status = 'idle';
    this.score = 0;

    this.board =
      initialState ||
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
  }

  moveLeft() {
    const boardBefore = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.mergeRow(row));

    if (boardBefore !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  moveRight() {
    const boardBefore = JSON.stringify(this.board);

    this.board = this.board.map((row) =>
      this.mergeRow(row.reverse()).reverse(),
    );

    if (boardBefore !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  moveUp() {
    const boardBefore = JSON.stringify(this.board);

    this.board = this.transpose().map((row) => this.mergeRow(row));
    this.board = this.transpose();

    if (boardBefore !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  moveDown() {
    const boardBefore = JSON.stringify(this.board);

    this.board = this.transpose().map((row) =>
      this.mergeRow(row.reverse()).reverse(),
    );
    this.board = this.transpose();

    if (boardBefore !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.checkStatus();
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

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    this.status = 'idle';
    this.score = 0;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomTile = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomCol] = emptyCells[randomTile];

    this.board[randomRow][randomCol] = Math.random() < 0.1 ? 4 : 2;
  }

  mergeRow(row) {
    const filtered = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered.splice(i + 1, 1);
        this.score += filtered[i];
      }
    }

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  transpose() {
    return this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );
  }

  hasNoMoves() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (
          row + 1 < this.board.length &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return false;
        }

        if (this.board[row][col] === 0) {
          return false;
        }

        if (
          col + 1 < this.board[row].length &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  checkStatus() {
    if (this.board.flat().some((cell) => cell === 2048)) {
      this.status = 'win';
    } else if (this.hasNoMoves()) {
      this.status = 'lose';
    }
  }
}

export default Game;
