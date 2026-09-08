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

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      this.state[row] = this.state[row].filter((num) => num !== 0);

      for (let col = 0; col < this.state[row].length - 1; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          this.state[row][col] *= 2;
          this.score += this.state[row][col];
          this.state[row][col + 1] = 0;
          col++;
        }
      }
      this.state[row] = this.state[row].filter((num) => num !== 0);

      while (this.state[row].length < 4) {
        this.state[row].push(0);
      }
    }

    if (this.isStateChanged(oldState)) {
      this.addRandomTile();

      if (!this.checkWin()) {
        this.checkLose();
      }
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      this.state[row] = this.state[row].filter((num) => num !== 0);

      for (let col = this.state[row].length - 1; col > 0; col--) {
        if (this.state[row][col] === this.state[row][col - 1]) {
          this.state[row][col] *= 2;
          this.score += this.state[row][col];
          this.state[row][col - 1] = 0;
          col--;
        }
      }
      this.state[row] = this.state[row].filter((num) => num !== 0);

      while (this.state[row].length < 4) {
        this.state[row].unshift(0);
      }
    }

    if (this.isStateChanged(oldState)) {
      this.addRandomTile();

      if (!this.checkWin()) {
        this.checkLose();
      }
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      for (let row = 0; row < column.length - 1; row++) {
        if (column[row] === column[row + 1]) {
          column[row] *= 2;
          this.score += column[row];
          column[row + 1] = 0;
          row++;
        }
      }

      column = column.filter((num) => num !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = column[row];
      }
    }

    if (this.isStateChanged(oldState)) {
      this.addRandomTile();

      if (!this.checkWin()) {
        this.checkLose();
      }
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      for (let row = column.length - 1; row > 0; row--) {
        if (column[row] === column[row - 1]) {
          column[row] *= 2;
          this.score += column[row];
          column[row - 1] = 0;
          row--;
        }
      }

      column = column.filter((num) => num !== 0);

      while (column.length < 4) {
        column.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = column[row];
      }
    }

    if (this.isStateChanged(oldState)) {
      this.addRandomTile();

      if (!this.checkWin()) {
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
    this.status = 'idle';
    this.score = 0;
    this.state = this.initialState.map((row) => [...row]);
  }

  addRandomTile() {
    const emptyCells = [];

    for (let randomRow = 0; randomRow < 4; randomRow++) {
      for (let randomCol = 0; randomCol < 4; randomCol++) {
        if (this.state[randomRow][randomCol] === 0) {
          emptyCells.push([randomRow, randomCol]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  isStateChanged(oldState) {
    return JSON.stringify(oldState) !== JSON.stringify(this.state);
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    if (this.state.flat().includes(0)) {
      return false;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];

        if (
          (row > 0 && this.state[row - 1][col] === current) ||
          (row < 3 && this.state[row + 1][col] === current) ||
          (col > 0 && this.state[row][col - 1] === current) ||
          (col < 3 && this.state[row][col + 1] === current)
        ) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }
}

module.exports = Game;
