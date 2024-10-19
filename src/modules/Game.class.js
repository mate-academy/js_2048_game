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
    this.state = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.deepCopyState();

    for (let row = 0; row < this.state.length; row++) {
      let newRow = this.state[row].filter((num) => num !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.state[row] = newRow;
    }

    if (this.hasStateChanged(prevState)) {
      this.addRandomTile();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.deepCopyState();

    for (let row = 0; row < this.state.length; row++) {
      let newRow = this.state[row].reverse().filter((num) => num !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.state[row] = newRow.reverse();
    }

    if (this.hasStateChanged(prevState)) {
      this.addRandomTile();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.deepCopyState();
    const transposed = transpose(this.state);

    for (let row = 0; row < transposed.length; row++) {
      let newRow = transposed[row].filter((num) => num !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      transposed[row] = newRow;
    }

    this.state = transpose(transposed);

    if (this.hasStateChanged(prevState)) {
      this.addRandomTile();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.deepCopyState();
    const transposed = transpose(this.state);

    for (let row = 0; row < transposed.length; row++) {
      let newRow = transposed[row].reverse().filter((num) => num !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      transposed[row] = newRow.reverse();
    }

    this.state = transpose(transposed);

    if (this.hasStateChanged(prevState)) {
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.status = 'idle';
    this.score = 0;

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  hasEmptyCells() {
    for (const row of this.state) {
      if (row.includes(0)) {
        return true;
      }
    }

    return false;
  }

  canCombine() {
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        const current = this.state[row][col];

        if (
          (row > 0 && this.state[row - 1][col] === current) ||
          (row < 3 && this.state[row + 1][col] === current) ||
          (col > 0 && this.state[row][col - 1] === current) ||
          (col < 3 && this.state[row][col + 1] === current)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameState() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (this.canCombine() || this.hasEmptyCells()) {
      return;
    }

    this.status = 'lose';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  hasStateChanged(prevState) {
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] !== prevState[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  deepCopyState() {
    return this.state.map((row) => [...row]);
  }
}

function transpose(matrix) {
  const transposed = [];

  for (let i = 0; i < matrix[0].length; i++) {
    transposed[i] = [];

    for (let j = 0; j < matrix.length; j++) {
      transposed[i][j] = matrix[j][i];
    }
  }

  return transposed;
}

module.exports = Game;
