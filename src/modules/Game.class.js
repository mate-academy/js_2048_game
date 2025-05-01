'use strict';

export class Game {
  constructor(initialState) {
    this.field = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.field;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomCube();
    this.addRandomCube();
  }

  addRandomCube() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length !== 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      const randomValue = Math.random() < 0.9 ? 2 : 4;

      this.field[row][col] = randomValue;
    }
  }

  restart() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let fieldChanged = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.rowSlideCombine(this.field[row]);

      if (!this.arraysAreEqual(newRow, this.field[row])) {
        this.field[row] = newRow;
        fieldChanged = true;
      }
    }

    if (fieldChanged) {
      this.addRandomCube();
    }

    this.checkStatus();
  }

  moveRight() {
    let fieldChanged = false;

    for (let row = 0; row < 4; row++) {
      const reversedRow = [...this.field[row]].reverse();

      const newRow = this.rowSlideCombine(reversedRow).reverse();

      if (!this.arraysAreEqual(newRow, this.field[row])) {
        this.field[row] = newRow;
        fieldChanged = true;
      }
    }

    if (fieldChanged) {
      this.addRandomCube();
    }

    this.checkStatus();
  }

  moveUp() {
    let fieldChanged = false;

    for (let col = 0; col < 4; col++) {
      const column = this.field.map((row) => row[col]);
      const newColumn = this.rowSlideCombine(column);

      for (let row = 0; row < 4; row++) {
        if (this.field[row][col] !== newColumn[row]) {
          this.field[row][col] = newColumn[row];
          fieldChanged = true;
        }
      }
    }

    if (fieldChanged) {
      this.addRandomCube();
    }

    this.checkStatus();
  }

  moveDown() {
    let fieldChanged = false;

    for (let col = 0; col < 4; col++) {
      const reversedColumn = this.field.map((row) => row[col]).reverse();
      const newColumn = this.rowSlideCombine(reversedColumn).reverse();

      for (let row = 0; row < 4; row++) {
        if (this.field[row][col] !== newColumn[row]) {
          this.field[row][col] = newColumn[row];
          fieldChanged = true;
        }
      }
    }

    if (fieldChanged) {
      this.addRandomCube();
    }

    this.checkStatus();
  }

  rowSlideCombine(row) {
    const nonZeroCubes = row.filter((el) => el !== 0);

    for (let i = 0; i < nonZeroCubes.length - 1; i++) {
      if (nonZeroCubes[i] === nonZeroCubes[i + 1]) {
        nonZeroCubes[i] *= 2;
        this.score += nonZeroCubes[i];
        nonZeroCubes[i + 1] = 0;
      }
    }

    const newRow = nonZeroCubes.filter((el) => el !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  arraysAreEqual(a, b) {
    return a.every((value, index) => value === b[index]);
  }

  checkStatus() {
    for (const row of this.field) {
      for (const col of row) {
        if (col === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (const row of this.field) {
      if (row.includes(0)) {
        return;
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.field[row][col] === this.field[row][col + 1]) {
          return;
        }

        if (this.field[row][col] === this.field[row + 1][col]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}
