'use strict';

class Game {
  constructor(initialState) {
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = (initialState || defaultState).map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => this.mergeRow(row));

    if (!this.statesEqual(prevState, this.state)) {
      this.addRandomCell();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);
    const reverseRow = (row) => this.mergeRow([...row].reverse()).reverse();

    this.state = this.state.map(reverseRow);

    if (!this.statesEqual(prevState, this.state)) {
      this.addRandomCell();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);
    const transposed = this.transpose(this.state);
    const merged = transposed.map((col) => this.mergeRow(col));

    this.state = this.transpose(merged);

    if (!this.statesEqual(prevState, this.state)) {
      this.addRandomCell();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);
    const transposed = this.transpose(this.state);
    const reverseCol = (col) => this.mergeRow([...col].reverse()).reverse();
    const merged = transposed.map(reverseCol);

    this.state = this.transpose(merged);

    if (!this.statesEqual(prevState, this.state)) {
      this.addRandomCell();
      this.updateStatus();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  mergeRow(row) {
    const cells = row.filter((n) => n !== 0);
    const result = [];
    let i = 0;

    while (i < cells.length) {
      if (i + 1 < cells.length && cells[i] === cells[i + 1]) {
        const merged = cells[i] * 2;

        this.score += merged;
        result.push(merged);
        i += 2;
      } else {
        result.push(cells[i]);
        i += 1;
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIdx) => matrix.map((row) => row[colIdx]));
  }

  statesEqual(a, b) {
    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      for (let colIdx = 0; colIdx < 4; colIdx++) {
        if (a[rowIdx][colIdx] !== b[rowIdx][colIdx]) {
          return false;
        }
      }
    }

    return true;
  }

  addRandomCell() {
    const emptyCells = [];

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      for (let colIdx = 0; colIdx < 4; colIdx++) {
        if (this.state[rowIdx][colIdx] === 0) {
          emptyCells.push([rowIdx, colIdx]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [targetRow, targetCol] = emptyCells[randomIndex];

    this.state[targetRow][targetCol] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    for (const row of this.state) {
      if (row.includes(0)) {
        return true;
      }
    }

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      for (let colIdx = 0; colIdx < 3; colIdx++) {
        if (this.state[rowIdx][colIdx] === this.state[rowIdx][colIdx + 1]) {
          return true;
        }
      }
    }

    for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
      for (let colIdx = 0; colIdx < 4; colIdx++) {
        if (this.state[rowIdx][colIdx] === this.state[rowIdx + 1][colIdx]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
