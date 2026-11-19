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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.board.length; i++) {
      const row = this.slide(this.board[i]);

      if (row.some((value, j) => value !== this.board[i][j])) {
        moved = true;
      }

      this.board[i] = row;
    }

    this.finishMove(moved);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.board.length; i++) {
      const reversed = [...this.board[i]].reverse();
      const row = this.slide(reversed).reverse();

      if (row.some((value, j) => value !== this.board[i][j])) {
        moved = true;
      }

      this.board[i] = row;
    }

    this.finishMove(moved);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.board[0].length; j++) {
      const column = [];

      for (let i = 0; i < this.board.length; i++) {
        column.push(this.board[i][j]);
      }

      const slid = this.slide(column);

      for (let i = 0; i < slid.length; i++) {
        if (slid[i] !== this.board[i][j]) {
          moved = true;
        }

        this.board[i][j] = slid[i];
      }
    }

    this.finishMove(moved);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.board[0].length; j++) {
      const column = [];

      for (let i = this.board.length - 1; i >= 0; i--) {
        column.push(this.board[i][j]);
      }

      const slid = this.slide(column).reverse();

      for (let i = 0; i < slid.length; i++) {
        if (slid[i] !== this.board[i][j]) {
          moved = true;
        }

        this.board[i][j] = slid[i];
      }
    }

    this.finishMove(moved);
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slide(row) {
    const withoutZeros = row.filter((value) => value !== 0);
    const merged = [];

    for (let i = 0; i < withoutZeros.length; i++) {
      if (withoutZeros[i] === withoutZeros[i + 1]) {
        const value = withoutZeros[i] * 2;

        merged.push(value);
        this.score += value;
        i++;
      } else {
        merged.push(withoutZeros[i]);
      }
    }

    while (merged.length < row.length) {
      merged.push(0);
    }

    return merged;
  }

  finishMove(moved) {
    if (this.board.some((row) => row.some((value) => value === 2048))) {
      this.status = 'win';

      return;
    }

    if (moved) {
      this.status = 'playing';
      this.addRandomTile();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    } else if (!this.canMove() && this.status === 'playing') {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (
          j + 1 < this.board[i].length &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return true;
        }

        if (
          i + 1 < this.board.length &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
