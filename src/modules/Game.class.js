/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
/* eslint-disable function-paren-newline */
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
    const defaultBoadr = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => row.slice())
      : defaultBoadr;

    this.field = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  addRandomTile() {
    const empties = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          empties.push([row, col]);
        }
      }
    }

    if (empties.length === 0) {
      return false;
    }

    const randomIdx = Math.floor(Math.random() * empties.length);
    const value = Math.random() < 0.1 ? 4 : 2;
    const [r, c] = empties[randomIdx];

    this.field[r][c] = value;

    return { r, c, value };
  }

  processLine(line) {
    const original = line.slice();
    const nonZero = original.filter((x) => x !== 0);
    let gained = 0;

    while (nonZero.length < 4) {
      nonZero.push(0);
    }

    for (let i = 0; i <= 2; i++) {
      if (nonZero[i] !== 0 && nonZero[i] === nonZero[i + 1]) {
        nonZero[i] = nonZero[i] * 2;
        nonZero[i + 1] = 0;
        gained += nonZero[i];
        i++;
      }
    }

    const final = nonZero.filter((x) => x !== 0);

    while (final.length < 4) {
      final.push(0);
    }

    const changed = final.some((v, idx) => v !== original[idx]);

    return { newLine: final, gained, changed };
  }

  isMoveAvailable() {
    if (this.field.some((row) => row.includes(0))) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.field[row][col] === this.field[row][col + 1]) {
          return true;
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === this.field[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    let moved = false;
    let totalGained = 0;

    for (let row = 0; row < 4; row++) {
      const { newLine, gained, changed } = this.processLine(this.field[row]);

      if (changed) {
        this.field[row] = newLine;
        totalGained += gained;
        moved = true;
      }
    }

    if (moved === true) {
      this.score += totalGained;
      this.addRandomTile();
    }

    if (this.field.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.isMoveAvailable()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }

  moveRight() {
    let moved = false;
    let totalGained = 0;

    for (let row = 0; row < 4; row++) {
      const reversed = this.field[row].slice().reverse();
      const { newLine, gained, changed } = this.processLine(reversed);

      if (changed) {
        this.field[row] = newLine.slice().reverse();
        totalGained += gained;
        moved = true;
      }
    }

    if (moved === true) {
      this.score += totalGained;
      this.addRandomTile();
    }

    if (this.field.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.isMoveAvailable()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }

  moveUp() {
    let moved = false;
    let totalGained = 0;
    const transposed = Array.from({ length: 4 }, (_, c) =>
      this.field.map((row) => row[c]),
    );

    for (let с = 0; с < 4; с++) {
      const { newLine, gained, changed } = this.processLine(transposed[с]);

      if (changed) {
        transposed[с] = newLine.slice();
        totalGained += gained;
        moved = true;
      }
    }

    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        this.field[r][c] = transposed[c][r];
      }
    }

    if (moved === true) {
      this.score += totalGained;
      this.addRandomTile();
    }

    if (this.field.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.isMoveAvailable()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }

  moveDown() {
    let moved = false;
    let totalGained = 0;
    const transposed = Array.from({ length: 4 }, (_, c) =>
      this.field.map((row) => row[c]),);

    for (let c = 0; c < 4; c++) {
      const reversed = transposed[c].slice().reverse();
      const { newLine, gained, changed } = this.processLine(reversed);

      if (changed) {
        transposed[c] = newLine.slice().reverse();
        totalGained += gained;
        moved = true;
      }
    }

    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        this.field[r][c] = transposed[c][r];
      }
    }

    if (moved === true) {
      this.score += totalGained;
      this.addRandomTile();
    }

    if (this.field.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.isMoveAvailable()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
