'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;

    this.board = initialState
      ? this.copyState(initialState)
      : this.generateEmptyBoard();
  }

  generateEmptyBoard() {
    return Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(0));
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

  initializeGame() {
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slide(row) {
    const newRow = row.filter((val) => val);

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  combine(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1] && row[i] !== 0) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return row;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let newRow = this.slide(this.board[r]);

      newRow = this.combine(newRow);
      newRow = this.slide(newRow);

      if (this.board[r].toString() !== newRow.toString()) {
        moved = true;
      }
      this.board[r] = newRow;
    }

    if (moved) {
      this.postMove();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let newRow = this.slide(this.board[r].slice().reverse());

      newRow = this.combine(newRow);
      newRow = this.slide(newRow).reverse();

      if (this.board[r].toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[r] = newRow;
    }

    if (moved) {
      this.postMove();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const col = this.board.map((row) => row[c]);
      let newCol = this.slide(col);

      newCol = this.combine(newCol);
      newCol = this.slide(newCol);

      if (col.toString() !== newCol.toString()) {
        moved = true;
      }

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = newCol[r];
      }
    }

    if (moved) {
      this.postMove();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const col = this.board.map((row) => row[c]);
      let newCol = this.slide(col.slice().reverse());

      newCol = this.combine(newCol);
      newCol = this.slide(newCol).reverse();

      if (col.toString() !== newCol.toString()) {
        moved = true;
      }

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = newCol[r];
      }
    }

    if (moved) {
      this.postMove();
    }
  }

  postMove() {
    this.addRandomTile();
    this.checkGameStatus();
  }

  checkGameStatus() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return;
        }

        if (c !== this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r !== this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }

  start() {
    if (this.status === 'idle') {
      this.initializeGame();
      this.status = 'playing';
    }
  }

  restart() {
    this.board = this.initialState
      ? this.copyState(this.initialState)
      : this.generateEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  copyState(state) {
    return state.map((row) => [...row]);
  }
}

module.exports = Game;
