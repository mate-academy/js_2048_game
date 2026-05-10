'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const SIZE = 4;
const WIN_VALUE = 2048;

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
  constructor(initialState = Game.getEmptyState()) {
    this.initialState = Game.copyState(initialState);
    this.state = Game.copyState(initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move((row) => this.mergeLine(row));
  }
  moveRight() {
    this.move((row) => this.mergeLine([...row].reverse()).reverse());
  }
  moveUp() {
    this.moveVertical((row) => this.mergeLine(row));
  }
  moveDown() {
    this.moveVertical((row) => this.mergeLine([...row].reverse()).reverse());
  }

  moveVertical(callback) {
    if (this.status !== 'playing') {
      return;
    }

    this.transpose();

    const previousState = Game.copyState(this.state);

    this.state = this.state.map((row) => callback([...row]));

    this.transpose();

    if (!Game.areStatesEqual(previousState, this.state)) {
      this.addRandomCell();
      this.updateStatus();
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
    return Game.copyState(this.state);
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
    this.addRandomCell();
    this.addRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = Game.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  move(callback) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = Game.copyState(this.state);

    this.state = this.state.map((row) => callback([...row]));

    if (!Game.areStatesEqual(previousState, this.state)) {
      this.addRandomCell();
      this.updateStatus();
    }
  }

  mergeLine(line) {
    const numbers = line.filter((cell) => cell !== 0);
    const result = [];

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const mergedValue = numbers[i] * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        i++;
      } else {
        result.push(numbers[i]);
      }
    }

    while (result.length < SIZE) {
      result.push(0);
    }

    return result;
  }

  addRandomCell() {
    const emptyCells = [];

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const cellIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[cellIndex];

    this.state[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    if (this.hasValue(WIN_VALUE)) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  hasValue(value) {
    return this.state.some((row) => row.includes(value));
  }

  canMove() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (
          col < SIZE - 1 &&
          this.state[row][col] === this.state[row][col + 1]
        ) {
          return true;
        }

        if (
          row < SIZE - 1 &&
          this.state[row][col] === this.state[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  transpose() {
    const transposedState = Game.getEmptyState();

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        transposedState[row][col] = this.state[col][row];
      }
    }

    this.state = transposedState;
  }

  static getEmptyState() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  static copyState(state) {
    return state.map((row) => [...row]);
  }

  static areStatesEqual(firstState, secondState) {
    return firstState.every((row, rowIndex) => {
      return row.every(
        (cell, colIndex) => cell === secondState[rowIndex][colIndex],
      );
    });
  }
}

export default Game;
