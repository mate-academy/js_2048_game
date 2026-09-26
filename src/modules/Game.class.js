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
    this.state = initialState.map((row) => [...row]);
    this.initialState = initialState.map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    this.state[0] = this.moveRow(this.state[0]);
    this.state[1] = this.moveRow(this.state[1]);
    this.state[2] = this.moveRow(this.state[2]);
    this.state[3] = this.moveRow(this.state[3]);

    if (!this.isSameState(oldState, this.state)) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    this.state[0] = this.moveRow([...this.state[0]].reverse()).reverse();
    this.state[1] = this.moveRow([...this.state[1]].reverse()).reverse();
    this.state[2] = this.moveRow([...this.state[2]].reverse()).reverse();
    this.state[3] = this.moveRow([...this.state[3]].reverse()).reverse();

    if (!this.isSameState(oldState, this.state)) {
      this.addRandomTile();
    }

    this.updateStatus();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
      const column = [
        this.state[0][columnIndex],
        this.state[1][columnIndex],
        this.state[2][columnIndex],
        this.state[3][columnIndex],
      ];

      const movedColumn = this.moveRow(column);

      for (let row = 0; row < 4; row++) {
        this.state[row][columnIndex] = movedColumn[row];
      }
    }

    if (!this.isSameState(oldState, this.state)) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
      const column = [
        this.state[0][columnIndex],
        this.state[1][columnIndex],
        this.state[2][columnIndex],
        this.state[3][columnIndex],
      ];

      const movedColumn = this.moveRow([...column].reverse()).reverse();

      for (let row = 0; row < 4; row++) {
        this.state[row][columnIndex] = movedColumn[row];
      }
    }

    if (!this.isSameState(oldState, this.state)) {
      this.addRandomTile();
    }

    this.updateStatus();
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state.length; column++) {
        if (this.state[row][column] === 0) {
          emptyCells.push([row, column]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [randomRow, randomColumn] = emptyCells[randomIndex];

    if (Math.random() < 0.1) {
      this.state[randomRow][randomColumn] = 4;
    } else {
      this.state[randomRow][randomColumn] = 2;
    }
  }

  moveRow(row) {
    let result = row.filter((item) => item !== 0);

    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === result[i + 1]) {
        result[i] = result[i] * 2;

        this.score += result[i];
        result[i + 1] = 0;
      }
    }

    result = result.filter((item) => item !== 0);

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  isSameState(oldState, newState) {
    for (let row = 0; row < oldState.length; row++) {
      for (let column = 0; column < oldState[row].length; column++) {
        if (oldState[row][column] !== newState[row][column]) {
          return false;
        }
      }
    }

    return true;
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          return true;
        }

        if (
          column < 3 &&
          this.state[row][column] === this.state[row][column + 1]
        ) {
          return true;
        }

        if (
          row < 3 &&
          this.state[row][column] === this.state[row + 1][column]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }
}

module.exports = Game;
