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
    this.state = this.initialState.map((row) => row.slice());
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
    this.checkGameStatus();
  }

  moveRight() {
    for (const row of this.state) {
      row.reverse();
    }

    this.moveLeft();

    for (const row of this.state) {
      row.reverse();
    }
    this.checkGameStatus();
  }

  moveUp() {
    const columns = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (!columns[j]) {
          columns[j] = [];
        }
        columns[j][i] = this.state[i][j];
      }
    }

    // progress check
    const copy = columns.map((row) => row.slice());

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

    for (const row of columns) {
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
        this.state[i][j] = columns[j][i];
      }
    }

    if (!compareStates(copy, columns)) {
      this.addRandomTile();
    }
    this.checkGameStatus();
  }

  moveDown() {
    // Transpor e inverter colunas
    for (let j = 0; j < this.state[0].length; j++) {
      const col = [];

      for (let i = 0; i < this.state.length; i++) {
        col.push(this.state[i][j]);
      }

      col.reverse();

      for (let i = 0; i < this.state.length; i++) {
        this.state[i][j] = col[i];
      }
    }

    this.moveUp();

    // Reverter colunas novamente
    for (let j = 0; j < this.state[0].length; j++) {
      const col = [];

      for (let i = 0; i < this.state.length; i++) {
        col.push(this.state[i][j]);
      }
      col.reverse();

      for (let i = 0; i < this.state.length; i++) {
        this.state[i][j] = col[i];
      }
    }

    this.checkGameStatus();
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
  /**
   * Resets the game.
   */
  restart() {
    this.status = 'playing';
    this.score = 0;
    this.state = this.initialState.map((row) => row.slice());
    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here
  addRandomTile() {
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

    emptyCells.sort(() => Math.random() - 0.5);

    const [x, y] = emptyCells[0];

    this.state[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  checkGameStatus() {
    const has2048 = this.state.some((row) => row.includes(2048));

    if (has2048) {
      this.status = 'win';

      return;
    }

    const has0 = this.state.some((row) => row.includes(0));

    if (has0) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.state[i][j];
        const right = this.state[i][j + 1];
        const down = this.state[i + 1]?.[j];

        if (current === right || current === down) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
