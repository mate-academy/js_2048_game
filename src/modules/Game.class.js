'use strict';

class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const rowValues = this.state[row].filter((value) => value !== 0);

      for (let i = 0; i < rowValues.length - 1; i++) {
        if (rowValues[i] === rowValues[i + 1]) {
          rowValues[i] *= 2;
          this.score += rowValues[i];
          rowValues[i + 1] = 0;
          moved = true;
        }
      }

      const newRow = rowValues.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] !== newRow[col]) {
          moved = true;
        }
        this.state[row][col] = newRow[col];
      }
    }

    this.afterMove(moved);
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const rowValues = this.state[row].filter((value) => value !== 0);

      for (let i = rowValues.length - 1; i > 0; i--) {
        if (rowValues[i] === rowValues[i - 1]) {
          rowValues[i] *= 2;
          this.score += rowValues[i];
          rowValues[i - 1] = 0;
          moved = true;
        }
      }

      const newRow = rowValues.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] !== newRow[col]) {
          moved = true;
        }
        this.state[row][col] = newRow[col];
      }
    }

    this.afterMove(moved);
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const colValues = [];

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== 0) {
          colValues.push(this.state[row][col]);
        }
      }

      for (let i = 0; i < colValues.length - 1; i++) {
        if (colValues[i] === colValues[i + 1]) {
          colValues[i] *= 2;
          this.score += colValues[i];
          colValues[i + 1] = 0;
          moved = true;
        }
      }

      const newCol = colValues.filter((value) => value !== 0);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newCol[row]) {
          moved = true;
        }
        this.state[row][col] = newCol[row];
      }
    }

    this.afterMove(moved);
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const colValues = [];

      for (let row = 3; row >= 0; row--) {
        if (this.state[row][col] !== 0) {
          colValues.push(this.state[row][col]);
        }
      }

      for (let i = colValues.length - 1; i > 0; i--) {
        if (colValues[i] === colValues[i - 1]) {
          colValues[i] *= 2;
          this.score += colValues[i];
          colValues[i - 1] = 0;
          moved = true;
        }
      }

      const newCol = colValues.filter((value) => value !== 0);

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let row = 3; row >= 0; row--) {
        if (this.state[row][col] !== newCol[row]) {
          moved = true;
        }

        this.state[row][col] = newCol[row];
      }
    }

    this.afterMove(moved);
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

  generateNewCells(count) {
    const emptyCells = [];
    let remaining = count;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    while (remaining > 0 && emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];

      this.state[row][col] = Math.random() < 0.1 ? 4 : 2;

      emptyCells.splice(randomIndex, 1);

      remaining--;
    }
  }

  start() {
    this.status = 'playing';
    this.generateNewCells(2);
  }

  restart() {
    this.score = 0;
    this.status = 'playing';

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.generateNewCells(2);
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  afterMove(moved) {
    if (moved) {
      this.generateNewCells(1);
      this.checkWin();
      this.checkLose();
    }
  }
}

module.exports = Game;
