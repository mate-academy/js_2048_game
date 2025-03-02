'use strict';

class Game {

  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */

  constructor(initialState) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array(4).fill(null).map(() => Array(4).fill(0))
  }

  addRandomTitle() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; J++) {
        emptyCells.push([i, j])
      }
    }
    if (emptyCells.length > 0) {
      const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      this.board[x], [y] = Math.random < 0.9 ? 2 : 4;
    }
  }

  start() {
    this.board = this.createEmptyBoard();
    this.addRandomTitle();
    this.addRandomTitle();
    this.score = 0;
    this.status = 'playing';
  }

  restart() {
    this.start();
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

  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      let newRow = this.board[i].filter(num => num);

      for (let j = 0; j < 4; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow[j + 1] = 0;
        }
      }

      newRow = newRow.filter(num => num);

      while (newRow.length < 4) newRow.push(0);

      if (newRow.join('') !== this.board[i].join('')) moved = true;
      this.board[i] = newRow;
    }
    if (moved) this.addRandomTitle();
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

      newCol = newCol.filter(num => num);

      while (newCol.length < 4) newCol.push(0);

      for (let i = 0; i < 4; i++) {
        if (newCol[i] !== this.board[i][j]) {
          moved = true;
        }
        this.board[i][j] = newCol[i];
      }
    }

    if (moved) this.addRandomTile();
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
      newCol = newCol.filter(num => num);
      while (newCol.length < 4) newCol.unshift(0);

      for (let i = 0; i < 4; i++) {
        if (this.board[i][j] !== newCol[i]) moved = true;
        this.board[i][j] = newCol[i];
      }
    }

    if (moved) this.addRandomTile();
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      let newRow = this.board[i].filter(num => num);
      for (let j = newRow.length - 1; j > 0; j--) {
        if (newRow[j] === newRow[j - 1]) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow[j - 1] = 0;
        }
      }
      newRow = newRow.filter(num => num);
      while (newRow.length < 4) newRow.unshift(0);

      if (newRow.join('') !== this.board[i].join('')) moved = true;
      this.board[i] = newRow;
    }

    if (moved) this.addRandomTile();
  }

}

module.exports = Game;
