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
    // eslint-disable-next-line no-console
    if (initialState) {
      this.initialState = initialState.map((row) => row.slice());
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.state = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let hasChanged = false;

    for (let i = 0; i < 4; i++) {
      const currentRow = this.state[i];
      const newRow = this.processRow(currentRow);

      if (newRow.join() !== currentRow.join()) {
        this.state[i] = newRow;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.addRandomTile();
      this.updateGameStatus();
    }

    return hasChanged;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let hasChanged = false;

    for (let i = 0; i < 4; i++) {
      const row = this.state[i];

      const reversed = row.slice().reverse();
      const processed = this.processRow(reversed);
      const updatedRow = processed.reverse();

      if (row.join() !== updatedRow.join()) {
        this.state[i] = updatedRow;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.addRandomTile();
      this.updateGameStatus();
    }

    return hasChanged;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const newColumn = this.processRow(column);

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newColumn[row]) {
          this.state[row][col] = newColumn[row];
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.addRandomTile();
      this.updateGameStatus();
    }

    return hasChanged;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const reversed = column.slice().reverse();
      const processed = this.processRow(reversed);
      const newColumn = processed.reverse();

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newColumn[row]) {
          this.state[row][col] = newColumn[row];
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.addRandomTile();
      this.updateGameStatus();
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

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[x][y] = Math.random() < 0.1 ? 4 : 2;
  }

  processRow(row) {
    const result = [];
    let previous = null;

    for (const value of row) {
      if (value === 0) {
        continue;
      }

      if (previous === null) {
        previous = value;
        continue;
      }

      if (previous === value) {
        const mergedValue = previous * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        previous = null;
      } else {
        result.push(previous);
        previous = value;
      }
    }

    if (previous !== null) {
      result.push(previous);
    }

    while (result.length < row.length) {
      result.push(0);
    }

    return result;
  }

  updateGameStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return;
        }

        if (
          this.state[i][j] === this.state[i][j + 1] ||
          (this.state[i + 1] && this.state[i][j] === this.state[i + 1][j])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
