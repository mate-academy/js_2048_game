'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const row = this.board[r].filter((x) => x !== 0);

      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          this.score += row[c];
          row[c + 1] = 0;
        }
      }

      const newRow = row.filter((x) => x !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (this.board[r].toString() !== newRow.toString()) {
        moved = true;
        this.board[r] = newRow;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
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
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'idle') {
      this.addRandomTile();
      this.addRandomTile();
      this.status = 'playing';
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';

    // eslint-disable-next-line
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
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
      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  reverseRows() {
    this.board = this.board.map((row) => row.reverse());
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  checkWin() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (r < this.size - 1 && this.board[r + 1][c] === val) {
          return;
        }

        if (c < this.size - 1 && this.board[r][c + 1] === val) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
