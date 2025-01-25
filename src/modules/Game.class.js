'use strict';

export default class Game {
  constructor(initialState) {
    this.score = 0;
    this.bestScore = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = initialState;
    } else {
      this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const filteredRow = row.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
          filteredRow.push(0);
        }
      }

      return [
        ...filteredRow,
        ...Array(row.length - filteredRow.length).fill(0),
      ];
    });

    this._postMoveHandler(prevState);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const filteredRow = row.filter((num) => num !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i - 1, 1);
          filteredRow.unshift(0);
        }
      }

      return [
        ...Array(row.length - filteredRow.length).fill(0),
        ...filteredRow,
      ];
    });

    this._postMoveHandler(prevState);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.board);

    this.board = this.transpose(this.board).map((row) => {
      const filteredRow = row.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
          filteredRow.push(0);
        }
      }

      return [
        ...filteredRow,
        ...Array(row.length - filteredRow.length).fill(0),
      ];
    });

    this.board = this.transpose(this.board);
    this._postMoveHandler(prevState);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.board);

    this.board = this.transpose(this.board).map((row) => {
      const filteredRow = row.filter((num) => num !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i - 1, 1);
          filteredRow.unshift(0);
        }
      }

      return [
        ...Array(row.length - filteredRow.length).fill(0),
        ...filteredRow,
      ];
    });

    this.board = this.transpose(this.board);
    this._postMoveHandler(prevState);
  }

  _postMoveHandler(prevState) {
    if (JSON.stringify(this.board) !== prevState) {
      this.addRandomTile();

      if (this.board.flat().includes(2048)) {
        this.status = 'win';
      } else if (!this.hasAvailableMoves()) {
        this.status = 'lose';
      }

      this.updateBestScore();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status || 'idle';
  }

  updateBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
  }

  hasAvailableMoves() {
    for (const row of this.board) {
      if (row.includes(0)) {
        return true;
      }
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    for (let i = 0; i < this.board.length - 1; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          emptyTiles.push({ row: r, col: c });
        }
      }
    }

    if (emptyTiles.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const { row, col } = emptyTiles[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 1024 : 4;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  start() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }
}
