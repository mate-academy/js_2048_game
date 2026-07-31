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
    this.initialState = initialState.map((currentRow) => [...currentRow]);
    this.state = initialState.map((currentRow) => [...currentRow]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    this.state = this.state.map((row) => this.mergeRowLeft(row));

    this.finishMove(previousState);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    this.state = this.state.map((row) => this.mergeRowRight(row));

    this.finishMove(previousState);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    for (let column = 0; column < this.state.length; column++) {
      const currentColumn = this.getColumn(column);
      const mergedColumn = this.mergeRowLeft(currentColumn);

      this.setColumn(column, mergedColumn);
    }

    this.finishMove(previousState);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    for (let column = 0; column < this.state.length; column++) {
      const currentColumn = this.getColumn(column);
      const mergedColumn = this.mergeRowRight(currentColumn);

      this.setColumn(column, mergedColumn);
    }

    this.finishMove(previousState);
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
    return this.state.map((currentRow) => [...currentRow]);
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

    if (this.isBoardEmpty()) {
      this.addRandomTile();
      this.addRandomTile();
    }

    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((currentRow) => [...currentRow]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] === 0) {
          emptyCells.push([row, column]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomColumn] = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[randomRow][randomColumn] = value;
  }

  isBoardEmpty() {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  mergeRowLeft(row) {
    const filteredRow = row.filter((cell) => cell !== 0);
    const mergedRow = [];

    for (let index = 0; index < filteredRow.length; index++) {
      if (filteredRow[index] === filteredRow[index + 1]) {
        const mergedValue = filteredRow[index] * 2;

        mergedRow.push(mergedValue);
        this.score += mergedValue;
        index++;
      } else {
        mergedRow.push(filteredRow[index]);
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  hasBoardChanged(previousState) {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] !== previousState[row][column]) {
          return true;
        }
      }
    }

    return false;
  }

  mergeRowRight(row) {
    const reversed = [...row].reverse();

    const merged = this.mergeRowLeft(reversed);

    return merged.reverse();
  }

  getColumn(columnIndex) {
    const column = [];

    for (let row = 0; row < this.state.length; row++) {
      column.push(this.state[row][columnIndex]);
    }

    return column;
  }

  setColumn(columnIndex, values) {
    for (let row = 0; row < this.state.length; row++) {
      this.state[row][columnIndex] = values[row];
    }
  }

  hasWinningTile() {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  finishMove(previousState) {
    const boardChanged = this.hasBoardChanged(previousState);

    if (boardChanged) {
      this.addRandomTile();
    }

    if (this.hasWinningTile()) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        const currentValue = this.state[row][column];

        if (currentValue === 0) {
          return true;
        }

        if (
          column < this.state[row].length - 1 &&
          currentValue === this.state[row][column + 1]
        ) {
          return true;
        }

        if (
          row < this.state.length - 1 &&
          currentValue === this.state[row + 1][column]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
