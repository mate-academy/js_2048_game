'use strict';

export default class Game {
  constructor(initialState) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = structuredClone(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = structuredClone(this.state);

    for (let i = 0; i < 4; i++) {
      const row = this.state[i].filter((cell) => cell !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j + 1, 1);
        }
      }

      while (row.length < 4) {
        row.push(0);
      }
      this.state[i] = row;
    }

    if (prevState !== structuredClone(this.state)) {
      this.addRandomTile();
      this.updateGameStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = structuredClone(this.state);

    for (let i = 0; i < 4; i++) {
      const row = this.state[i].filter((cell) => cell !== 0);

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j - 1, 1);
          j--;
        }
      }

      while (row.length < 4) {
        row.unshift(0);
      }
      this.state[i] = row;
    }

    if (prevState !== structuredClone(this.state)) {
      this.addRandomTile();
      this.updateGameStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = structuredClone(this.state);

    for (let j = 0; j < 4; j++) {
      const column = [];

      for (let i = 0; i < 4; i++) {
        if (this.state[i][j] !== 0) {
          column.push(this.state[i][j]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i + 1, 1);
        }
      }

      while (column.length < 4) {
        column.push(0);
      }

      for (let i = 0; i < 4; i++) {
        this.state[i][j] = column[i];
      }
    }

    if (prevState !== structuredClone(this.state)) {
      this.addRandomTile();
      this.updateGameStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = structuredClone(this.state);

    for (let j = 0; j < 4; j++) {
      const column = [];

      for (let i = 0; i < 4; i++) {
        if (this.state[i][j] !== 0) {
          column.push(this.state[i][j]);
        }
      }

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i - 1, 1);
          i--;
        }
      }

      while (column.length < 4) {
        column.unshift(0);
      }

      for (let i = 0; i < 4; i++) {
        this.state[i][j] = column[i];
      }
    }

    if (prevState !== structuredClone(this.state)) {
      this.addRandomTile();
      this.updateGameStatus();
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
    this.state = structuredClone(this.initialState);
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = structuredClone(this.initialState);
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const arrayForEmptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          arrayForEmptyCells.push([i, j]);
        }
      }
    }

    if (arrayForEmptyCells.length > 0) {
      const [row, col] =
        arrayForEmptyCells[
          Math.floor(Math.random() * arrayForEmptyCells.length)
        ];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  hasWon() {
    return this.state.some((row) => row.some((cell) => cell === 2048));
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.state[i][j];

        if (
          (i < 3 && current === this.state[i + 1][j]) ||
          (j < 3 && current === this.state[i][j + 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  updateGameStatus() {
    if (this.hasWon()) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }
}
