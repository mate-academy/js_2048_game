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
    this.initialState = initialState.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  mergeLine(line) {
    const filteredLine = line.filter((cell) => cell !== 0);
    const mergedLine = [];

    for (let i = 0; i < filteredLine.length; i++) {
      if (filteredLine[i] === filteredLine[i + 1]) {
        const value = filteredLine[i] * 2;

        mergedLine.push(value);
        this.score += value;
        i++;
      } else {
        mergedLine.push(filteredLine[i]);
      }
    }

    return mergedLine.concat(Array(4 - mergedLine.length).fill(0));
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    this.status = this.hasAvailableMoves() ? 'playing' : 'lose';
  }

  spawnRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let row = 0; row < 4; row++) {
      // eslint-disable-next-line no-shadow
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      const previousRow = [...this.state[row]];
      const mergedRow = this.mergeLine(this.state[row]);

      if (previousRow.some((cell, index) => cell !== mergedRow[index])) {
        hasChanged = true;
      }

      this.state[row] = mergedRow;
    }

    if (hasChanged) {
      this.spawnRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      const previousRow = [...this.state[row]];

      const mergedRow = this.mergeLine(
        [...this.state[row]].reverse(),
      ).reverse();

      if (previousRow.some((cell, index) => cell !== mergedRow[index])) {
        hasChanged = true;
      }

      this.state[row] = mergedRow;
    }

    if (hasChanged) {
      this.spawnRandomTile();
    }

    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      const previousColumn = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];
      const mergedColumn = this.mergeLine(previousColumn);

      if (previousColumn.some((cell, index) => cell !== mergedColumn[index])) {
        hasChanged = true;
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = mergedColumn[row];
      }
    }

    if (hasChanged) {
      this.spawnRandomTile();
    }

    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      // eslint-disable-next-line no-sparse-arrays
      const previousColumn = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];
      const mergedColumn = this.mergeLine(
        [...previousColumn].reverse(),
      ).reverse();

      if (previousColumn.some((cell, index) => cell !== mergedColumn[index])) {
        hasChanged = true;
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = mergedColumn[row];
      }
    }

    if (hasChanged) {
      this.spawnRandomTile();
    }

    this.updateStatus();
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length < 2) {
      return;
    }

    const [first, second] = emptyCells
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const value1 = Math.random() < 0.1 ? 4 : 2;
    const value2 = Math.random() < 0.1 ? 4 : 2;

    this.state[first[0]][first[1]] = value1;
    this.state[second[0]][second[1]] = value2;
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
}

module.exports = Game;
