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
  constructor(initialState = null) {
    this.size = 4;
    this.board = initialState || this.createEmtyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      let newRow = this.compress(this.board[row]);

      newRow = this.merge(newRow);
      newRow = this.compress(newRow);

      if (this.board[row].join('') !== newRow.join('')) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.afterMove();
    }
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
  }
  moveUp() {
    this.rotateBoardClockwise();
    this.moveLeft();
    this.rotateBoardCounterClockwise();
  }
  moveDown() {
    this.rotateBoardCounterClockwise();
    this.moveLeft();
    this.rotateBoardClockwise();
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
    return this.board;
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createEmtyBoard();
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  // Add your own methods here

  createEmtyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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

  compress(row) {
    return row
      .filter((v) => v !== 0)
      .concat(Array(this.size).fill(0))
      .slice(0, this.size);
  }

  merge(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row[i + 1] = 0;
      }
    }

    return row;
  }

  rotateBoardClockwise() {
    this.board = this.board[0].map((_, i) =>
      // eslint-disable-next-line prettier/prettier
      this.board.map((row) => row[i]).reverse());
  }

  rotateBoardCounterClockwise() {
    this.board = this.board[0].map((_, i) =>
      // eslint-disable-next-line prettier/prettier
      this.board.map((row) => row[row.length - 1 - i]));
  }

  afterMove() {
    this.addRandomTile();
    this.checkGameStatus();
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      // eslint-disable-next-line no-useless-return
      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (
          (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) ||
          (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
