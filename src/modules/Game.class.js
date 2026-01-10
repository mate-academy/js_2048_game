'use strict';

class Game {
  constructor(onScoreChange = () => {}, onStatusChange = () => {}) {
    this.onScoreChange = onScoreChange;
    this.onStatusChange = onStatusChange;
    this.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.onScoreChange(this.score);
    this.onStatusChange(this.status);
  }

  restart() {
    this.start();
  }

  moveLeft() {
    this.handleMove(() => this.slide(this.state));
  }

  moveRight() {
    this.handleMove(() => {
      this.state = this.state.map((row) => row.reverse());
      this.slide(this.state);
      this.state = this.state.map((row) => row.reverse());
    });
  }

  moveUp() {
    this.handleMove(() => {
      this.state = this.transpose(this.state);
      this.slide(this.state);
      this.state = this.transpose(this.state);
    });
  }

  moveDown() {
    this.handleMove(() => {
      this.state = this.transpose(this.state);
      this.state = this.state.map((row) => row.reverse());
      this.slide(this.state);
      this.state = this.state.map((row) => row.reverse());
      this.state = this.transpose(this.state);
    });
  }

  handleMove(moveFn) {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.state);

    moveFn();

    if (prevState !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.updateStatus();
      this.onScoreChange(this.score);
      this.onStatusChange(this.status);
    }
  }

  slide(grid) {
    grid.forEach((row, i) => {
      let filtered = row.filter((x) => x !== 0);

      for (let j = 0; j < filtered.length - 1; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] *= 2;
          this.score += filtered[j];
          filtered[j + 1] = 0;
        }
      }

      filtered = filtered.filter((x) => x !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }

      grid[i] = filtered;
    });
  }

  addRandomTile() {
    const empty = [];

    this.state.forEach((row, r) => {
      row.forEach((v, c) => {
        if (v === 0) {
          empty.push([r, c]);
        }
      });
    });

    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];

      this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  updateStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    if (this.state.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
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

  transpose(m) {
    return m[0].map((_, i) => m.map((row) => row[i]));
  }
}

window.Game = Game;
