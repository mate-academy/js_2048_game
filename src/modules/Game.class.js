'use strict';

class Game {
  /**
   * @param {number[][]} initialState The initial state of the board.
   * За замовчуванням – матриця 4x4 з нулів.
   */
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
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

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  start() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 3; i++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  updateGameStatus() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      let newRow = this.board[i].filter((num) => num);

      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow[j + 1] = 0;
        }
      }
      newRow = newRow.filter((num) => num);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (newRow.join('') !== this.board[i].join('')) {
        moved = true;
      }
      this.board[i] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateGameStatus();
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      let newRow = this.board[i].filter((num) => num);

      for (let j = newRow.length - 1; j > 0; j--) {
        if (newRow[j] === newRow[j - 1]) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow[j - 1] = 0;
        }
      }
      newRow = newRow.filter((num) => num);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      if (newRow.join('') !== this.board[i].join('')) {
        moved = true;
      }
      this.board[i] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateGameStatus();
  }

  moveUp() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      let newCol = [];

      for (let i = 0; i < 4; i++) {
        if (this.board[i][j] !== 0) {
          newCol.push(this.board[i][j]);
        }
      }

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol[i + 1] = 0;
        }
      }
      newCol = newCol.filter((num) => num);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (this.board[i][j] !== newCol[i]) {
          moved = true;
        }
        this.board[i][j] = newCol[i];
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateGameStatus();
  }

  moveDown() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      let newCol = [];

      for (let i = 0; i < 4; i++) {
        if (this.board[i][j] !== 0) {
          newCol.push(this.board[i][j]);
        }
      }

      for (let i = newCol.length - 1; i > 0; i--) {
        if (newCol[i] === newCol[i - 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol[i - 1] = 0;
        }
      }
      newCol = newCol.filter((num) => num);

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let i = 0; i < 4; i++) {
        if (this.board[i][j] !== newCol[i]) {
          moved = true;
        }
        this.board[i][j] = newCol[i];
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateGameStatus();
  }
}

module.exports = Game;
