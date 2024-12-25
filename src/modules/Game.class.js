'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  size = 4;
  probability = 10;

  status = {
    started: false,
    lost: false,
    won: false,
  };

  score = 0;

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
  constructor(initialState = this.createField()) {
    this.state = initialState;
    this.initialState = this.copyState(initialState);
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.isPlaying) {
      return;
    }

    this.status.started = true;

    for (let _ = 0; _ < 2; _++) {
      this.addRandomCell();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.state = this.copyState(this.initialState);

    this.status.won = false;
    this.status.lost = false;
    this.status.started = false;
  }

  // #region moves logic
  moveRow(callback) {
    if (!this.isPlaying) {
      return;
    }

    const prevState = this.getState();

    for (let i = 0; i < this.size; i++) {
      this.state[i] = this.stackRow(this.state[i], callback);
    }

    if (this.isChanged(prevState)) {
      this.addRandomCell();
      this.status.lost = this.isLost;
    }
  }

  moveColumn(callback) {
    if (!this.isPlaying) {
      return;
    }

    const prevState = this.getState();

    for (let j = 0; j < this.size; j++) {
      const column = this.stackRow(
        this.state.map((row) => row[j]),
        callback,
      );

      column.forEach((cell, i) => (this.state[i][j] = cell));
    }

    if (this.isChanged(prevState)) {
      this.addRandomCell();
      this.status.lost = this.isLost;
    }
  }

  stackRow(initialRow, fillCallback) {
    const row = initialRow.filter(Boolean);

    for (let j = 1; j < row.length; j++) {
      if (row[j - 1] === row[j]) {
        const score = row[j - 1] * 2;

        if (score === 2048) {
          this.status.won = true;
        }

        row[j - 1] = score;
        this.score += score;

        row.splice(j, 1);
      }
    }

    while (row.length !== this.size) {
      fillCallback(row);
    }

    return row;
  }
  // #endregion

  // #region moves directions
  moveLeft() {
    this.moveRow((row) => row.push(0));
  }

  moveRight() {
    this.moveRow((row) => row.unshift(0));
  }

  moveUp() {
    this.moveColumn((column) => column.push(0));
  }

  moveDown() {
    this.moveColumn((column) => column.unshift(0));
  }
  // #endregion

  // #region utils
  createField() {
    return new Array(this.size)
      .fill(null)
      .map(() => new Array(this.size).fill(0));
  }

  copyState(state) {
    return state.map((row) => [...row]);
  }

  isChanged(prevState) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (prevState[i][j] !== this.state[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  get isPlaying() {
    switch (true) {
      case !this.status.started:
      case this.status.won:
      case this.status.lost:
        return false;

      default:
        return true;
    }
  }

  get isLost() {
    for (let i = 0; i < this.size; i++) {
      const column = this.state.map((row) => row[i]);

      if (this.hasMoves(this.state[i]) || this.hasMoves(column)) {
        return false;
      }
    }

    return true;
  }

  hasMoves(row) {
    if (row.includes(0)) {
      return true;
    }

    for (let i = 1; i < row.length; i++) {
      if (row[i - 1] === row[i]) {
        return true;
      }
    }

    return false;
  }
  // #endregion

  // #region add random cell
  addRandomCell() {
    const i = this.getRandomRow();
    const j = this.getRandomColumn(i);

    this.state[i][j] = !getRandomNumber(0, this.probability) ? 4 : 2;
  }

  getRandomRow() {
    const rows = [];

    for (let i = 0; i < this.size; i++) {
      if (this.state[i].includes(0)) {
        rows.push(i);
      }
    }

    return rows[getRandomNumber(0, rows.length)];
  }

  getRandomColumn(i) {
    const columns = [];
    const row = this.state[i];

    for (let j = 0; j < row.length; j++) {
      if (!row[j]) {
        columns.push(j);
      }
    }

    return columns[getRandomNumber(0, columns.length)];
  }
  // #endregion

  // #region getters
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
    return this.copyState(this.state);
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
    switch (true) {
      case !this.status.started:
        return 'idle';

      case this.status.won:
        return 'win';

      case this.status.lost:
        return 'lose';
    }

    return 'playing';
  }
  // #endregion
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = Game;
