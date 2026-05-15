'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = this.initialState.map((row) => [...row]);
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [tileRow, tileCol] = empty[Math.floor(Math.random() * empty.length)];

    this.state[tileRow][tileCol] = Math.random() < 0.9 ? 2 : 4;
  }

  slideRow(row) {
    const nums = row.filter((n) => n !== 0);
    const merged = [];
    let i = 0;

    while (i < nums.length) {
      if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
        const val = nums[i] * 2;

        merged.push(val);
        this.score += val;
        i += 2;
      } else {
        merged.push(nums[i]);
        i++;
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }
    this.move((row) => this.slideRow(row));
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }
    this.move((row) => this.slideRow([...row].reverse()).reverse());
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }
    this.transpose();
    this.move((row) => this.slideRow(row));
    this.transpose();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }
    this.transpose();
    this.move((row) => this.slideRow([...row].reverse()).reverse());
    this.transpose();
  }

  move(transform) {
    const prev = JSON.stringify(this.state);

    this.state = this.state.map(transform);

    if (JSON.stringify(this.state) !== prev) {
      this.addRandomTile();
    }

    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.hasMovesLeft()) {
      this.status = 'lose';
    }
  }

  transpose() {
    this.state = this.state[0].map((_, c) => this.state.map((row) => row[c]));
  }

  hasMovesLeft() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }

        if (c + 1 < 4 && this.state[r][c] === this.state[r][c + 1]) {
          return true;
        }

        if (r + 1 < 4 && this.state[r][c] === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
