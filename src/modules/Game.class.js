'use strict';
class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'playing';
    this.board = initialState || this.createEmptyBoard();
  }

  moveLeft() {
    const move = this.makeMoves(this.board);

    if (move) {
      this.afterMove();
    }
  }
  moveRight() {
    const rev = this.board.map((row) => [...row].reverse());
    const move = this.makeMoves(rev);

    if (move) {
      this.board = move.map((row) => row.reverse());
      this.afterMove();
    }
  }
  moveUp() {
    this.transposeBoard();

    const move = this.makeMoves(this.board);

    if (move) {
      this.transposeBoard();
      this.afterMove();
    } else {
      this.transposeBoard();
    }
  }
  moveDown() {
    this.transposeBoard();

    const reversed = this.board.map((row) => [...row].reverse());
    const move = this.makeMoves(reversed);

    if (move) {
      this.board = move.map((row) => row.reverse());
      this.transposeBoard();
      this.afterMove();
    } else {
      this.transposeBoard();
    }
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
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [x, y] = empty[Math.floor(Math.random() * empty.length)];

    this.board[x][y] = Math.random() < 0.1 ? 4 : 2;
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const res = this.board[i][j];

        if (res === 0) {
          return true;
        }

        if (i < this.size - 1 && res === this.board[i + 1][j]) {
          return true;
        }

        if (j < this.size - 1 && res === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  makeMoves(board) {
    let move = false;
    const newBoard = [];

    for (const row of board) {
      let newRow = row.filter((val) => val !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
          i++;
        }
      }
      newRow = newRow.filter((val) => val !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }
      newBoard.push(newRow);

      if (!move && !this.arraysEqual(newRow, row)) {
        move = true;
      }
    }

    if (move) {
      this.board = newBoard;
    }

    return move ? newBoard : null;
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  afterMove() {
    this.addRandomTile();

    if (this.checkWin()) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  transposeBoard() {
    const transpose = this.createEmptyBoard();

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        transpose[i][j] = this.board[j][i];
      }
    }
    this.board = transpose;
  }
}

module.exports = Game;
