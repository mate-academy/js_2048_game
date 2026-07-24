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
    const emptyBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : emptyBoard;

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  transformRow(row) {
    let filtered = row.filter((n) => n !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];

        if (filtered[i] === 2048) {
          this.status = 'win';
        }

        filtered[i + 1] = 0;
      }
    }
    filtered = filtered.filter((n) => n !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  moveLeft() {
    this.state = this.state.map((row) => this.transformRow(row));
  }

  moveRight() {
    this.state = this.state.map((row) => {
      const reversed = [...row].reverse();
      const transformed = this.transformRow(reversed);

      return transformed.reverse();
    });
  }

  transpose(matrix) {
    const result = [];

    for (let i = 0; i < 4; i++) {
      const newRow = [];

      for (let j = 0; j < 4; j++) {
        newRow.push(matrix[j][i]);
      }

      result.push(newRow);
    }

    return result;
  }

  moveUp() {
    const transposed = this.transpose(this.state);

    this.state = transposed.map((row) => this.transformRow(row));
    this.state = this.transpose(this.state);
  }

  moveDown() {
    const transposed = this.transpose(this.state);

    this.state = transposed.map((row) => {
      const reversed = [...row].reverse();
      const transformed = this.transformRow(reversed);

      return transformed.reverse();
    });

    this.state = this.transpose(this.state);
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
    this.addTile();
    this.addTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.state = this.initialState.map((row) => [...row]);
  }

  // Add your own methods here
  addTile() {}
}

const game = new Game([
  [2, 8, 2, 0],
  [2, 8, 2, 2],
  [0, 0, 0, 2],
  [0, 0, 0, 2],
]);

// game.moveLeft();
// game.moveRight();
// game.moveUp();
game.moveDown();
// game.moveRight();

// eslint-disable-next-line no-console
console.log(game.getState());

module.exports = Game;
