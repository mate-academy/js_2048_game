'use strict';

const INITIAL_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Game {
  constructor(initialState) {
    this.initialState = initialState || INITIAL_STATE;
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  copyState(state) {
    return state.map((row) => row.slice());
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = this.state[row];
      const newRow = this.slide(currentRow);

      if (!this.arraysEqual(currentRow, newRow)) {
        this.state[row] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = this.state[row];
      const reversedRow = currentRow.slice().reverse();
      const newRow = this.slide(reversedRow).reverse();

      if (!this.arraysEqual(currentRow, newRow)) {
        this.state[row] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const currentCol = this.state.map((row) => row[col]);
      const newCol = this.slide(currentCol);

      if (!this.arraysEqual(currentCol, newCol)) {
        for (let row = 0; row < 4; row++) {
          this.state[row][col] = newCol[row];
        }
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const currentCol = this.state.map((row) => row[col]);
      const reversedCol = currentCol.slice().reverse();
      const newCol = this.slide(reversedCol).reverse();

      if (!this.arraysEqual(currentCol, newCol)) {
        for (let row = 0; row < 4; row++) {
          this.state[row][col] = newCol[row];
        }
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  slide(row) {
    const nonZero = row.filter((val) => val !== 0);
    const merged = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        merged.push(nonZero[i] * 2);
        this.score += nonZero[i] * 2;
        i++;
      } else {
        merged.push(nonZero[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  checkGameStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    const hasEmptyCells = this.state.flat().includes(0);
    const canMerge = this.canMerge();

    if (!hasEmptyCells && !canMerge) {
      this.status = 'lose';
    }
  }

  canMerge() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];

        if (current === 0) {
          continue;
        }

        if (col < 3 && current === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && current === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
