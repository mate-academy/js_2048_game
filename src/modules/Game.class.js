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
    this.board = initialState.map((row) => row.slice());

    this.score = 0;
    this.status = 'idle';
  }

  placeRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  moveLeft() {
    let boardChanged = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((tile) => tile !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow.splice(col + 1, 1);
          newRow.push(0);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (!this.arraysEqual(newRow, this.board[row])) {
        boardChanged = true;
        this.board[row] = newRow;
      }
    }

    if (boardChanged) {
      this.placeRandomTile();

      if (this.checkWin()) {
        return;
      }

      if (this.checkGameOver()) {
      }
    }
  }

  moveRight() {
    let boardChanged = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].reverse().filter((tile) => tile !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow.splice(col + 1, 1);
          newRow.push(0);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      newRow.reverse();

      if (!this.arraysEqual(newRow, this.board[row])) {
        boardChanged = true;
        this.board[row] = newRow;
      }
    }

    if (boardChanged) {
      this.placeRandomTile();

      if (this.checkWin()) {
        return;
      }

      if (this.checkGameOver()) {
      }
    }
  }

  moveUp() {
    let boardChanged = false;

    for (let col = 0; col < 4; col++) {
      const newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol.splice(i + 1, 1);
          newCol.push(0);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          boardChanged = true;
          this.board[row][col] = newCol[row];
        }
      }
    }

    if (boardChanged) {
      this.placeRandomTile();

      if (this.checkWin()) {
        return;
      }

      if (this.checkGameOver()) {
      }
    }
  }

  moveDown() {
    let boardChanged = false;

    for (let col = 0; col < 4; col++) {
      const newCol = [];

      for (let row = 3; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol.splice(i + 1, 1);
          newCol.push(0);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 3; row >= 0; row--) {
        if (this.board[row][col] !== newCol[3 - row]) {
          boardChanged = true;
          this.board[row][col] = newCol[3 - row];
        }
      }
    }

    if (boardChanged) {
      this.placeRandomTile();

      if (this.checkWin()) {
        return;
      }

      if (this.checkGameOver()) {
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => row.slice());
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.placeRandomTile();
    this.placeRandomTile();
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.start();
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  checkGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }
}

module.exports = Game;
