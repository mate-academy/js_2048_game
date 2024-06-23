'use strict';

class Game {
  constructor(initialState = Game.DEFAULT_STATE) {
    this.WIN_NUMBER = 2048;
    this.STATUS_PLAYING = 'playing';
    this.STATUS_IDLE = 'idle';
    this.STATUS_LOSE = 'lose';
    this.STATUS_WIN = 'win';
    this.DEFAULT_STATE = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState;
    this.state = this.deepCloneArray(this.initialState);
    this.status = this.STATUS_IDLE;
    this.score = 0;
  }

  deepCloneArray(arr) {
    return arr.map((row) => [...row]);
  }

  moveLeft() {
    // [2, 2, 4, 0]
    if (
      this.status === Game.STATUS_WIN ||
      this.status === Game.STATUS_LOSE ||
      this.status === Game.STATUS_IDLE
    ) {
      return;
    }

    const prevState = JSON.stringify(this.state);

    for (let i = 0; i < this.state.length; i++) {
      let row = this.state[i].filter((val) => val !== 0); // [2, 2, 4]

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0; // [4, 0, 4]

          if (row[j] === Game.WIN_NUMBER) {
            this.status = Game.STATUS_WIN;
          }

          this.score += row[j];
        }
      }

      row = row.filter((val) => val !== 0); // [4, 4]

      while (row.length < this.state[i].length) {
        row.push(0);
      } // [4, 4, 0, 0]

      this.state[i] = row;
    }

    if (prevState !== JSON.stringify(this.state)) {
      this.addRandomTile();
    }

    if (!this.movesAvailable()) {
      this.status = Game.STATUS_LOSE;
    }
  }

  moveRight() {
    if (
      this.status === Game.STATUS_WIN ||
      this.status === Game.STATUS_LOSE ||
      this.status === Game.STATUS_IDLE
    ) {
      return;
    }

    const prevState = JSON.stringify(this.state);

    // [0, 4, 2, 2]
    for (let i = 0; i < this.state.length; i++) {
      let row = this.state[i].filter((val) => val !== 0); // [4, 2, 2]

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          row[j - 1] = 0;

          if (row[j] === Game.WIN_NUMBER) {
            this.status = Game.STATUS_WIN;
          }

          this.score += row[j]; // [4, 0, 4]
        }
      }

      row = row.filter((val) => val !== 0); // [4, 4]

      while (row.length < this.state[i].length) {
        row.unshift(0);
      } // [0, 0, 4, 4]

      this.state[i] = row;
    }

    if (prevState !== JSON.stringify(this.state)) {
      this.addRandomTile();
    }

    if (!this.movesAvailable()) {
      this.status = Game.STATUS_LOSE;
    }
  }

  moveUp() {
    if (
      this.status === Game.STATUS_WIN ||
      this.status === Game.STATUS_LOSE ||
      this.status === Game.STATUS_IDLE
    ) {
      return;
    }

    const prevState = JSON.stringify(this.state);

    for (let col = 0; col < this.state[0].length; col++) {
      let column = [];

      for (let row = 0; row < this.state.length; row++) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          column[i + 1] = 0;

          if (column[i] === Game.WIN_NUMBER) {
            this.status = Game.STATUS_WIN;
          }

          this.score += column[i];
        }
      }

      column = column.filter((val) => val !== 0);

      while (column.length < this.state.length) {
        column.push(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = column[row];
      }
    }

    if (prevState !== JSON.stringify(this.state)) {
      this.addRandomTile();
    }

    if (!this.movesAvailable()) {
      this.status = Game.STATUS_LOSE;
    }
  }

  moveDown() {
    if (
      this.status === Game.STATUS_WIN ||
      this.status === Game.STATUS_LOSE ||
      this.status === Game.STATUS_IDLE
    ) {
      return;
    }

    const prevState = JSON.stringify(this.state);
    for (let col = 0; col < this.state[0].length; col++) {
      let column = [];

      for (let row = 0; row < this.state.length; row++) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          column[i - 1] = 0;

          if (column[i] === Game.WIN_NUMBER) {
            this.status = Game.STATUS_WIN;
          }

          this.score += column[i];
        }
      }

      column = column.filter((val) => val !== 0);

      while (column.length < this.state.length) {
        column.unshift(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = column[row];
      }
    }

    if (prevState !== JSON.stringify(this.state)) {
      this.addRandomTile();
    }

    if (!this.movesAvailable()) {
      this.status = Game.STATUS_LOSE;
    }
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
    this.status = Game.STATUS_PLAYING;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.deepCloneArray(this.initialState);
    this.score = 0;
    this.status = Game.STATUS_IDLE;
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const { x, y } = emptyTiles[randomIndex];

    this.state[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  movesAvailable() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }

        if (i > 0 && this.state[i][j] === this.state[i - 1][j]) {
          return true;
        }

        if (
          i < this.state.length - 1 &&
          this.state[i][j] === this.state[i + 1][j]
        ) {
          return true;
        }

        if (j > 0 && this.state[i][j] === this.state[i][j - 1]) {
          return true;
        }

        if (
          j < this.state[i].length - 1 &&
          this.state[i][j] === this.state[i][j + 1]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
