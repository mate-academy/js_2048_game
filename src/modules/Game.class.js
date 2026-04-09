'use strict';

class Game {
  constructor(initialState) {
    this.initialConfig = initialState
      ? initialState.map((row) => [...row])
      : null;

    if (initialState) {
      this.grid = initialState.map((row) => [...row]);
    } else {
      this.grid = Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    }

    this.score = 0;
    this.status = 'idle';
  }

  processRow(row) {
    let filteredRow = row.filter((num) => num !== 0);

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        const newNum = (filteredRow[i] *= 2);

        filteredRow[i + 1] = 0;
        this.score += newNum;
      }
    }

    filteredRow = filteredRow.filter((n) => n !== 0);

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  transpose() {
    const result = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));

    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        result[c][r] = this.grid[r][c];
      }
    }

    this.grid = result;
  }

  canMove() {
    const flat = [...this.grid].flat();

    if (flat.includes(0)) {
      return true;
    }

    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        if (c < 3 && this.grid[r][c] === this.grid[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.grid[r][c] === this.grid[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  afterMove(wasChanged) {
    if (this.grid.flat().includes(2048)) {
      this.status = 'win';
    }

    if (wasChanged) {
      this.addRandomTile();
    }

    if (this.status === 'playing' && !this.canMove()) {
      this.status = 'lose';
    }
  }

  processFullGrid(reverseRows = false) {
    if (this.status !== 'playing') {
      return false;
    }

    let wasChanged = false;

    for (let r = 0; r < this.grid.length; r++) {
      const originRow = this.grid[r];
      const rowToProcess = reverseRows ? [...originRow].reverse() : originRow;
      const row = this.processRow(rowToProcess);

      if (reverseRows) {
        row.reverse();
      }

      if (row.join(',') !== originRow.join(',')) {
        wasChanged = true;
      }

      this.grid[r] = row;
    }

    return wasChanged;
  }

  moveLeft() {
    const changed = this.processFullGrid(false);

    this.afterMove(changed);
  }

  moveRight() {
    const changed = this.processFullGrid(true);

    this.afterMove(changed);
  }

  moveUp() {
    this.transpose();

    const changed = this.processFullGrid(false);

    this.transpose();

    this.afterMove(changed);
  }

  moveDown() {
    this.transpose();

    const changed = this.processFullGrid(true);

    this.transpose();

    this.afterMove(changed);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.grid;
  }

  getStatus() {
    return this.status;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        if (this.grid[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return 0;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const value = Math.random() < 0.1 ? 4 : 2;

    this.grid[randomCell.r][randomCell.c] = value;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';

    if (this.initialConfig) {
      this.grid = this.initialConfig.map((row) => [...row]);
    } else {
      this.grid = Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    }
  }
}

module.exports = Game;
