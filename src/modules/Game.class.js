'use strict';

class Game {
  static Status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = [...initialState];
    this.status = Game.Status.idle;
    this.score = 0;
    this.initialState = initialState;
    this.rows = 4;
    this.collumns = 4;
  }

  moveLeft() {
    if (this.status === Game.Status.playing) {
      let isMovable = false;

      for (let r = 0; r < this.rows.length; r++) {
        const values = [];

        for (let c = 0; c < this.collumns.length; c++) {
          if (this.state[r][c] !== 0) {
            values.push(this.state[r][c]);
          }
        }

        for (let i = 0; i < values.length; i++) {
          if (values[i] === values[i + 1]) {
            values[i] *= 2;
            values[i + 1] = 0;
            this.score += values[i];
            isMovable = true;
          }
        }

        const updatedRow = values.filter((value) => value !== 0);

        while (updatedRow.length < this.rows.length) {
          updatedRow.push(0);
        }

        for (let c = 0; c < 4; c++) {
          if (this.state[r][c] !== updatedRow[c]) {
            this.state[r][c] = updatedRow[c];
            isMovable = true;
          }
        }
      }

      if (isMovable) {
        this.getRandomCells();
        this.checkGameStatus();
      }
    }
  }

  moveRight() {
    if (this.status === Game.Status.playing) {
      let isMovable = false;

      for (let r = 0; r < this.rows.length; r++) {
        const values = [];

        for (let c = this.collumns.length - 1; c >= 0; c--) {
          if (this.state[r][c] !== 0) {
            values.push(this.state[r][c]);
          }
        }

        for (let i = 0; i < values.length; i++) {
          if (values[i] === values[i + 1]) {
            values[i] *= 2;
            values[i + 1] = 0;
            this.score += values[i];
            isMovable = true;
          }
        }

        const updatedRow = values.filter((value) => value !== 0);

        while (updatedRow.length < this.rows.length) {
          updatedRow.unshift(0);
        }

        for (let c = 0; c < this.collumns.length; c++) {
          if (this.state[r][c] !== updatedRow[this.collumns.length - 1 - c]) {
            this.state[r][c] = updatedRow[this.collumns.length - 1 - c];
            isMovable = true;
          }
        }
      }

      if (isMovable) {
        this.getRandomCells();
        this.checkGameStatus();
      }
    }
  }
  moveUp() {}
  moveDown() {}

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {}

  restart() {}

  getRandomCells() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells > 0) {
      const { randomR, randomC } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomR][randomC] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameStatus() {
    let isMovable = false;
    let hasEmptyCells = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 2048) {
          this.status = Game.Status.win;

          return;
        }

        if (this.state[r][c] === 0) {
          hasEmptyCells = true;
        }

        if (
          (r < 3 && this.state[r][c] === this.state[r + 1][c]) ||
          (c < 3 && this.state[r][c] === this.state[r][c + 1])
        ) {
          isMovable = true;
        }
      }
    }

    if (!isMovable && !hasEmptyCells) {
      this.status = Game.Status.lose;
    }
  }
}

module.exports = Game;
