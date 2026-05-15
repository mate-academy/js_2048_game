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
      this.initialState = this.copyState(initialState);
      this.state = this.copyState(initialState);
    } else {
      const emptyState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      this.initialState = this.copyState(emptyState);
      this.state = this.copyState(emptyState);
    }

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.copyState(this.state);
    const nextState = this.state.map((row) => this.moveLeftRow(row));

    if (this.isStateChanged(previousState, nextState)) {
      this.state = nextState;
      this.afterMove();
    }
  }

  moveLeftRow(row) {
    const numbers = row.filter((number) => number !== 0);
    const mergedRow = [];

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const mergeValue = numbers[i] * 2;

        mergedRow.push(mergeValue);
        this.score += mergeValue;
        i++;
      } else {
        mergedRow.push(numbers[i]);
      }
    }

    while (mergedRow.length < row.length) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.copyState(this.state);
    const nextState = this.state.map((row) => this.moveRightRow(row));

    if (this.isStateChanged(previousState, nextState)) {
      this.state = nextState;
      this.afterMove();
    }
  }

  moveRightRow(row) {
    const reversedRow = [...row].reverse();
    const movedRow = this.moveLeftRow(reversedRow);

    return [...movedRow].reverse();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.copyState(this.state);

    for (let col = 0; col < this.state[0].length; col++) {
      const column = this.getColumn(col);

      const movedColumn = this.moveLeftRow(column);

      this.setColumn(col, movedColumn);
    }

    if (this.isStateChanged(previousState, this.state)) {
      this.afterMove();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.copyState(this.state);

    for (let col = 0; col < this.state[0].length; col++) {
      const column = this.getColumn(col);
      const movedColumn = this.moveRightRow(column);

      this.setColumn(col, movedColumn);
    }

    if (this.isStateChanged(previousState, this.state)) {
      this.afterMove();
    }
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
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [rowIndex, colIndex] = emptyCells[randomIndex];
    const newTile = Math.random() < 0.1 ? 4 : 2;

    this.state[rowIndex][colIndex] = newTile;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  copyState(state) {
    return state.map((row) => [...row]);
  }

  isStateChanged(previousState, nextState) {
    for (let row = 0; row < previousState.length; row++) {
      for (let col = 0; col < previousState[row].length; col++) {
        if (previousState[row][col] !== nextState[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  getColumn(colIndex) {
    const column = [];

    for (let row = 0; row < this.state.length; row++) {
      column.push(this.state[row][colIndex]);
    }

    return column;
  }

  setColumn(colIndex, column) {
    for (let row = 0; row < this.state.length; row++) {
      this.state[row][colIndex] = column[row];
    }
  }

  hasWon() {
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  hasEmptyCell() {
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  canMerge() {
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        const current = this.state[row][col];

        if (
          row < this.state.length - 1 &&
          current === this.state[row + 1][col]
        ) {
          return true;
        }

        if (
          col < this.state[row].length - 1 &&
          current === this.state[row][col + 1]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  hasLost() {
    if (this.hasEmptyCell() || this.canMerge()) {
      return false;
    }

    return true;
  }

  afterMove() {
    this.addRandomTile();

    if (this.hasWon()) {
      this.status = 'win';
    }

    if (this.hasLost()) {
      this.status = 'lose';
    }
  }
}
module.exports = Game;
