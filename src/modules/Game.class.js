'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : null;
    this.setup();
  }

  setup() {
    const emptyGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.grid = this.initialState
      ? this.initialState.map((row) => [...row])
      : emptyGrid;
    this.score = 0;
    this.status = 'idle';
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
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.setup();
    this.start();
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];

      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slide(row) {
    const line = row.filter((v) => v !== 0);

    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i + 1]) {
        line[i] *= 2;
        this.score += line[i];

        if (line[i] === 2048) {
          this.status = 'win';
        }

        line.splice(i + 1, 1);
      }
    }

    while (line.length < 4) {
      line.push(0);
    }

    return line;
  }

  moveLeft() {
    this.processMove(() => {
      this.grid = this.grid.map((row) => this.slide(row));
    });
  }

  moveRight() {
    this.processMove(() => {
      this.grid = this.grid.map((row) => {
        const reversed = [...row].reverse();
        const slid = this.slide(reversed);

        return slid.reverse();
      });
    });
  }

  moveUp() {
    this.processMove(() => {
      for (let c = 0; c < 4; c++) {
        const col = [0, 1, 2, 3].map((r) => this.grid[r][c]);
        const next = this.slide(col);

        next.forEach((v, r) => {
          this.grid[r][c] = v;
        });
      }
    });
  }

  moveDown() {
    this.processMove(() => {
      for (let c = 0; c < 4; c++) {
        const col = [3, 2, 1, 0].map((r) => this.grid[r][c]);
        const next = this.slide(col);

        next.forEach((v, r) => {
          this.grid[3 - r][c] = v;
        });
      }
    });
  }

  processMove(moveFn) {
    if (this.status !== 'playing') {
      return;
    }

    const old = JSON.stringify(this.grid);

    moveFn();

    if (old !== JSON.stringify(this.grid)) {
      this.addRandomTile();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  canMove() {
    if (this.grid.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && this.grid[r][c] === this.grid[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.grid[r][c] === this.grid[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
