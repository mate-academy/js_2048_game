'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static WIN_VALUE = 2048;
  static FOUR_PROBABILITY = 0.1;
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
    this.initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const beforeState = this.getState();
    const tempState = [];

    for (const row of this.state) {
      const { row: newRow, score } = this.slide(row);

      this.score += score;
      tempState.push(newRow);
    }

    this.state = tempState;
    this.afterMove(beforeState);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const beforeState = this.getState();
    const tempState = [];

    for (const row of this.state) {
      const { row: newRow, score } = this.slide([...row].reverse());

      this.score += score;
      tempState.push(newRow.reverse());
    }

    this.state = tempState;
    this.afterMove(beforeState);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

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
    return this.state.map((row) => [...row]);
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
    this.score = 0;
    this.status = 'idle';
    this.state = this.initialState.map((row) => [...row]);
  }

  // Add your own methods here

  // Slide Row
  slide(row) {
    let result = row.filter((cell) => cell !== 0);
    let score = 0;

    for (let i = 0; i < result.length; i++) {
      if (result[i] === result[i + 1]) {
        const sum = result[i] * 2;

        result[i] = sum;
        result[i + 1] = 0;
        score += sum;
        i++;
      }
    }

    result = result.filter((cell) => cell !== 0);

    while (result.length < row.length) {
      result.push(0);
    }

    return { row: result, score };
  }

  // Transpose
  transpose() {
    const tempState = [];

    for (let col = 0; col < this.state.length; col++) {
      const newRow = [];

      for (const row of this.state) {
        newRow.push(row[col]);
      }

      tempState.push(newRow);
    }

    this.state = tempState;
  }

  // addRandomTile
  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
      for (let i = 0; i < this.state[rowIndex].length; i++) {
        if (this.state[rowIndex][i] === 0) {
          emptyCells.push([rowIndex, i]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, cell] = emptyCells[randomIndex];

    this.state[row][cell] = Math.random() < Game.FOUR_PROBABILITY ? 4 : 2;
  }

  // Win 2048
  hasWon() {
    return this.state.some((row) => row.includes(Game.WIN_VALUE));
  }

  // can Move
  canMove() {
    for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
      for (let i = 0; i < this.state[rowIndex].length; i++) {
        const cell = this.state[rowIndex][i];
        const rightCell = this.state[rowIndex][i + 1];
        const nextRow = this.state[rowIndex + 1];
        const downCell = nextRow ? nextRow[i] : undefined;

        if (cell === 0 || cell === rightCell || cell === downCell) {
          return true;
        }
      }
    }

    return false;
  }

  // afterMove
  afterMove(beforeState) {
    const changed = JSON.stringify(beforeState) !== JSON.stringify(this.state);

    if (!changed) {
      return;
    }

    this.addRandomTile();

    if (this.hasWon()) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
