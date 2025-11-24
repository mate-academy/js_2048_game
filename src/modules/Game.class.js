'use strict';
class Game {
  constructor(initialState) {
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.state = this.cloneMatrix(initialState);
      this.initialState = this.cloneMatrix(initialState);
    } else {
      this.state = Array(4)
        .fill()
        .map(() => Array(4).fill(0));
      this.initialState = this.cloneMatrix(this.state);
    }
  }

  cloneMatrix(m) {
    return m.map((r) => [...r]);
  }
  moveLeft() {
    const old = this.cloneMatrix(this.state);
    let total = 0;

    for (let r = 0; r < 4; r++) {
      const { row, gained } = this.processRowLeft(this.state[r]);

      this.state[r] = row;
      total += gained;
    }

    if (!this.equalsMatrix(old, this.state)) {
      this.score += total;
      this.addRandomTile();

      if (this.has2048()) {
        this.status = 'win';
      } else if (this.isGameOver()) {
        this.status = 'lose';
      } else {
        this.status = 'playing';
      }
    }
  }
  moveRight() {
    const old = this.cloneMatrix(this.state);
    let total = 0;

    for (let r = 0; r < 4; r++) {
      const reversedRow = this.state[r].slice().reverse();
      const { row, gained } = this.processRowLeft(reversedRow);

      this.state[r] = row.reverse();
      total += gained;
    }

    if (!this.equalsMatrix(old, this.state)) {
      this.score += total;
      this.addRandomTile();

      if (this.has2048()) {
        this.status = 'win';
      } else if (this.isGameOver()) {
        this.status = 'lose';
      } else {
        this.status = 'playing';
      }
    }
  }
  moveUp() {
    this.state = this.transpose(this.state);
    this.moveLeft();
    this.state = this.transpose(this.state);
  }
  moveDown() {
    this.state = this.transpose(this.state);
    this.moveRight();
    this.state = this.transpose(this.state);
  }
  getScore() {
    return this.score;
  }
  getState() {
    return this.cloneMatrix(this.state);
  }
  getStatus() {
    return this.status;
  }
  start() {
    if (this.status === 'idle') {
      this.addRandomTile();
      this.addRandomTile();
      this.status = 'playing';
    }
  }
  restart() {
    this.state = this.cloneMatrix(this.initialState);
    this.score = 0;
    this.status = 'idle';
    this.start();
  }
  transpose(matrix) {
    const res = Array(4)
      .fill()
      .map(() => Array(4).fill(0));

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        res[c][r] = matrix[r][c];
      }
    }

    return res;
  }
  reverseRows(matrix) {
    return matrix.map((row) => [...row].reverse());
  }
  equalsMatrix(a, b) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }

    return true;
  }
  addRandomTile() {
    const empties = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          empties.push([row, col]);
        }
      }
    }

    if (!empties.length) {
      return;
    }

    const [r, c] = empties[Math.floor(Math.random() * empties.length)];

    this.state[r][c] = Math.random() < 0.1 ? 4 : 2;
  }
  processRowLeft(row) {
    const arr = row.filter((x) => x !== 0);

    while (arr.length < 4) {
      arr.push(0);
    }

    let gained = 0;

    for (let i = 0; i < 3; i++) {
      if (arr[i] !== 0 && arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
        gained += arr[i];
        i++;
      }
    }

    const res = arr.filter((x) => x !== 0);

    while (res.length < 4) {
      res.push(0);
    }

    return {
      row: res,
      gained,
    };
  }

  has2048() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return false;
        }

        if (c < 3 && this.state[r][c] === this.state[r][c + 1]) {
          return false;
        }

        if (r < 3 && this.state[r][c] === this.state[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Game;
