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
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.state = this.initialState;
    this.status = 'idle';
  }

  moveLeft() {
    // progress check
    const copy = this.state.map((row) => row.slice());

    function compareStates(state1, state2) {
      for (let i = 0; i < state1.length; i++) {
        for (let j = 0; j < state1[i].length; j++) {
          if (state1[i][j] !== state2[i][j]) {
            return false;
          }
        }
      }

      return true;
    }

    for (const row of this.state) {
      // Remove zeros from the row
      const newRow = row.filter((tile) => tile !== 0);
      // Combine tiles

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;

          this.score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }
      // Fill the rest of the row with zeros

      while (newRow.length < this.state[0].length) {
        newRow.push(0);
      }
      row.splice(0, this.state[0].length, ...newRow);
    }

    if (!compareStates(copy, this.state)) {
      this.addRandomTile();
    }
  }

  moveRight() {
    for (const row of this.state) {
      row.reverse();
    }

    this.moveLeft();

    for (const row of this.state) {
      row.reverse();
    }
  }

  moveUp() {
    const coluns = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (!coluns[j]) {
          coluns[j] = [];
        }
        coluns[j][i] = this.state[i][j];
      }
    }

    // progress check
    const copy = coluns.map((row) => row.slice());

    function compareStates(state1, state2) {
      for (let i = 0; i < state1.length; i++) {
        for (let j = 0; j < state1[i].length; j++) {
          if (state1[i][j] !== state2[i][j]) {
            return false;
          }
        }
      }

      return true;
    }

    for (const row of coluns) {
      // Remove zeros from the row
      const newRow = row.filter((tile) => tile !== 0);
      // Combine tiles

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;

          this.score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }
      // Fill the rest of the row with zeros

      while (newRow.length < this.state[0].length) {
        newRow.push(0);
      }
      row.splice(0, this.state[0].length, ...newRow);
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        this.state[i][j] = coluns[j][i];
      }
    }

    if (!compareStates(copy, coluns)) {
      this.addRandomTile();
    }
  }

  moveDown() {
    const coluns = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (!coluns[j]) {
          coluns[j] = [];
        }
        coluns[j][i] = this.state[i][j];
      }
    }

    coluns.forEach((row) => row.reverse());

    this.state = coluns;
    this.moveUp();
    this.state.forEach((row) => row.reverse());
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
    this.state = this.initialState.map((row) => row.slice());
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    emptyCells.sort(() => Math.random() - 0.5);

    const [x, y] = emptyCells[0];

    this.state[x][y] = Math.random() < 0.9 ? 2 : 4;
  }
  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.state = this.initialState.map((row) => row.slice());
    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here
}

export default Game;
