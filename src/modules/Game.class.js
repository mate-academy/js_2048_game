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
    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const oldRow = [...this.state[row]];
      const newRow = this.moveRowLeft(oldRow);

      if (oldRow.join() !== newRow.join()) {
        moved = true;
      }

      this.state[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (this.checkLose()) {
        this.status = 'lose';
      }
    }
  }
  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const oldRow = [...this.state[row]];
      const reversed = [...oldRow].reverse();
      const newRow = this.moveRowLeft(reversed).reverse();

      if (oldRow.join() !== newRow.join()) {
        moved = true;
      }

      this.state[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (this.checkLose()) {
        this.status = 'lose';
      }
    }
  }
  moveUp() {
    this.transponse();
    this.moveLeft();
    this.transponse();
  }
  moveDown() {
    this.transponse();
    this.moveRight();
    this.transponse();
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
    return this.state;
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

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[randomCell.row][randomCell.col] = value;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  moveRowLeft(row) {
    const numbers = row.filter((num) => num !== 0);

    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] === numbers[i + 1]) {
        numbers[i] *= 2;
        this.score += numbers[i];
        numbers[i + 1] = 0;
      }
    }

    const merge = numbers.filter((num) => num !== 0);

    while (merge.length < 4) {
      merge.push(0);
    }

    return merge;
  }

  transponse() {
    const transposed = [];

    for (let row = 0; row < 4; row++) {
      transposed[row] = [];

      for (let col = 0; col < 4; col++) {
        transposed[row][col] = this.state[col][row];
      }
    }

    this.state = transposed;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return false;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return false;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
