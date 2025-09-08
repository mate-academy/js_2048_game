'use strict';
class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'playing';

    this.grid = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: this.size }, () => Array(this.size).fill(null));

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  getState() {
    return this.grid;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
  }

  addRandomTile() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!this.grid[i][j]) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [randomI, randomJ] = empty[Math.floor(Math.random() * empty.length)];

    this.grid[randomI][randomJ] = Math.random() < 0.1 ? 4 : 2;
  }

  move(direction) {
    const original = this.grid.map((row) => [...row]);
    const rotated = this.rotateGrid(this.grid, direction);
    const moved = rotated.map((row) => this.slideAndMerge(row));

    this.grid = this.rotateGrid(moved, (4 - direction) % 4);

    if (!this.isEqual(original, this.grid)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.status = 'win';

      // eslint-disable-next-line no-useless-return
      return;
    } else if (!this.canMove()) {
      this.status = 'lose';

      // eslint-disable-next-line no-useless-return
      return;
    }
  }

  moveLeft() {
    this.move(0);
  }
  moveUp() {
    this.move(1);
  }
  moveRight() {
    this.move(2);
  }
  moveDown() {
    this.move(3);
  }

  slideAndMerge(row) {
    const filtered = row.filter((v) => v !== null);
    const merged = [];
    let i = 0;

    while (i < filtered.length) {
      if (filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;

        this.score += value;
        merged.push(value);
        i += 2;
      } else {
        merged.push(filtered[i]);
        i += 1;
      }
    }

    while (merged.length < this.size) {
      merged.push(null);
    }

    return merged;
  }

  rotateGrid(grid, times) {
    let result = grid.map((row) => [...row]);

    for (let t = 0; t < times; t++) {
      result = result[0].map((_, i) => result.map((row) => row[i]).reverse());
    }

    return result;
  }

  isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  checkWin() {
    return this.grid.some((row) => row.includes(2048));
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const val = this.grid[i][j];

        if (val === null) {
          return true;
        }

        const neighbors = [
          [i + 1, j],
          [i - 1, j],
          [i, j + 1],
          [i, j - 1],
        ];

        for (const [x, y] of neighbors) {
          if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
            if (this.grid[x][y] === val) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }
}

export default Game;
