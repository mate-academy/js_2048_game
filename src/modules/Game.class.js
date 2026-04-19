'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
  constructor(initialState = null) {
    this.size = 4;

    this.initialState = initialState
      ? this.cloneState(initialState)
      : this.createEmptyBoard();

    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // =========================
  // Public API
  // =========================

  moveLeft() {
    return this.move(this.state);
  }

  moveRight() {
    const reversed = this.state.map((row) => [...row].reverse());
    const moved = this.move(reversed);

    this.state = reversed.map((row) => row.reverse());

    return moved;
  }

  moveUp() {
    const transposed = this.transpose(this.state);
    const moved = this.move(transposed);

    this.state = this.transpose(transposed);

    return moved;
  }

  moveDown() {
    let transposed = this.transpose(this.state);

    transposed = transposed.map((row) => row.reverse());

    const moved = this.move(transposed);

    transposed = transposed.map((row) => row.reverse());
    this.state = this.transpose(transposed);

    return moved;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.cloneState(this.state);
  }

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
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // =========================
  // Core logic
  // =========================

  move(board) {
    if (this.status !== 'playing') {
      return false;
    }

    const prevState = this.cloneState(board);

    for (let i = 0; i < this.size; i++) {
      let row = board[i];

      row = this.compress(row);
      row = this.merge(row);
      row = this.compress(row);

      board[i] = row;
    }

    if (!this.isDifferent(prevState, board)) {
      return false;
    }

    this.state = board;
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  compress(row) {
    const filtered = row.filter((x) => x !== 0);

    while (filtered.length < this.size) {
      filtered.push(0);
    }

    return filtered;
  }

  merge(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;

        this.score += row[i];
      }
    }

    return row;
  }

  // =========================
  // Helpers
  // =========================

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  isDifferent(a, b) {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  getEmptyCells() {
    const cells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.state[i][j] === 0) {
          cells.push([i, j]);
        }
      }
    }

    return cells;
  }

  addRandomTile() {
    const empty = this.getEmptyCells();

    if (!empty.length) {
      return;
    }

    const [i, j] = empty[Math.floor(Math.random() * empty.length)];

    this.state[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    if (this.has2048()) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  has2048() {
    return this.state.some((row) => row.includes(2048));
  }

  canMove() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const val = this.state[i][j];

        if (
          (this.state[i + 1] && this.state[i + 1][j] === val) ||
          this.state[i][j + 1] === val
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
