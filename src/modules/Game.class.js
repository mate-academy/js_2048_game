'use strict';

export default class Game {
  constructor(initialState = null) {
    this.field = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';

    this.addRandomTile();
    this.addRandomTile();
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      let newRow = this.field[row].filter(val => val !== 0);
      let mergedRow = [];
      let scoreIncrease = 0;

      for (let i = 0; i < newRow.length; i++) {
        if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          scoreIncrease += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      while (mergedRow.length < 4) mergedRow.push(0);

      if (!this.arraysEqual(this.field[row], mergedRow)) moved = true;
      this.field[row] = mergedRow;
      this.score += scoreIncrease;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.field = this.field.map(row => row.reverse());
    this.moveLeft();
    this.field = this.field.map(row => row.reverse());
  }

  moveUp() {
    this.field = this.flip(this.field);
    this.moveLeft();
    this.field = this.flip(this.field);
  }

  moveDown() {
    this.field = this.flip(this.field);
    this.moveRight();
    this.field = this.flip(this.field);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.field;
  }

  getStatus() {
    return this.status;
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
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 0) emptyCells.push([i, j]);
      }
    }

    if (emptyCells.length === 0) return;

    let [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.field[x][y] = Math.random() < 0.1 ? 4 : 2;
  }

  flip(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  }

  checkGameStatus() {
    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }
  }

  checkWin() {
    return this.field.some(row => row.includes(2048));
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 0) return false;
        if (i < 3 && this.field[i][j] === this.field[i + 1][j]) return false;
        if (j < 3 && this.field[i][j] === this.field[i][j + 1]) return false;
      }
    }
    return true;
  }

  arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
