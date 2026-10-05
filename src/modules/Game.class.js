'use strict';

const FOUR_CHANCE = 0.1;
const WIN_NUMBER = 2048;

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
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;

    this.currentState = structuredClone(initialState);
  }

  moveLeft() {
    const shiftLeft = (state) => state.map((row) => this.mergeRow(row));

    this.makeMove(shiftLeft);
  }

  moveRight() {
    const shiftRight = (state) =>
      state
        .map((row) => row.toReversed())
        .map((row) => this.mergeRow(row))
        .map((row) => row.toReversed());

    this.makeMove(shiftRight);
  }

  moveUp() {
    const shiftUp = (state) => {
      const columns = this.transpose(state);
      const movedColumns = columns.map((row) => this.mergeRow(row));

      return this.transpose(movedColumns);
    };

    this.makeMove(shiftUp);
  }

  moveDown() {
    const shiftDown = (state) => {
      const movedColumns = this.transpose(state)
        .map((row) => row.toReversed())
        .map((row) => this.mergeRow(row))
        .map((row) => row.toReversed());

      return this.transpose(movedColumns);
    };

    this.makeMove(shiftDown);
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
    return this.currentState;
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
    this.status = 'idle';
    this.score = 0;
    this.currentState = structuredClone(this.initialState);
  }

  // Add your own methods here
  hasChanged(previous, current) {
    return previous.some((value, i) => current[i] !== value);
  }

  hasWon() {
    return this.currentState.flat().some((value) => value === WIN_NUMBER);
  }

  hasMoves() {
    if (this.currentState.flat().some((value) => value === 0)) {
      return true;
    }

    const columns = this.transpose(this.currentState);
    const lines = [...this.currentState, ...columns];

    return lines.some((line) => line.some((value, i) => value === line[i + 1]));
  }

  makeMove(transform) {
    if (this.status !== 'playing') {
      return;
    }

    const backupState = structuredClone(this.currentState);

    this.currentState = transform(this.currentState);

    if (this.hasChanged(backupState.flat(), this.currentState.flat())) {
      this.addRandomTile();
    }

    if (this.hasWon()) {
      this.status = 'win';
    } else if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  mergeRow(row) {
    const tiles = row.filter((value) => value !== 0);
    const merged = [];

    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] === tiles[i + 1]) {
        const sum = tiles[i] * 2;

        merged.push(sum);
        this.score += sum;
        i++;
      } else {
        merged.push(tiles[i]);
      }
    }

    while (merged.length < row.length) {
      merged.push(0);
    }

    return merged;
  }

  transpose(arr) {
    const newRows = structuredClone(arr);

    for (let row = 0; row < arr.length; row++) {
      for (let i = 0; i < arr[row].length; i++) {
        newRows[i][row] = arr[row][i];
      }
    }

    return newRows;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.currentState.length; row++) {
      for (let col = 0; col < this.currentState[row].length; col++) {
        if (this.currentState[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [targetRow, targetCol] = emptyCells[randomIndex];

    this.currentState[targetRow][targetCol] =
      Math.random() < FOUR_CHANCE ? 4 : 2;
  }
}

module.exports = Game;
