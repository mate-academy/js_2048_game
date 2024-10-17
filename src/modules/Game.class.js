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
    // eslint-disable-next-line no-console
    this.initialState = initialState;
    this.copeInitialState = initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    if (this.status === 'playing') {
      const copyInitialState = this.initialState.map((row) => [...row]);

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        const newRow = [];

        for (let i = 0; i < 4; i++) {
          if (this.initialState[rowIndex][i] !== 0) {
            newRow.push(this.initialState[rowIndex][i]);
          }
        }

        this.merchCails(newRow);

        for (let index = 0; index < 4; index++) {
          this.initialState[rowIndex][index] = newRow[index] || 0;
        }
      }

      if (this.canMove(copyInitialState, this.initialState)) {
        this.randomCail();
      }
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const copyInitialState = this.initialState.map((row) => [...row]);

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        const newRow = [];

        for (let i = 3; i >= 0; i--) {
          if (this.initialState[rowIndex][i] !== 0) {
            newRow.push(this.initialState[rowIndex][i]);
          }
        }

        this.merchCails(newRow);

        let newRowIndex = 0;

        for (let index = 3; index >= 0; index--) {
          this.initialState[rowIndex][index] = newRow[newRowIndex] || 0;
          newRowIndex++;
        }
      }

      if (this.canMove(copyInitialState, this.initialState)) {
        this.randomCail();
      }
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const copyInitialState = this.initialState.map((row) => [...row]);

      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        const newColumn = [];

        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          if (this.initialState[rowIndex][columnIndex] !== 0) {
            newColumn.push(this.initialState[rowIndex][columnIndex]);
          }
        }

        this.merchCails(newColumn);

        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          this.initialState[rowIndex][columnIndex] = newColumn[rowIndex] || 0;
        }
      }

      if (this.canMove(copyInitialState, this.initialState)) {
        this.randomCail();
      }
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const copyInitialState = this.initialState.map((row) => [...row]);

      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        const newColumn = [];

        for (let rowIndex = 3; rowIndex >= 0; rowIndex--) {
          if (this.initialState[rowIndex][columnIndex] !== 0) {
            newColumn.push(this.initialState[rowIndex][columnIndex]);
          }
        }

        this.merchCails(newColumn);

        let index = 0;

        for (let rowIndex = 3; rowIndex >= 0; rowIndex--) {
          this.initialState[rowIndex][columnIndex] = newColumn[index] || 0;
          index++;
        }
      }

      if (this.canMove(copyInitialState, this.initialState)) {
        this.randomCail();
      }
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
    return this.initialState;
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
    if (this.checkGameOver(this.initialState)) {
      this.status = 'lose';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    let count = 0;

    while (count < 2) {
      this.randomCail();
      count++;
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.initialState = this.copeInitialState;
  }

  // Add your own methods here
  randomCail() {
    const hasEmptyCells = this.initialState.some((row) => row.includes(0));
    const increaseValue = Math.random() < 0.1 ? 4 : 2;
    const maxNumber = this.initialState.length;

    if (hasEmptyCells) {
      while (true) {
        const randomIndexRow = Math.floor(Math.random() * maxNumber);
        const randomIndexCail = Math.floor(Math.random() * maxNumber);

        if (this.initialState[randomIndexRow][randomIndexCail] === 0) {
          this.initialState[randomIndexRow][randomIndexCail] = increaseValue;
          break;
        }
      }
    } else {
      this.status = 'lose';
    }
  }

  canMove(oldState, newState) {
    for (let i = 0; i < this.initialState.length; i++) {
      for (let j = 0; j < this.initialState.length; j++) {
        if (oldState[i][j] !== newState[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameOver(state) {
    for (let i = 0; i < this.initialState.length; i++) {
      for (let j = 0; j < this.initialState.length; j++) {
        if (state[i][j] === 0) {
          return false;
        }
      }
    }

    for (let i = 0; i < this.initialState.length; i++) {
      for (let j = 0; j < this.initialState.length; j++) {
        if (
          j < this.initialState.length - 1 &&
          state[i][j] === state[i][j + 1]
        ) {
          return false;
        }

        if (
          i < this.initialState.length - 1 &&
          state[i][j] === state[i + 1][j]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  merchCails(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1] && row[i]) {
        row[i] *= 2;
        this.score += row[i];

        if (row[i] === 2048) {
          this.status = 'win';
        }
        row.splice(i + 1, 1);
      }
    }
  }
}

module.exports = Game;
