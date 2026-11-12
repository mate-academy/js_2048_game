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
    this.state = initialState.map((row) => [...row]);
    this.initialState = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const previousState = this.state.map((row) => [...row]);

    for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
      const row = this.state[rowIndex];
      const numbers = row.filter((number) => number !== 0);
      const mergedRow = [];

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] === numbers[i + 1]) {
          const mergedNumber = numbers[i] * 2;

          mergedRow.push(mergedNumber);
          this.score += mergedNumber;

          i++;
        } else {
          mergedRow.push(numbers[i]);
        }
      }

      while (mergedRow.length < row.length) {
        mergedRow.push(0);
      }

      this.state[rowIndex] = mergedRow;
    }

    const hasChanged = this.state.some((row, index) => {
      return row.some((number, column) => {
        return number !== previousState[index][column];
      });
    });

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }

    return hasChanged;
  }
  moveRight() {
    const previousState = this.state.map((row) => [...row]);

    for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
      const row = this.state[rowIndex];
      const numbers = row.filter((number) => number !== 0);
      const mergedRow = [];

      for (let i = numbers.length - 1; i >= 0; i--) {
        if (numbers[i] === numbers[i - 1]) {
          const mergedNumber = numbers[i] * 2;

          mergedRow.unshift(mergedNumber);
          this.score += mergedNumber;

          i--;
        } else {
          mergedRow.unshift(numbers[i]);
        }
      }

      while (mergedRow.length < row.length) {
        mergedRow.unshift(0);
      }

      this.state[rowIndex] = mergedRow;
    }

    const hasChanged = this.state.some((row, index) => {
      return row.some((number, column) => {
        return number !== previousState[index][column];
      });
    });

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }

    return hasChanged;
  }
  moveUp() {
    const previousState = this.state.map((row) => [...row]);

    for (let column = 0; column < this.state[0].length; column++) {
      const numbers = [];

      for (let row = 0; row < this.state.length; row++) {
        if (this.state[row][column] !== 0) {
          numbers.push(this.state[row][column]);
        }
      }

      const mergedColumn = [];

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] === numbers[i + 1]) {
          const mergedNumber = numbers[i] * 2;

          mergedColumn.push(mergedNumber);
          this.score += mergedNumber;

          i++;
        } else {
          mergedColumn.push(numbers[i]);
        }
      }

      while (mergedColumn.length < this.state.length) {
        mergedColumn.push(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][column] = mergedColumn[row];
      }
    }

    const hasChanged = this.state.some((row, index) => {
      return row.some((number, column) => {
        return number !== previousState[index][column];
      });
    });

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }

    return hasChanged;
  }
  moveDown() {
    const previousState = this.state.map((row) => [...row]);

    for (let column = 0; column < this.state[0].length; column++) {
      const numbers = [];

      for (let row = this.state.length - 1; row >= 0; row--) {
        if (this.state[row][column] !== 0) {
          numbers.push(this.state[row][column]);
        }
      }

      const mergedColumn = [];

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] === numbers[i + 1]) {
          const mergedNumber = numbers[i] * 2;

          mergedColumn.push(mergedNumber);
          this.score += mergedNumber;

          i++;
        } else {
          mergedColumn.push(numbers[i]);
        }
      }

      while (mergedColumn.length < this.state.length) {
        mergedColumn.unshift(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][column] = mergedColumn[row];
      }
    }

    const hasChanged = this.state.some((row, index) => {
      return row.some((number, column) => {
        return number !== previousState[index][column];
      });
    });

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }

    return hasChanged;
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

    for (let i = 0; i < 2; i++) {
      const emptyCells = [];

      for (let row = 0; row < this.state.length; row++) {
        for (let column = 0; column < this.state[row].length; column++) {
          if (this.state[row][column] === 0) {
            emptyCells.push({ row, column });
          }
        }
      }

      if (emptyCells.length === 0) {
        break;
      }

      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      let value;

      if (Math.random() < 0.9) {
        value = 2;
      } else {
        value = 4;
      }

      this.state[randomCell.row][randomCell.column] = value;
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] === 0) {
          emptyCells.push({ row, column });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[randomCell.row][randomCell.column] = value;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  checkWin() {
    return this.state.some((row) => row.includes(2048));
  }

  checkLose() {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] === 0) {
          return false;
        }

        if (
          column < this.state[row].length - 1 &&
          this.state[row][column] === this.state[row][column + 1]
        ) {
          return false;
        }

        if (
          row < this.state.length - 1 &&
          this.state[row][column] === this.state[row + 1][column]
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

// module.exports = Game;
export default Game;
