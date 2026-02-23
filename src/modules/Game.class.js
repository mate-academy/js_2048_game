'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState || this.emptyBoard();
    this.state = this.copyState(this.initialState);
    this.status = 'idle';
    this.score = 0;
  }

  emptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  copyState(state) {
    return state.map(row => [...row]);
  }

  getState() {
    return this.copyState(this.state);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';

    if (this.isEmpty(this.state)) {
      this.addRandomTile();
      this.addRandomTile();
    } else {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  isEmpty(state) {
    return state.flat().every(n => n === 0);
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((val, colIndex) => {
        if (val === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });


    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const newState = this.state.map(row => this.compressAndMerge(row));

    if (!this.equals(newState, this.state)) {
      this.state = newState;
      this.addRandomTile();
    }
    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const newState = this.state.map(row => this.compressAndMerge([...row]
      .reverse()).reverse());

    if (!this.equals(newState, this.state)) {
      this.state = newState;
      this.addRandomTile();
    }
    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.state);
    const newTransposed = transposed.map(col => this.compressAndMerge(col));
    const newState = this.transpose(newTransposed);

    if (!this.equals(newState, this.state)) {
      this.state = newState;
      this.addRandomTile();
    }
    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.state);
    const newTransposed = transposed.map(col => this.compressAndMerge([...col]
      .reverse()).reverse());

    const newState = this.transpose(newTransposed);

    if (!this.equals(newState, this.state)) {
      this.state = newState;
      this.addRandomTile();
    }
    this.updateStatus();
  }

  compressAndMerge(line) {
    const filtered = line.filter(n => n !== 0);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const val = filtered[i] * 2;

        merged.push(val);
        this.score += val;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  transpose(state) {
    return state[0].map((_, c) => state.map(row => row[c]));
  }

  equals(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  updateStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.hasMoves()) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }

  hasMoves() {
    if (this.state.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.state[r][c];

        if (r < 3 && this.state[r + 1][c] === val) {
          return true;
        }

        if (c < 3 && this.state[r][c + 1] === val) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
