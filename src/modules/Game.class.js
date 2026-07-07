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
    // eslint-disable-next-line no-console
    this.matrix = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  processRows(reverse = false) {
    const currentState = JSON.stringify(this.matrix);

    for (let i = 0; i < this.matrix.length; i++) {
      const row = this.matrix[i];

      if (reverse) {
        row.reverse();
      }

      let filteredRow = row.filter((value) => value > 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] *= 2;
          filteredRow[j + 1] = 0;
          this.score += filteredRow[j];
        }
      }

      filteredRow = filteredRow.filter((value) => value > 0);
      filteredRow = filteredRow.concat(Array(4 - filteredRow.length).fill(0));

      if (reverse) {
        filteredRow.reverse();
      }

      this.matrix[i] = filteredRow;
    }

    if (currentState !== JSON.stringify(this.matrix)) {
      this.spawnTile();
    }

    this.checkGame();
  }

  transpose() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = i; j < this.matrix[i].length; j++) {
        [this.matrix[i][j], this.matrix[j][i]] = [
          this.matrix[j][i],
          this.matrix[i][j],
        ];
      }
    }
  }

  moveLeft() {
    this.processRows(false);
  }
  moveRight() {
    this.processRows(true);
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
    return this.matrix;
  }

  checkGame() {
    if (this.matrix.flat().includes(2048)) {
      this.status = 'win';

      return true;
    }

    const hasNulls = this.matrix.flat().includes(0);
    let hasCourse = false;

    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length - 1; j++) {
        if (this.matrix[i][j] === this.matrix[i][j + 1]) {
          hasCourse = true;
          break;
        }
      }
    }

    for (let i = 0; i < this.matrix.length - 1; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === this.matrix[i + 1][j]) {
          hasCourse = true;
          break;
        }
      }
    }

    if (hasNulls || hasCourse) {
      return true;
    }

    this.status = 'lose';

    return false;
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
  spawnTile() {
    const freeIndexes = [];

    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === 0) {
          freeIndexes.push([i, j]);
        }
      }
    }

    if (freeIndexes.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * freeIndexes.length);
    const [row, col] = freeIndexes[randomIndex];

    this.matrix[row][col] = Math.random() <= 0.1 ? 4 : 2;
  }
  start() {
    this.status = 'playing';
    this.spawnTile();
    this.spawnTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.resetMatrix();
    this.start();
  }

  resetMatrix() {
    this.score = 0;

    this.matrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  // Add your own methods here
}

module.exports = Game;
