export class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.state = initialState || this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
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
    this.state = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const empty = [];

    // eslint-disable-next-line no-shadow
    for (let r = 0; r < 4; r++) {
      // eslint-disable-next-line no-shadow
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let row = this.state[r].filter((value) => value !== 0);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row[i + 1] = 0;
        }
      }

      row = row.filter((value) => value !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      if (row.join() !== this.state[r].join()) {
        moved = true;
      }

      this.state[r] = row;
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let row = this.state[r].filter((value) => value !== 0);

      for (let i = row.length - 1; i > 0; i--) {
        if (row[i] === row[i - 1]) {
          row[i] *= 2;
          this.score += row[i];
          row[i - 1] = 0;
        }
      }

      row = row.filter((value) => value !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }

      if (row.join() !== this.state[r].join()) {
        moved = true;
      }

      this.state[r] = row;
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      let column = [];

      for (let r = 0; r < 4; r++) {
        if (this.state[r][c] !== 0) {
          column.push(this.state[r][c]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
        }
      }

      column = column.filter((value) => value !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let r = 0; r < 4; r++) {
        if (this.state[r][c] !== column[r]) {
          moved = true;
        }

        this.state[r][c] = column[r];
      }
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      let column = [];

      for (let r = 3; r >= 0; r--) {
        if (this.state[r][c] !== 0) {
          column.push(this.state[r][c]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
        }
      }

      column = column.filter((value) => value !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let r = 3; r >= 0; r--) {
        const value = column[3 - r];

        if (this.state[r][c] !== value) {
          moved = true;
        }

        this.state[r][c] = value;
      }
    }

    if (moved) {
      this.addRandomTile();
    }
  }
}
