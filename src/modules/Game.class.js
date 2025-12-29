'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
    this.score = 0;
    this.status = 'idle';

    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    if (initialState) {
      this.initialState = initialState.map((r) => r.slice());
    }

    this.field = this.initialState.map((r) => r.slice());

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.status === 'win' || this.status === 'lose') {
      return false;
    }

    const newField = [];
    let totalGainedScore = 0;
    let changed = false;

    for (let r = 0; r < 4; r++) {
      const oldRow = this.field[r];
      const { newRow, gainedScore } = slideAndMergeRow(oldRow.slice());

      newField.push(newRow);
      totalGainedScore += gainedScore;

      for (let i = 0; i < 4; i++) {
        if (newRow[i] !== oldRow[i]) {
          changed = true;
          break;
        }
      }
    }

    if (!changed) {
      return false;
    }

    this.field = newField;
    this.score += totalGainedScore;
    this.addRandomTile();

    if (this.field.flat().includes(2048)) {
      this.status = 'win';
    } else {
      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    if (this.status === 'idle') {
      this.status = 'playing';
    }

    return true;
  }

  moveRight() {
    if (this.status === 'win' || this.status === 'lose') {
      return false;
    }

    const newField = [];
    let totalGainedScore = 0;
    let changed = false;

    for (let r = 0; r < 4; r++) {
      const oldRow = this.field[r];
      const { newRow, gainedScore } = slideAndMergeRow(
        oldRow.slice().reverse(),
      );

      const restored = newRow.slice().reverse();

      newField.push(restored);
      totalGainedScore += gainedScore;

      for (let i = 0; i < 4; i++) {
        if (restored[i] !== oldRow[i]) {
          changed = true;
          break;
        }
      }
    }

    if (!changed) {
      return false;
    }

    this.field = newField;
    this.score += totalGainedScore;
    this.addRandomTile();

    if (this.field.flat().includes(2048)) {
      this.status = 'win';
    } else {
      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    if (this.status === 'idle') {
      this.status = 'playing';
    }

    return true;
  }

  moveUp() {
    const t = this.transpose();

    if (this.status === 'win' || this.status === 'lose') {
      return false;
    }

    const newField = [];
    let totalGainedScore = 0;
    let changed = false;

    for (let r = 0; r < 4; r++) {
      const oldRow = t[r];
      const { newRow, gainedScore } = slideAndMergeRow(oldRow.slice());

      newField.push(newRow);
      totalGainedScore += gainedScore;

      for (let i = 0; i < 4; i++) {
        if (newRow[i] !== oldRow[i]) {
          changed = true;
          break;
        }
      }
    }

    if (!changed) {
      return false;
    }

    this.field = this._transpose(newField);
    this.score += totalGainedScore;
    this.addRandomTile();

    if (this.field.flat().includes(2048)) {
      this.status = 'win';
    } else {
      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    if (this.status === 'idle') {
      this.status = 'playing';
    }

    return true;
  }

  moveDown() {
    const t = this.transpose();

    if (this.status === 'win' || this.status === 'lose') {
      return false;
    }

    const newField = [];
    let totalGainedScore = 0;
    let changed = false;

    for (let r = 0; r < 4; r++) {
      const oldRow = t[r];
      const { newRow, gainedScore } = slideAndMergeRow(
        oldRow.slice().reverse(),
      );

      const restored = newRow.slice().reverse();

      newField.push(restored);
      totalGainedScore += gainedScore;

      for (let i = 0; i < 4; i++) {
        if (restored[i] !== oldRow[i]) {
          changed = true;
          break;
        }
      }
    }

    if (!changed) {
      return false;
    }

    this.field = this._transpose(newField);
    this.score += totalGainedScore;
    this.addRandomTile();

    if (this.field.flat().includes(2048)) {
      this.status = 'win';
    } else {
      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    if (this.status === 'idle') {
      this.status = 'playing';
    }

    return true;
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
    return this.field.map((r) => r.slice());
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

    if (this.field.flat().every((v) => v === 0)) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = this.initialState.map((r) => r.slice());
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const coords = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.field[r][c] === 0) {
          coords.push([r, c]);
        }
      }
    }

    if (coords.length <= 0) {
      return;
    }

    const idx = Math.floor(Math.random() * coords.length);
    const [row, col] = coords[idx];

    this.field[row][col] = Math.random() < 0.1 ? 4 : 2;

    return { row, col, value: this.field[row][col] };
  }

  canMove() {
    if (this.field.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && this.field[r][c] === this.field[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.field[r][c] === this.field[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose() {
    const n = this.field.length;
    const result = new Array(n).fill(null).map(() => new Array(n));

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        result[c][r] = this.field[r][c];
      }
    }

    return result;
  }
}

function slideAndMergeRow(row) {
  const newRow = [];
  let gainedScore = 0;
  const compact = row.filter((x) => x !== 0);

  for (let i = 0; i < compact.length; i++) {
    if (compact[i] === compact[i + 1]) {
      newRow.push(compact[i] * 2);

      gainedScore += compact[i] * 2;

      i++;
    } else {
      newRow.push(compact[i]);
    }
  }

  while (newRow.length < 4) {
    newRow.push(0);
  }

  return { newRow, gainedScore };
}

module.exports = Game;
