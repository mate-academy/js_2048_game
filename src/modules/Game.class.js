'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map(row => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.state = this.initialState.map(row => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  /* ===== GETTERS ===== */

  getState() {
    return this.state.map(row => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  /* ===== GAME CONTROL ===== */

  start() {
    if (this.status !== 'idle') return;

    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.state = this.initialState.map(row => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  /* ===== MOVES ===== */

  moveLeft() {
    return this.move(row => row);
  }

  moveRight() {
    return this.move(row => row.reverse());
  }

  moveUp() {
    this.transpose();
    const moved = this.move(row => row);
    this.transpose();
    return moved;
  }

  moveDown() {
    this.transpose();
    const moved = this.move(row => row.reverse());
    this.transpose();
    return moved;
  }

  /* ===== CORE LOGIC ===== */

  move(transform) {
    if (this.status !== 'playing') return false;

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const original = [...this.state[i]];
      let row = transform([...this.state[i]]);
      row = this.mergeRow(row);
      row = transform([...row]);

      if (!this.equal(original, row)) {
        moved = true;
      }

      this.state[i] = row;
    }

    if (!moved) return false;

    this.addRandomCell();
    this.updateStatus();
    return true;
  }

  mergeRow(row) {
    const nums = row.filter(n => n);
    const result = [];

    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === nums[i + 1]) {
        const merged = nums[i] * 2;
        this.score += merged;
        result.push(merged);
        i++;
      } else {
        result.push(nums[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  /* ===== HELPERS ===== */

  addRandomCell() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (!empty.length) return;

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';
      return;
    }

    this.status = this.hasMoves() ? 'playing' : 'lose';
  }

  hasMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const v = this.state[r][c];
        if (v === 0) return true;
        if (c < 3 && v === this.state[r][c + 1]) return true;
        if (r < 3 && v === this.state[r + 1][c]) return true;
      }
    }
    return false;
  }

  transpose() {
    this.state = this.state[0].map((_, i) =>
      this.state.map(row => row[i])
    );
  }

  equal(a, b) {
    return a.every((v, i) => v === b[i]);
  }
}

module.exports = Game;

