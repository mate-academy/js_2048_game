'use strict';

class Game {
  static INITIAL_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState = Game.INITIAL_STATE) {
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < this.board.length; r++) {
      let row = this.board[r];

      row = this.stack(row);
      row = this.merge(row);
      row = this.stack(row);
      this.board[r] = row;
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard === newBoard) {
      return;
    }

    this.checkWin();
    this.addRandomCell();
    this.checkGameOver();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < this.board.length; r++) {
      let row = this.board[r];

      row = row.reverse();
      row = this.stack(row);
      row = this.merge(row);
      row = this.stack(row);
      row = row.reverse();
      this.board[r] = row;
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard === newBoard) {
      return;
    }

    this.checkWin();
    this.addRandomCell();
    this.checkGameOver();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    for (let c = 0; c < this.board.length; c++) {
      let col = this.board.map((r) => r[c]);

      col = this.stack(col);
      col = this.merge(col);
      col = this.stack(col);
      this.updateColumn(c, col);
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard === newBoard) {
      return;
    }

    this.checkWin();
    this.addRandomCell();
    this.checkGameOver();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    for (let c = 0; c < this.board.length; c++) {
      let col = this.board.map((r) => r[c]);

      col = col.reverse();
      col = this.stack(col);
      col = this.merge(col);
      col = this.stack(col);
      col = col.reverse();
      this.updateColumn(c, col);
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard === newBoard) {
      return;
    }

    this.checkWin();
    this.addRandomCell();
    this.checkGameOver();
  }

  updateColumn(c, col) {
    for (let r = 0; r < this.board.length; r++) {
      this.board[r][c] = col[r];
    }
  }

  filterZero(arr) {
    return arr.filter((num) => num !== 0);
  }

  stack(arr) {
    const newArr = this.filterZero(arr);

    while (newArr.length < this.board.length) {
      newArr.push(0);
    }

    return newArr;
  }

  merge(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1] && arr[i] !== 0) {
        arr[i] *= 2;
        arr[i + 1] = 0;
        this.score += arr[i];
      }
    }

    return arr;
  }

  checkWin() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }
  }

  checkGameOver() {
    if (this.board.flat().includes(0)) {
      return;
    }

    if (!this.checkHorizontal() && !this.checkVertical()) {
      this.status = 'lose';
    }
  }

  checkHorizontal() {
    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board.length - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  checkVertical() {
    for (let r = 0; r < this.board.length - 1; r++) {
      for (let c = 0; c < this.board.length; c++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomCell() {
    const emptyCells = this.board.reduce((acc, currentRow, rowIndex) => {
      currentRow.forEach((cell, colIndex) => {
        if (cell === 0) {
          acc.push([rowIndex, colIndex]);
        }
      });

      return acc;
    }, []);

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
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
    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.board = Game.INITIAL_STATE.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }
}

module.exports = Game;
