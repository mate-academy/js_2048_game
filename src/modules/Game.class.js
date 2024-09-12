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

  start() {
    this.score = 0;
    this.status = 'playing';
    this.fillOutRandomCell(this.generateNumber());
    this.fillOutRandomCell(this.generateNumber());
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  filterZero(row) {
    return row.filter((val) => val !== 0);
  }

  slide(row) {
    let modifiedRow = this.filterZero(row);

    for (let i = 0; i < modifiedRow.length - 1; i++) {
      if (modifiedRow[i] === modifiedRow[i + 1]) {
        modifiedRow[i] *= 2;
        modifiedRow[i + 1] = 0;
        this.score += modifiedRow[i];
      }
    }

    modifiedRow = this.filterZero(modifiedRow);

    while (modifiedRow.length < 4) {
      modifiedRow.push(0);
    }

    return modifiedRow;
  }

  moveLeft() {
    if (this.status === 'playing') {
      for (let r = 0; r < 4; r++) {
        let row = this.state[r];

        row = this.slide(row);
        this.state[r] = row;
      }
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      for (let r = 0; r < 4; r++) {
        let row = this.state[r];

        row.reverse();
        row = this.slide(row);
        row.reverse();
        this.state[r] = row;
      }
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      for (let c = 0; c < 4; c++) {
        let tempRow = [];

        for (let i = 0; i < 4; i++) {
          tempRow.push(this.state[i][c]);
        }

        tempRow = this.slide(tempRow);

        for (let j = 0; j < 4; j++) {
          this.state[j][c] = tempRow[j];
        }
      }
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      for (let c = 0; c < 4; c++) {
        let tempRow = [];

        for (let i = 0; i < 4; i++) {
          tempRow.push(this.state[i][c]);
        }
        tempRow.reverse();
        tempRow = this.slide(tempRow);
        tempRow.reverse();

        for (let j = 0; j < 4; j++) {
          this.state[j][c] = tempRow[j];
        }
      }
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

  generateNumber() {
    return Math.random() >= 0.9 ? 4 : 2;
  }

  getCellValue() {
    return Math.floor(Math.random() * 16);
  }

  fillOutRandomCell(value) {
    // getting array of empty cells
    let emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const randomCellIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomCellIndex];

      this.state[Math.floor(randomCell / 4)][randomCell % 4] = value;
      emptyCells = this.getEmptyCells();
    }

    if (emptyCells.length === 0) {
      if (!this.isMovePossible()) {
        this.status = 'lose';
      }
    }
  }

  getEmptyCells() {
    const emptyCells = [];
    const flatState = this.getState().flat();

    for (let i = 0; i < flatState.length; i++) {
      if (flatState[i] === 0) {
        emptyCells.push(i);
      }
    }

    return emptyCells;
  }

  updateStatus() {
    const win = this.state.filter((e) => e === 2048);

    if (win.length >= 1) {
      this.status = 'win';
    }
  }

  isMovePossible() {
    let result = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        // checking rows (move left|right)
        if (this.state[i][j] === this.state[i][j + 1]) {
          result = true;
        }

        // checking columns (move up|down)
        if (this.state[j][i] === this.state[j + 1][i]) {
          result = true;
        }
      }
    }

    return result;
  }
}

module.exports = Game;
