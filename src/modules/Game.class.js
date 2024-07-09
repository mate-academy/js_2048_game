'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }
  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const oldState = JSON.stringify(this.state);

    for (let r = 0; r < this.state.length; r++) {
      let row = this.state[r];

      row = this.slide(row);
      this.state[r] = row;
    }

    const newState = JSON.stringify(this.state);

    if (oldState !== newState) {
      moved = true;
    }

    if (moved && !this.checkWin() && !this.checkLose()) {
      this.addRandomTile();
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const oldState = JSON.stringify(this.state);

    for (let r = 0; r < this.state.length; r++) {
      let row = this.state[r];

      row.reverse();

      row = this.slide(row);
      this.state[r] = row.reverse();
    }

    const newState = JSON.stringify(this.state);

    if (oldState !== newState) {
      moved = true;
    }

    if (moved && !this.checkWin() && !this.checkLose()) {
      this.addRandomTile();
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const oldState = JSON.stringify(this.state);

    for (let c = 0; c < this.state.length; c++) {
      let row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      row = this.slide(row);
      this.state[0][c] = row[0];
      this.state[1][c] = row[1];
      this.state[2][c] = row[2];
      this.state[3][c] = row[3];
    }

    const newState = JSON.stringify(this.state);

    if (oldState !== newState) {
      moved = true;
    }

    if (moved && !this.checkWin() && !this.checkLose()) {
      this.addRandomTile();
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const oldState = JSON.stringify(this.state);

    for (let c = 0; c < this.state.length; c++) {
      let row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      row.reverse();

      row = this.slide(row);
      row.reverse();
      this.state[0][c] = row[0];
      this.state[1][c] = row[1];
      this.state[2][c] = row[2];
      this.state[3][c] = row[3];
    }

    const newState = JSON.stringify(this.state);

    if (oldState !== newState) {
      moved = true;
    }

    if (moved && !this.checkWin() && !this.checkLose()) {
      this.addRandomTile();
    }
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
    this.addRandomTile();
    this.addRandomTile();

    this.status = 'playing';
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const cellIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[cellIndex];

    this.state[row][col] = Math.random() > 0.9 ? 4 : 2;
  }

  getEmptyCells() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
        if (row[cellIndex] === 0) {
          emptyCells.push([rowIndex, cellIndex]);
        }
      }
    });

    return emptyCells;
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  slide(row) {
    let newRow = this.filterZero(row);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        this.score += newRow[i];
      }
    }

    newRow = this.filterZero(newRow);

    while (newRow.length < this.state.length) {
      newRow.push(0);
    }

    this.checkWin();
    this.checkLose();

    return newRow;
  }

  checkWin() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  checkLose() {
    if (this.getEmptyCells().length > 0) {
      return false;
    }

    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (
          r < this.state.length - 1 &&
          this.state[r][c] === this.state[r + 1][c]
        ) {
          return false;
        }

        if (
          c < this.state[r].length - 1 &&
          this.state[r][c] === this.state[r][c + 1]
        ) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }
}

module.exports = Game;
