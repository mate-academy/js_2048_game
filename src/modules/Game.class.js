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
    this.initialState = initialState.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let stateChanged = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.merge(this.state[row]);

      if (newRow.toString() !== this.state[row].toString()) {
        stateChanged = true;
      }

      this.state[row] = newRow;
    }

    if (stateChanged) {
      this.spawn();
    }

    this.checkLose();
    this.checkWin();
  }

  moveRight() {
    this.state = this.state.map((row) => row.reverse());
    this.moveLeft();
    this.state = this.state.map((row) => row.reverse());
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
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

    this.spawn();
    this.spawn();

    this.checkWin();
    this.checkLose();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  spawn() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          emptyTiles.push({ row, column });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { row, column } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.state[row][column] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  transpose() {
    const transposedGrid = this.initialState.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        transposedGrid[column][row] = this.state[row][column];
      }
    }

    this.state = transposedGrid;
  }

  merge(row) {
    let filteredRows = row.filter((element) => element !== 0);

    for (let i = 0; i < filteredRows.length - 1; i++) {
      if (filteredRows[i] === filteredRows[i + 1]) {
        filteredRows[i] *= 2;
        this.score += filteredRows[i];
        filteredRows[i + 1] = 0;
      }
    }

    filteredRows = filteredRows.filter((element) => element !== 0);

    while (filteredRows.length !== 4) {
      filteredRows.push(0);
    }

    return filteredRows;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          return;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (
          (row < 3 &&
            this.state[row][column] === this.state[row + 1][column]) ||
          (column < 3 &&
            this.state[row][column] === this.state[row][column + 1])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
