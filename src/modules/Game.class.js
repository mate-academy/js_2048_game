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
  }

  moveLeft() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i];

      row = this.slideRow(row);
      row = this.combineRow(row);
      row = this.slideRow(row);
      this.board[i] = row;
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addNewTile();
    }

    this.updateStatus();
  }
  moveRight() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i].slice().reverse();

      row = this.slideRow(row);
      row = this.combineRow(row);
      row = this.slideRow(row);
      this.board[i] = row.reverse();
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addNewTile();
    }

    this.updateStatus();
  }
  moveUp() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    this.transponseBoard();

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i].slice();

      row = this.slideRow(row);
      row = this.combineRow(row);
      row = this.slideRow(row);
      this.board[i] = row;
    }
    this.transponseBoard();

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addNewTile();
    }

    this.updateStatus();
  }
  moveDown() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    this.transponseBoard();

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i].slice().reverse();

      row = this.slideRow(row);
      row = this.combineRow(row);
      row = this.slideRow(row);
      this.board[i] = row.reverse();
    }
    this.transponseBoard();

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addNewTile();
    }

    this.updateStatus();
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
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

  createEmptyGrid() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  start() {
    this.status = 'playing';
    this.addNewTile();
    this.addNewTile();
  }

  restart() {
    this.status = 'idle';
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.start();
  }

  slideRow(row) {
    let arr = row.filter((val) => val);
    const empty = 4 - arr.length;
    const zeroes = Array(empty).fill(0);

    arr = arr.concat(zeroes);

    return arr;
  }

  combineRow(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1] && row[i] !== 0) {
        row[i] = row[i] * 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return row;
  }

  addNewTile() {
    const emptyTiles = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyTiles.push([r, c]);
        }
      }
    }

    if (emptyTiles.length > 0) {
      const [row, col] =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  transponseBoard() {
    const newBoard = [[], [], [], []];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newBoard[c][r] = this.board[r][c];
      }
    }

    this.board = newBoard;
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.board.flat().includes(0) && !this.canMove()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }
}

module.exports = Game;
