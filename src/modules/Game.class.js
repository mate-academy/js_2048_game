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
    console.log(initialState);

    this.isInitial = !!initialState;
    this.initialState = initialState;
    this.createEmptyField();
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

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
    return this.field;
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

    if (!this.isInitial) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.createEmptyField();
  }

  addRandomTile() {
    const coordinates = this.getEmptyCellCoords();

    if (coordinates.length === 0) {
      return;
    }

    const cellIndex = Math.floor(Math.random() * coordinates.length);
    const value = Math.random() < 0.9 ? 2 : 4;
    const { r, c } = coordinates[cellIndex];

    this.field[r][c] = value;
  }

  getEmptyCellCoords() {
    const coordinates = [];

    for (let rowIndex = 0; rowIndex < this.field.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < this.field[rowIndex].length;
        colIndex++
      ) {
        if (this.field[rowIndex][colIndex] === 0) {
          coordinates.push({ r: rowIndex, c: colIndex });
        }
      }
    }

    return coordinates;
  }

  createEmptyField() {
    this.field = this.initialState
      ? JSON.parse(JSON.stringify(this.initialState))
      : [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
