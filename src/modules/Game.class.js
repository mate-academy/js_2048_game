'use strict';
class Game {
  constructor(initialState) {
    this.initialState = initialState;
    this.board = initialState || this.#createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  #createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  #generateSquare() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.1 ? 4 : 2;

      this.board[row][col] = value;
    }
  }

  #isWin() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  #isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.board[r][c];

        if (c < 3 && this.board[r][c + 1] === val) {
          return false;
        }

        if (r < 3 && this.board[r + 1][c] === val) {
          return false;
        }
      }
    }

    return true;
  }

  #move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const previousBoard = JSON.parse(JSON.stringify(this.board));
    let moved = false;

    for (let i = 0; i < 4; i++) {
      let rowOrCol = [];

      if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
          rowOrCol.push(this.board[j][i]);
        }
      } else if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
          rowOrCol.push(this.board[3 - j][i]);
        }
      } else if (direction === 'left') {
        rowOrCol = this.board[i];
      } else if (direction === 'right') {
        rowOrCol = [...this.board[i]].reverse();
      }

      const newRowOrCol = rowOrCol.filter((val) => val !== 0);

      for (let j = 0; j < newRowOrCol.length - 1; j++) {
        if (newRowOrCol[j] === newRowOrCol[j + 1]) {
          newRowOrCol[j] *= 2;
          this.score += newRowOrCol[j];
          newRowOrCol.splice(j + 1, 1);
        }
      }

      while (newRowOrCol.length < 4) {
        newRowOrCol.push(0);
      }

      if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
          this.board[j][i] = newRowOrCol[j];
        }
      } else if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
          this.board[3 - j][i] = newRowOrCol[j];
        }
      } else if (direction === 'left') {
        this.board[i] = newRowOrCol;
      } else if (direction === 'right') {
        this.board[i] = newRowOrCol.reverse();
      }
    }

    if (JSON.stringify(this.board) !== JSON.stringify(previousBoard)) {
      this.#generateSquare();
      moved = true;
    }

    this.checkStatus();

    return moved;
  }

  moveLeft() {
    this.#move('left');
  }
  moveRight() {
    this.#move('right');
  }
  moveUp() {
    this.#move('up');
  }
  moveDown() {
    this.#move('down');
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
    this.board = this.#createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.#generateSquare();
    this.#generateSquare();
  }

  restart() {
    this.start();
  }

  checkStatus() {
    if (this.#isWin()) {
      this.status = 'win';
    } else if (this.#isGameOver()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
