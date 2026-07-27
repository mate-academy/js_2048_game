'use strict';
class Game {
  constructor(initialState) {
    const emptyBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : emptyBoard;

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  transformRow(row) {
    let filtered = row.filter((n) => n !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];

        if (filtered[i] === 2048) {
          this.status = 'win';
        }

        filtered[i + 1] = 0;
      }
    }
    filtered = filtered.filter((n) => n !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  boardsCompare(old, current) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (old[i][j] !== current[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => this.transformRow(row));

    if (!this.boardsCompare(oldState, this.state)) {
      this.addTile();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => {
      const reversed = [...row].reverse();
      const transformed = this.transformRow(reversed);

      return transformed.reverse();
    });

    if (!this.boardsCompare(oldState, this.state)) {
      this.addTile();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  transpose(matrix) {
    const result = [];

    for (let i = 0; i < 4; i++) {
      const newRow = [];

      for (let j = 0; j < 4; j++) {
        newRow.push(matrix[j][i]);
      }

      result.push(newRow);
    }

    return result;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);
    const transposed = this.transpose(this.state);

    this.state = transposed.map((row) => this.transformRow(row));
    this.state = this.transpose(this.state);

    if (!this.boardsCompare(oldState, this.state)) {
      this.addTile();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);
    const transposed = this.transpose(this.state);

    this.state = transposed.map((row) => {
      const reversed = [...row].reverse();
      const transformed = this.transformRow(reversed);

      return transformed.reverse();
    });

    this.state = this.transpose(this.state);

    if (!this.boardsCompare(oldState, this.state)) {
      this.addTile();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  canMove() {
    const emptyCell = this.state.some((row) => row.includes(0));

    if (emptyCell) {
      return true;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addTile();
    this.addTile();
  }

  restart() {
    this.status = 'idle';
    this.score = 0;
    this.state = this.initialState.map((row) => [...row]);
  }

  addTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[randomCell[0]][randomCell[1]] = value;
  }
}

module.exports = Game;
