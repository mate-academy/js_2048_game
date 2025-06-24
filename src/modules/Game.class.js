'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.state = initialState;
    } else {
      this.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randRow, randCol] = emptyCells[randomIndex];

    this.state[randRow][randCol] = Math.random() < 0.9 ? 2 : 4;
  }

  processRowLeft(row) {
    const nonZero = row.filter((value) => value !== 0);

    for (let i = 0; i < nonZero.length - 1; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        nonZero[i] *= 2;
        this.score += nonZero[i];
        nonZero[i + 1] = 0;
        i++;
      }
    }

    const merged = nonZero.filter((value) => value !== 0);

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  moved(prev, curr) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (prev[row][col] !== curr[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    const prevState = this.getState();

    this.state = this.state.map((row) => this.processRowLeft(row));

    if (this.moved(prevState, this.state)) {
      this.afterMove();
    }
  }

  moveRight() {
    const prevState = this.getState();

    this.state = this.state.map((row) => {
      const reversed = row.slice().reverse();
      const processed = this.processRowLeft(reversed);

      return processed.reverse();
    });

    if (this.moved(prevState, this.state)) {
      this.afterMove();
    }
  }

  moveUp() {
    const prevState = this.getState();

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.state[row][col]);
      }

      const processed = this.processRowLeft(column);

      for (let row = 0; row < this.size; row++) {
        this.state[row][col] = processed[row];
      }
    }

    if (this.moved(prevState, this.state)) {
      this.afterMove();
    }
  }
  moveDown() {
    const prevState = this.getState();

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.state[row][col]);
      }

      const reversed = column.slice().reverse();
      const processed = this.processRowLeft(reversed).reverse();

      for (let row = 0; row < this.size; row++) {
        this.state[row][col] = processed[row];
      }
    }

    if (this.moved(prevState, this.state)) {
      this.afterMove();
    }
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
    this.score = 0;
    this.status = 'playing';
    this.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.state = Array.from({ length: 4 }, () => Array(this.size).fill(0));
    this.status = 'idle';
    this.start();
  }

  afterMove() {
    this.addRandomTile();

    if (this.checkWin()) {
      this.status = 'win';
    } else if (!this.movesAvailable()) {
      this.status = 'lose';
    }
  }

  checkWin() {
    return this.state.some((row) => row.includes(2048));

    // console.log('checking win') //
  }

  movesAvailable() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (
          col < this.size - 1 &&
          this.state[row][col] === this.state[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.size - 1 &&
          this.state[row][col] === this.state[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
