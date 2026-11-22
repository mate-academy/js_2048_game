'use strict';

const SIZE = 4;
const WIN_VALUE = 2048;
const FOUR_PROBABILITY = 0.1;

class Game {
  /**
   * @param {number[][]} initialState
   */
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Game.createEmptyBoard();

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  static createEmptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  moveLeft() {
    this.move((state) => state.map((row) => Game.slideLine(row)));
  }

  moveRight() {
    this.move((state) => state.map((row) => Game.slideLineReversed(row)));
  }

  moveUp() {
    this.move((state) => {
      const columns = Game.transpose(state).map((col) => Game.slideLine(col));

      return Game.transposeResults(columns);
    });
  }

  moveDown() {
    this.move((state) => {
      const columns = Game.transpose(state).map((col) => {
        return Game.slideLineReversed(col);
      });

      return Game.transposeResults(columns);
    });
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
   * @returns {string} 'idle' | 'playing' | 'win' | 'lose'
   */
  getStatus() {
    return this.status;
  }

  start() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';

    this.addRandomCell();
    this.addRandomCell();
    this.updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // ---------- helpers ----------

  /**
   * Applies a move. `slide` receives the current state and returns
   * either an array of `{ line, gained }` (for rows) — see below.
   */
  move(slide) {
    if (this.status !== 'playing') {
      return;
    }

    const results = slide(this.state);
    const newState = results.map((result) => result.line);
    const gained = results.reduce((sum, result) => sum + result.gained, 0);

    if (!this.isDifferent(newState)) {
      return;
    }

    this.state = newState;
    this.score += gained;
    this.addRandomCell();
    this.updateStatus();
  }

  /**
   * Slides one line to the start and merges equal neighbours once.
   *
   * @param {number[]} line
   * @returns {{ line: number[], gained: number }}
   */
  static slideLine(line) {
    const cells = line.filter((n) => n !== 0);
    const merged = [];
    let gained = 0;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === cells[i + 1]) {
        const value = cells[i] * 2;

        merged.push(value);
        gained += value;
        i++;
      } else {
        merged.push(cells[i]);
      }
    }

    while (merged.length < SIZE) {
      merged.push(0);
    }

    return { line: merged, gained };
  }

  /**
   * Slides one line to the end (reversed direction).
   *
   * @param {number[]} line
   * @returns {{ line: number[], gained: number }}
   */
  static slideLineReversed(line) {
    const result = Game.slideLine([...line].reverse());

    return { line: result.line.reverse(), gained: result.gained };
  }

  static transpose(state) {
    return state[0].map((_, col) => state.map((row) => row[col]));
  }

  /**
   * Turns per-column results back into per-row results.
   */
  static transposeResults(columns) {
    const lines = Game.transpose(columns.map((c) => c.line));
    const gained = columns.reduce((sum, c) => sum + c.gained, 0);

    // Gained score is attached to the first row only; it is summed later.
    return lines.map((line, i) => ({ line, gained: i === 0 ? gained : 0 }));
  }

  isDifferent(newState) {
    const oldCells = this.state.flat();

    return newState.flat().some((value, i) => value !== oldCells[i]);
  }

  addRandomCell() {
    const empty = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) {
          empty.push([rowIndex, colIndex]);
        }
      });
    });

    if (empty.length === 0) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.state[r][c] = Math.random() < FOUR_PROBABILITY ? 4 : 2;
  }

  hasMoves() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const value = this.state[r][c];

        if (value === 0) {
          return true;
        }

        if (this.state[r][c + 1] === value) {
          return true;
        }

        if (this.state[r + 1] && this.state[r + 1][c] === value) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.state.some((row) => row.some((n) => n >= WIN_VALUE))) {
      this.status = 'win';

      return;
    }

    this.status = this.hasMoves() ? 'playing' : 'lose';
  }
}

module.exports = Game;
