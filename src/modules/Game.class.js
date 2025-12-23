'use strict';

class Game {
  constructor(initialState = null) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.isStarted = false;
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.isStarted = true;
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.isStarted = false;
    this.start();
  }

  addRandomCell() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;

      this.state[row][col] = value;
    }
  }

  moveLeft() {
    if (!this.isStarted) {
      return;
    }

    const newState = this.state.map((row) => this.mergeRow(row));
    const hasChanged = !this.isSameState(this.state, newState);

    if (hasChanged) {
      this.state = newState;
      this.addRandomCell();
      this.updateStatus();
    }
  }

  moveRight() {
    if (!this.isStarted) {
      return;
    }

    const newState = this.state.map((row) => {
      const reversed = row.slice().reverse();
      const merged = this.mergeRow(reversed);

      return merged.reverse();
    });
    const hasChanged = !this.isSameState(this.state, newState);

    if (hasChanged) {
      this.state = newState;
      this.addRandomCell();
      this.updateStatus();
    }
  }

  moveUp() {
    if (!this.isStarted) {
      return;
    }

    const transposed = this.transposeState(this.state);
    const newTransposed = transposed.map((row) => this.mergeRow(row));
    const newState = this.transposeState(newTransposed);
    const hasChanged = !this.isSameState(this.state, newState);

    if (hasChanged) {
      this.state = newState;
      this.addRandomCell();
      this.updateStatus();
    }
  }

  moveDown() {
    if (!this.isStarted) {
      return;
    }

    const transposed = this.transposeState(this.state);
    const newTransposed = transposed.map((row) => {
      const reversed = row.slice().reverse();
      const merged = this.mergeRow(reversed);

      return merged.reverse();
    });
    const newState = this.transposeState(newTransposed);
    const hasChanged = !this.isSameState(this.state, newState);

    if (hasChanged) {
      this.state = newState;
      this.addRandomCell();
      this.updateStatus();
    }
  }

  mergeRow(row) {
    const nonZero = row.filter((cell) => cell !== 0);
    const merged = [];
    let i = 0;

    while (i < nonZero.length) {
      if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
        const mergedValue = nonZero[i] * 2;

        merged.push(mergedValue);
        this.score += mergedValue;
        i += 2;
      } else {
        merged.push(nonZero[i]);
        i += 1;
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  transposeState(state) {
    const result = [];

    for (let col = 0; col < 4; col++) {
      result[col] = [];

      for (let row = 0; row < 4; row++) {
        result[col].push(state[row][col]);
      }
    }

    return result;
  }

  isSameState(state1, state2) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (state1[row][col] !== state2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  updateStatus() {
    if (this.hasWon()) {
      this.status = 'win';

      return;
    }

    if (this.hasLost()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  hasWon() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  hasLost() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return false;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return false;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
