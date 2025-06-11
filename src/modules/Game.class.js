'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Game {
  constructor(initialState) {
    this.state = initialState || this.getEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  getEmptyBoard() {
    return Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = this.getEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 0) {
          emptyCells.push({ y, x });
        }
      });
    });

    if (emptyCells.length > 0) {
      const { y, x } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[y][x] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    const newState = this.state.map((row) => {
      let nonZero = row.filter((cell) => cell !== 0);

      for (let i = 0; i < nonZero.length - 1; i++) {
        if (nonZero[i] === nonZero[i + 1]) {
          nonZero[i] *= 2;
          this.score += nonZero[i];
          nonZero[i + 1] = 0;
        }
      }

      nonZero = nonZero.filter((cell) => cell !== 0);

      while (nonZero.length < 4) {
        nonZero.push(0);
      }

      return nonZero;
    });

    const hasChanged = JSON.stringify(this.state) !== JSON.stringify(newState);

    if (hasChanged) {
      this.state = newState;
      this.addRandomTile();
      moved = true;
    }

    this.checkGameStatus();

    return moved;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    const newState = this.state.map((row) => {
      let nonZero = row.filter((cell) => cell !== 0).reverse();

      for (let i = 0; i < nonZero.length - 1; i++) {
        if (nonZero[i] === nonZero[i + 1]) {
          nonZero[i] *= 2;
          this.score += nonZero[i];
          nonZero[i + 1] = 0;
        }
      }

      nonZero = nonZero.filter((cell) => cell !== 0);

      while (nonZero.length < 4) {
        nonZero.push(0);
      }

      return nonZero.reverse();
    });

    const hasChanged = JSON.stringify(this.state) !== JSON.stringify(newState);

    if (hasChanged) {
      this.state = newState;
      this.addRandomTile();
      moved = true;
    }

    this.checkGameStatus();

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newState = this.getEmptyBoard();

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
        }
      }

      column = column.filter((cell) => cell !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let row = 0; row < 4; row++) {
        newState[row][col] = column[row];
      }
    }

    const hasChanged = JSON.stringify(this.state) !== JSON.stringify(newState);

    if (hasChanged) {
      this.state = newState;
      this.addRandomTile();
      moved = true;
    }

    this.checkGameStatus();

    return moved;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newState = this.getEmptyBoard();

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 3; row >= 0; row--) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
        }
      }

      column = column.filter((cell) => cell !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let row = 0; row < 4; row++) {
        newState[3 - row][col] = column[row];
      }
    }

    const hasChanged = JSON.stringify(this.state) !== JSON.stringify(newState);

    if (hasChanged) {
      this.state = newState;
      this.addRandomTile();
      moved = true;
    }

    this.checkGameStatus();

    return moved;
  }

  checkGameStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    if (this.state.some((row) => row.includes(0))) {
      return true;
    }

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 3; x++) {
        if (this.state[y][x] === this.state[y][x + 1]) {
          return true;
        }
      }
    }

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 3; y++) {
        if (this.state[y][x] === this.state[y + 1][x]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
