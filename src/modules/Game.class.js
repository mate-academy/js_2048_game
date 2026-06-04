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
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  mergeRowLeft(row) {
    const numbers = row.filter((number) => number !== 0);
    const result = [];

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const mergedValue = numbers[i] * 2;

        result.push(mergedValue);
        this.score += mergedValue;

        if (mergedValue === 2048) {
          this.status = 'win';
        }

        i++;
      } else {
        result.push(numbers[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  mergeRowRight(row) {
    const invertedRow = row.slice().reverse();
    const invertedMergedRow = this.mergeRowLeft(invertedRow);
    const mergedRightRow = invertedMergedRow.reverse();

    return mergedRightRow;
  }

  getColumn(col) {
    const column = [];

    for (let row = 0; row < 4; row++) {
      column.push(this.state[row][col]);
    }

    return column;
  }

  setColumn(col, newColumn) {
    for (let row = 0; row < 4; row++) {
      this.state[row][col] = newColumn[row];
    }
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const randomCell = emptyCells[randomIndex];

    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[randomCell.row][randomCell.col] = value;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state;
    const newState = this.state.map((row) => this.mergeRowLeft(row));

    if (JSON.stringify(oldState) !== JSON.stringify(newState)) {
      this.state = newState;
      this.addRandomTile();

      if (this.status !== 'win' && this.hasLost()) {
        this.status = 'lose';
      }
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state;
    const newState = this.state.map((row) => this.mergeRowRight(row));

    if (JSON.stringify(oldState) !== JSON.stringify(newState)) {
      this.state = newState;
      this.addRandomTile();

      if (this.status !== 'win' && this.hasLost()) {
        this.status = 'lose';
      }
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);

    for (let col = 0; col < 4; col++) {
      const column = this.getColumn(col);
      const mergedColumn = this.mergeRowLeft(column);

      this.setColumn(col, mergedColumn);
    }

    const newState = JSON.stringify(this.state);

    if (oldState !== newState) {
      this.addRandomTile();

      if (this.status !== 'win' && this.hasLost()) {
        this.status = 'lose';
      }
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);

    for (let col = 0; col < 4; col++) {
      const column = this.getColumn(col);
      const mergedColumn = this.mergeRowRight(column);

      this.setColumn(col, mergedColumn);
    }

    const newState = JSON.stringify(this.state);

    if (oldState !== newState) {
      this.addRandomTile();

      if (this.status !== 'win' && this.hasLost()) {
        this.status = 'lose';
      }
    }
  }

  hasLost() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      return false;
    }

    for (let row = 0; row <= 3; row++) {
      for (let col = 0; col <= 2; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return false;
        }
      }
    }

    for (let row = 0; row <= 2; row++) {
      for (let col = 0; col <= 3; col++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
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
    this.state = this.initialState.map((row) => [...row]);
    this.status = 'playing';
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
