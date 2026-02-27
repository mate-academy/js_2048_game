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
    if (initialState) {
      this.state = initialState;
    } else {
      this.state = this.createEmptyBoard();
    }

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    const newState = this.state.map((row) => {
      const newRow = this.compressRowLeft(row);

      if (row.join(',') !== newRow.join(',')) {
        moved = true;
      }

      return newRow;
    });

    if (moved) {
      this.state = newState;
      this.addRandomTile();

      if (this.state.flat().includes(2048)) {
        this.status = 'win';
      }

      if (!this.hasMoves()) {
        this.status = 'lose';
      }
    }

    return moved;
  }
  moveRight() {
    this.state = this.state.map((row) => [...row].reverse());

    const moved = this.moveLeft();

    this.state = this.state.map((row) => [...row].reverse());

    return moved;
  }
  moveUp() {
    this.state = this.transpose(this.state);

    const moved = this.moveLeft();

    this.state = this.transpose(this.state);

    return moved;
  }
  moveDown() {
    this.state = this.transpose(this.state);

    this.state = this.state.map((row) => [...row].reverse());

    const moved = this.moveLeft();

    this.state = this.state.map((row) => [...row].reverse());

    this.state = this.transpose(this.state);

    return moved;
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
    this.state = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  createEmptyBoard() {
    return Array(4)
      .fill()
      .map(() => Array(4).fill(0));
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  getEmptyCells() {
    const empty = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          empty.push([row, col]);
        }
      }
    }

    return empty;
  }

  hasMoves() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  compressRowLeft(row = []) {
    const nonZero = row.filter((value) => value !== 0);

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        nonZero[i] *= 2;
        this.score += nonZero[i];
        nonZero[i + 1] = 0;
      }
    }

    const merged = nonZero.filter((value) => value !== 0);

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  transpose(matrix = []) {
    if (!matrix.length) {
      return [];
    }

    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
}

module.exports = Game;
