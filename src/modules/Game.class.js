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
    const emptyBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState || emptyBoard;
    this.state = initialState || emptyBoard;

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const oldState = this.state.map((row) => [...row]);
    const newState = [];

    for (let i = 0; i < this.state.length; i++) {
      newState[i] = this.processRow(this.state[i]);
    }

    const result = this.isStateChanged(oldState, newState);

    if (result) {
      this.state = newState;
      this.addRandomTile();
      this.checkWin();

      if (this.status !== 'win') {
        this.checkLose();
      }
    }
  }

  moveRight() {
    const oldState = this.state.map((row) => [...row]);
    const newState = [];

    for (let i = 0; i < this.state.length; i++) {
      const row = [...this.state[i]].reverse();
      const processed = this.processRow(row).reverse();

      newState[i] = processed;
    }

    const result = this.isStateChanged(oldState, newState);

    if (result) {
      this.state = newState;
      this.addRandomTile();
      this.checkWin();

      if (this.status !== 'win') {
        this.checkLose();
      }
    }
  }

  moveUp() {
    const oldState = this.state.map((row) => [...row]);
    const transposed = this.transpose(this.state);
    const newState = [];

    for (let i = 0; i < transposed.length; i++) {
      newState[i] = this.processRow(transposed[i]);
    }

    const resultState = this.transpose(newState);
    const result = this.isStateChanged(oldState, newState);

    if (result) {
      this.state = resultState;
      this.addRandomTile();
      this.checkWin();

      if (this.status !== 'win') {
        this.checkLose();
      }
    }
  }

  moveDown() {
    const oldState = this.state.map((row) => [...row]);
    const transposed = this.transpose(this.state);
    const newState = [];

    for (let i = 0; i < transposed.length; i++) {
      const row = [...transposed[i]].reverse();
      const processed = this.processRow(row).reverse();

      newState[i] = processed;
    }

    const resultState = this.transpose(newState);
    const result = this.isStateChanged(oldState, resultState);

    if (result) {
      this.state = resultState;
      this.addRandomTile();
      this.checkWin();

      if (this.status !== 'win') {
        this.checkLose();
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

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    const newState = [];

    for (let i = 0; i < this.initialState.length; i++) {
      newState[i] = [];

      for (let j = 0; j < this.initialState[i].length; j++) {
        newState[i][j] = this.initialState[i][j];
      }
    }

    this.state = newState;
    this.score = 0;
    this.status = 'idle';
  }

  // add your own methods here

  processRow(row) {
    const filtered = row.filter((n) => n !== 0);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;

        merged.push(value);
        this.score += value;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  transpose(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const result = [];

    for (let i = 0; i < cols; i++) {
      result[i] = [];

      for (let j = 0; j < rows; j++) {
        result[i][j] = matrix[j][i];
      }
    }

    return result;
  }

  isStateChanged(oldState, newState) {
    for (let i = 0; i < oldState.length; i++) {
      for (let j = 0; j < oldState[i].length; j++) {
        if (oldState[i][j] !== newState[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({
            row: i,
            col: j,
          });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    if (Math.random() < 0.9) {
      this.state[randomCell.row][randomCell.col] = 2;
    } else {
      this.state[randomCell.row][randomCell.col] = 4;
    }
  }

  checkWin() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkLose() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          return;
        }

        if (j < this.state[i].length - 1) {
          if (this.state[i][j] === this.state[i][j + 1]) {
            return;
          }
        }

        if (i < this.state.length - 1) {
          if (this.state[i][j] === this.state[i + 1][j]) {
            return;
          }
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
