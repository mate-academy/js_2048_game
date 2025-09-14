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
    if (initialState) {
      // копія масиву
      this._board = initialState.map((row) => row.slice());
    } else {
      // порожнє поле 4×4
      this._board = Array.from({ length: 4 }, () => Array(4).fill(0));
    }

    this._score = 0;
    this._status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this._board[i].filter((x) => x !== 0);

      for (let s = 0; s < row.length - 1; s++) {
        if (row[s] === row[s + 1]) {
          row[s] *= 2;
          this._score += row[s];
          row[s + 1] = 0;
        }
      }

      const newRow = row.filter((x) => x !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      const oldRow = this._board[i].slice();

      this._board[i] = newRow;

      if (oldRow.toString() !== newRow.toString()) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }

  moveRight() {
    this.reverseRows();
    this.moveLeft();
    this.reverseRows();
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }
  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this._score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this._board.map((row) => row.slice());
  }

  getStatus() {
    return this._status;
  }

  start() {
    if (this._status === 'idle') {
      this._status = 'playing';
      this._score = 0;
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    for (let k = 0; k < 4; k++) {
      for (let l = 0; l < 4; l++) {
        this._board[k][l] = 0;
      }
    }
    this._score = 0;
    this._status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this._board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this._board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  reverseRows() {
    this._board = this._board.map((row) => row.reverse());
  }

  /* eslint-disable comma-dangle */
  transpose() {
    this._board = this._board[0].map((_, colIndex) =>
      this._board.map((row) => row[colIndex]),
    );
  }
  /* eslint-enable comma-dangle */

  checkWin() {
    let found = false;

    for (let g = 0; g < this._board.length; g++) {
      for (let h = 0; h < this._board.length; h++) {
        if (this._board[g][h] === 2048) {
          this._status = 'win';
          found = true;
        }
      }
    }

    if (found === false) {
      this._status = 'playing';
    }
  }

  checkLose() {
    let canMove = false;

    for (let g = 0; g < this._board.length; g++) {
      for (let h = 0; h < this._board.length; h++) {
        if (this._board[g][h] === 0) {
          canMove = true;
        }

        if (h < 3 && this._board[g][h] === this._board[g][h + 1]) {
          canMove = true;
        }

        if (g < 3 && this._board[g][h] === this._board[g + 1][h]) {
          canMove = true;
        }
      }
    }

    if (canMove === false) {
      this._status = 'lose';
    }
  }
}

module.exports = Game;
