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

  status = 'idle';
  score = 0;
  board = [];

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // eslint-disable-next-line no-console
    // console.log(initialState);

    this.board = structuredClone(initialState);
    this.state = structuredClone(initialState);
  }

  moveLeft(state = this.state) {
    let changed = false;

    state.forEach((param, index) => {
      const newArray = [];

      for (let i = 0; i < param.length; i++) {
        if (param[i] !== 0) {
          newArray.push(param[i]);
        }
      }

      const newRow = [];

      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i] === newArray[i + 1]) {
          newRow.push(newArray[i] + newArray[i + 1]);

          this.score += newArray[i] + newArray[i + 1];

          i++;
        } else {
          newRow.push(newArray[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      for (let i = 0; i < param.length; i++) {
        if (param[i] !== newRow[i]) {
          changed = true;
        }
      }

      state[index] = newRow;
    });

    if (changed) {
      this.addRandom(state);
    }

    this.getStatus();
  }

  moveRight(state = this.state) {
    let changed = false;

    state.forEach((param, index) => {
      const newArray = [];

      for (let i = 0; i < param.length; i++) {
        if (param[i] !== 0) {
          newArray.unshift(param[i]);
        }
      }

      const newRow = [];

      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i] === newArray[i + 1]) {
          newRow.unshift(newArray[i] + newArray[i + 1]);

          this.score += newArray[i] + newArray[i + 1];

          i++;
        } else {
          newRow.unshift(newArray[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      for (let i = 0; i < param.length; i++) {
        if (param[i] !== newRow[i]) {
          changed = true;
        }
      }

      state[index] = newRow;
    });

    if (changed) {
      this.addRandom(state);
    }

    this.getStatus();
  }

  moveUp(state = this.state) {
    let changed = false;

    for (let columnI = 0; columnI < 4; columnI++) {
      const newArray = [];

      for (let i = 0; i < 4; i++) {
        if (state[i][columnI] !== 0) {
          newArray.push(state[i][columnI]);
        }
      }

      const newColumn = [];

      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i] === newArray[i + 1]) {
          newColumn.push(newArray[i] + newArray[i + 1]);

          this.score += newArray[i] + newArray[i + 1];

          i++;
        } else {
          newColumn.push(newArray[i]);
        }
      }

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (state[i][columnI] !== newColumn[i]) {
          changed = true;
        }

        state[i][columnI] = newColumn[i];
      }
    }

    if (changed) {
      this.addRandom(state);
    }

    this.getStatus();
  }

  moveDown(state = this.state) {
    let changed = false;

    for (let columnI = 0; columnI < 4; columnI++) {
      const newArray = [];

      for (let i = 0; i < 4; i++) {
        if (state[i][columnI] !== 0) {
          newArray.unshift(state[i][columnI]);
        }
      }

      const newColumn = [];

      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i] === newArray[i + 1]) {
          newColumn.unshift(newArray[i] + newArray[i + 1]);

          this.score += newArray[i] + newArray[i + 1];

          i++;
        } else {
          newColumn.unshift(newArray[i]);
        }
      }

      while (newColumn.length < 4) {
        newColumn.unshift(0);
      }

      for (let i = 0; i < 4; i++) {
        if (state[i][columnI] !== newColumn[i]) {
          changed = true;
        }

        state[i][columnI] = newColumn[i];
      }
    }

    if (changed) {
      this.addRandom(state);
    }

    this.getStatus();
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
    if (this.status === 'idle') {
      return this.status;
    }

    let hasEmpty = false;

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        const value = this.state[row][column];

        if (value === 2048) {
          this.status = 'win';

          return this.status;
        }

        if (value === 0) {
          hasEmpty = true;
        }
      }
    }

    if (hasEmpty) {
      this.status = 'playing';

      return this.status;
    }

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        const value = this.state[row][column];

        if (column < 3 && value === this.state[row][column + 1]) {
          this.status = 'playing';

          return this.status;
        }

        if (row < 3 && value === this.state[row + 1][column]) {
          this.status = 'playing';

          return this.status;
        }
      }
    }
    this.status = 'lose';

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    this.addRandom(this.state);
    this.addRandom(this.state);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.state = structuredClone(this.board);
  }

  addRandom(state) {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (state[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * empty.length);
    const randomCell = empty[randomIndex];

    const row = randomCell[0];
    const column = randomCell[1];

    if (Math.random() < 0.9) {
      state[row][column] = 2;
    } else {
      state[row][column] = 4;
    }
  }

  // Add your own methods here
}

module.exports = Game;
