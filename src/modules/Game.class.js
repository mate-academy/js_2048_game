'use strict';
class Game {
  constructor(initialState) {
    if (initialState) {
      this.state = initialState.map((row) => [...row]);
    } else {
      this.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    }

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBefore = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => this.transformRow(row));

    this.afterMove(stateBefore);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBefore = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => this.transformRowRight(row));

    this.afterMove(stateBefore);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBefore = this.state.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = this.getColumn(col);
      const transformed = this.transformRow(column);

      this.setColumn(col, transformed);
    }

    this.afterMove(stateBefore);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBefore = this.state.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = this.getColumn(col);
      const transformed = this.transformRowRight(column);

      this.setColumn(col, transformed);
    }

    this.afterMove(stateBefore);
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
    if (this.status === 'playing') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'playing';
    this.state = Array.from({ length: 4 }, () => Array(4).fill(0));

    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const result = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          result.push([rowIndex, colIndex]);
        }
      });
    });

    if (result.length === 0) {
      return;
    }

    const random = Math.floor(Math.random() * result.length);
    const [r, c] = result[random];

    this.state[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  transformRow(row) {
    let newRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    newRow = newRow.filter((cell) => cell !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  transformRowRight(row) {
    const reverse = [...row].reverse();
    const transformed = this.transformRow(reverse);

    return [...transformed].reverse();
  }

  getColumn(col) {
    const column = [];

    for (let row = 0; row < 4; row++) {
      column.push(this.state[row][col]);
    }

    return column;
  }

  setColumn(col, newCol) {
    for (let row = 0; row < 4; row++) {
      this.state[row][col] = newCol[row];
    }
  }

  afterMove(stateBefore) {
    const moved = this.state.some((row, i) => {
      return row.some((cell, j) => cell !== stateBefore[i][j]);
    });

    if (moved) {
      this.addRandomTile();
    }

    const hasWon = this.state.some((row) => row.some((cell) => cell === 2048));

    if (hasWon) {
      this.status = 'win';
    }

    const hasEmpty = this.state.some((row) => row.some((cell) => cell === 0));

    if (!hasEmpty && !this.canMerge()) {
      this.status = 'lose';
    }
  }

  canMerge() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] !== 0) {
          if (
            (c + 1 < 4 && this.state[r][c] === this.state[r][c + 1]) ||
            (r + 1 < 4 && this.state[r][c] === this.state[r + 1][c])
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }
}

export default Game;

