'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  #defaultState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  #previousState;

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
  constructor(initialState = this.#defaultState) {
    this.initialState = structuredClone(initialState);
    this.state = initialState;
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    if (this.status === 'playing') {
      let scoreIncrease = 0;

      for (const row of this.state) {
        const cellsWithValue = [];
        const result = [];

        for (let i = 0; i < row.length; i++) {
          if (row[i] !== 0) {
            cellsWithValue.push(row[i]);
            row[i] = 0;
          }
        }

        for (let i = 0; i < cellsWithValue.length; i++) {
          if (cellsWithValue[i] === cellsWithValue[i + 1]) {
            const newCellValue = cellsWithValue[i] + cellsWithValue[i + 1];

            scoreIncrease += newCellValue;
            result.push(newCellValue);
            i++;
          } else {
            result.push(cellsWithValue[i]);
          }
        }

        for (let i = 0; i < result.length; i++) {
          row[i] = result[i];
        }
      }

      this.score += scoreIncrease;
      this.#completeMove();
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      let scoreIncrease = 0;

      for (const row of this.state) {
        const cellsWithValue = [];
        const result = [];

        for (let i = row.length - 1; i >= 0; i--) {
          if (row[i] !== 0) {
            cellsWithValue.push(row[i]);
            row[i] = 0;
          }
        }

        for (let i = 0; i < cellsWithValue.length; i++) {
          if (cellsWithValue[i] === cellsWithValue[i + 1]) {
            const newCellValue = cellsWithValue[i] + cellsWithValue[i + 1];

            scoreIncrease += newCellValue;
            result.push(newCellValue);
            i++;
          } else {
            result.push(cellsWithValue[i]);
          }
        }

        for (let i = 0; i < result.length; i++) {
          row[row.length - 1 - i] = result[i];
        }
      }

      this.score += scoreIncrease;
      this.#completeMove();
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      let scoreIncrease = 0;

      for (let column = 0; column < this.state[0].length; column++) {
        const cellsWithValue = [];
        const result = [];

        for (let i = 0; i < this.state.length; i++) {
          if (this.state[i][column] !== 0) {
            cellsWithValue.push(this.state[i][column]);
            this.state[i][column] = 0;
          }
        }

        for (let i = 0; i < cellsWithValue.length; i++) {
          if (cellsWithValue[i] === cellsWithValue[i + 1]) {
            const newCellValue = cellsWithValue[i] + cellsWithValue[i + 1];

            scoreIncrease += newCellValue;
            result.push(newCellValue);
            i++;
          } else {
            result.push(cellsWithValue[i]);
          }
        }

        for (let i = 0; i < result.length; i++) {
          this.state[i][column] = result[i];
        }
      }

      this.score += scoreIncrease;
      this.#completeMove();
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      let scoreIncrease = 0;

      for (let column = 0; column < this.state[0].length; column++) {
        const cellsWithValue = [];
        const result = [];

        for (let i = this.state.length - 1; i >= 0; i--) {
          if (this.state[i][column] !== 0) {
            cellsWithValue.push(this.state[i][column]);
            this.state[i][column] = 0;
          }
        }

        for (let i = 0; i < cellsWithValue.length; i++) {
          if (cellsWithValue[i] === cellsWithValue[i + 1]) {
            const newCellValue = cellsWithValue[i] + cellsWithValue[i + 1];

            scoreIncrease += newCellValue;
            result.push(newCellValue);
            i++;
          } else {
            result.push(cellsWithValue[i]);
          }
        }

        for (let i = 0; i < result.length; i++) {
          this.state[this.state[0].length - 1 - i][column] = result[i];
        }
      }

      this.score += scoreIncrease;
      this.#completeMove();
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
    if (this.status === 'idle') {
      this.#addRandomCell();
      this.#addRandomCell();

      this.status = 'playing';
      this.#previousState = structuredClone(this.state);

      if (this.#isLose()) {
        this.status = 'lose';
      }
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = structuredClone(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  #addRandomCell() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCellLocation =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const cellValue = Math.random() >= 0.9 ? 4 : 2;

    this.state[randomCellLocation[0]][randomCellLocation[1]] = cellValue;
  }

  #isLose() {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] === 0) {
          return false;
        }

        if (
          column + 1 < this.state[row].length &&
          this.state[row][column] === this.state[row][column + 1]
        ) {
          return false;
        }

        if (
          row + 1 < this.state.length &&
          this.state[row][column] === this.state[row + 1][column]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  #isStateChanged() {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.#previousState[row][column] !== this.state[row][column]) {
          return true;
        }
      }
    }

    return false;
  }

  #completeMove() {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (this.#isStateChanged()) {
      this.#addRandomCell();

      if (this.#isLose()) {
        this.status = 'lose';
      }

      this.#previousState = structuredClone(this.state);
    }
  }
}

module.exports = Game;
