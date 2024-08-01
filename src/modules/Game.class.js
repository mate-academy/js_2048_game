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
    this.state = initialState.map((row) => [...row]);
    this.status = Game.Status.idle;
    this.initialState = initialState;
    this.score = 0;
  }

  moveLeft() {
    if (this.status === Game.Status.playing) {
      let isMovable = false;

      for (let r = 0; r < 4; r++) {
        const values = [];

        for (let c = 0; c < 4; c++) {
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

        while (updatedRow.length < 4) {
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

      for (let r = 0; r < 4; r++) {
        const values = [];

        for (let c = 3; c >= 0; c--) {
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

        while (updatedRow.length < 4) {
          updatedRow.push(0);
        }

        for (let c = 0; c < 4; c++) {
          if (this.state[r][c] !== updatedRow[3 - c]) {
            this.state[r][c] = updatedRow[3 - c];
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
  moveUp() {
    if (this.status === Game.Status.playing) {
      let isMovable = false;

      for (let c = 0; c < 4; c++) {
        const values = [];

        for (let r = 0; r < 4; r++) {
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

        const updatedColumn = values.filter((value) => value !== 0);

        while (updatedColumn.length < 4) {
          updatedColumn.push(0);
        }

        for (let r = 0; r < 4; r++) {
          if (this.state[r][c] !== updatedColumn[r]) {
            this.state[r][c] = updatedColumn[r];
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
  moveDown() {
    if (this.status === Game.Status.playing) {
      let isMovable = false;

      for (let c = 0; c < 4; c++) {
        const values = [];

        for (let r = 3; r >= 0; r--) {
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

        const updatedColumn = values.filter((value) => value !== 0);

        while (updatedColumn.length < 4) {
          updatedColumn.push(0);
        }

        for (let r = 0; r < 4; r++) {
          if (this.state[r][c] !== updatedColumn[3 - r]) {
            this.state[r][c] = updatedColumn[3 - r];
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
    this.status = Game.Status.playing;
    this.getRandomCells();
    this.getRandomCells();
  }

  restart() {
    this.status = Game.Status.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  getRandomCells() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [randomR, randomC] =
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
