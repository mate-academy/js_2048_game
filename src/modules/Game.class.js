'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
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
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.rotateClockwise();
    this.move('left');
    this.rotateCounterClockwise();
  }

  moveDown() {
    this.rotateClockwise();
    this.move('right');
    this.rotateCounterClockwise();
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.state);

    this.state = this.state.map((row) => {
      const values = row.filter((value) => value !== 0);

      if (direction === 'right') {
        values.reverse();
      }

      const merged = [];

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          const value = values[i] * 2;

          merged.push(value);
          this.score += value;
          i++;
        } else {
          merged.push(values[i]);
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      if (direction === 'right') {
        merged.reverse();
      }

      return merged;
    });

    if (previousState === JSON.stringify(this.state)) {
      return;
    }

    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    this.addRandomTile();

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((currentRow, r) => {
      currentRow.forEach((value, c) => {
        if (value === 0) {
          emptyCells.push([r, c]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.state[r][c] === this.state[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.state[r][c] === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  rotateClockwise() {
    this.state = this.state[0].map((_, c) => {
      return this.state.map((row) => row[c]).reverse();
    });
  }

  rotateCounterClockwise() {
    this.state = this.state[0].map((_, c) => {
      return this.state.map((row) => row[3 - c]);
    });
  }
}

module.exports = Game;
