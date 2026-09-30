'use strict';

const SIZE = 4;
const WIN_VALUE = 2048;
const FOUR_PROBABILITY = 0.1;

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Game.emptyBoard();

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  static emptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  moveLeft() {
    this.move((row) => this.slideRow(row));
  }

  moveRight() {
    this.move((row) => this.slideRow([...row].reverse()).reverse());
  }

  moveUp() {
    this.move((col) => this.slideRow(col), true);
  }

  moveDown() {
    this.move((col) => this.slideRow([...col].reverse()).reverse(), true);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // --- helpers ---

  /**
   * Slides one line to the start of the array, merging equal neighbours
   * once per move. Returns the new line; adds merged values to the score.
   */
  slideRow(line) {
    const values = line.filter((n) => n !== 0);
    const result = [];

    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) {
        const merged = values[i] * 2;

        result.push(merged);
        this.score += merged;
        i++;
      } else {
        result.push(values[i]);
      }
    }

    while (result.length < SIZE) {
      result.push(0);
    }

    return result;
  }

  move(transform, vertical = false) {
    if (this.status !== 'playing') {
      return;
    }

    const prev = this.state.map((row) => [...row]);
    const scoreBefore = this.score;
    let next;

    if (vertical) {
      const columns = [];

      for (let c = 0; c < SIZE; c++) {
        columns.push(transform(prev.map((row) => row[c])));
      }

      next = prev.map((_, r) => columns.map((col) => col[r]));
    } else {
      next = prev.map((row) => transform(row));
    }

    const changed = next.some((line, i) => {
      return line.some((value, j) => value !== prev[i][j]);
    });

    if (!changed) {
      this.score = scoreBefore;

      return;
    }

    this.state = next;
    this.addRandomTile();
    this.updateStatus();
  }

  addRandomTile() {
    const empty = [];

    this.state.forEach((line, i) => {
      line.forEach((value, j) => {
        if (value === 0) {
          empty.push([i, j]);
        }
      });
    });

    if (empty.length === 0) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.state[r][c] = Math.random() < FOUR_PROBABILITY ? 4 : 2;
  }

  updateStatus() {
    if (this.state.some((row) => row.includes(WIN_VALUE))) {
      this.status = 'win';

      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  hasMoves() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const value = this.state[r][c];

        if (value === 0) {
          return true;
        }

        if (c + 1 < SIZE && this.state[r][c + 1] === value) {
          return true;
        }

        if (r + 1 < SIZE && this.state[r + 1][c] === value) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
