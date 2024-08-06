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

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }
  slide(row) {
    let updRow = this.filterZero(row);

    for (let i = 0; i < updRow.length - 1; i++) {
      if (updRow[i] === updRow[i + 1]) {
        updRow[i] *= 2;
        updRow[i + 1] = 0;
        this.score += updRow[i];
      }
    }
    updRow = this.filterZero(updRow);

    while (updRow.length < 4) {
      updRow.push(0);
    }

    return updRow;
  }
  moveLeft() {
    if (this.status === Game.Status.playing) {
      let isMovable = false;

      const updatedCells = this.state.map((row) => this.slide(row));

      this.state = updatedCells;

      isMovable = true;

      if (isMovable) {
        this.getRandomCells();
        this.checkGameStatus();
      }
    }
  }

  moveRight() {
    if (this.status === Game.Status.playing) {
      let isMovable = false;
      const reversedSlide = (row) => this.slide(row.reverse()).reverse();

      const updatedCells = this.state.map((row) => reversedSlide);

      this.state = updatedCells;

      isMovable = true;

      if (isMovable) {
        this.getRandomCells();
        this.checkGameStatus();
      }
    }
  }

  transposeArray(array) {
    return array[0].map((col, i) => array.map((row) => row[i]));
  }
  moveUp() {
    if (this.status === Game.Status.playing) {
      let isMovable = false;
      const slide = (row) => this.slide(row);

      const updatedCells = this.transposeArray(this.state).map((row) => slide);

      this.state = this.transposeArray(updatedCells);

      isMovable = true;

      if (isMovable) {
        this.getRandomCells();
        this.checkGameStatus();
      }
    }
  }
  moveDown() {
    if (this.status === Game.Status.playing) {
      let isMovable = false;
      const reversedSlide = (row) => this.slide(row.reverse()).reverse();

      const updatedCells = this.transposeArray(this.state).map(
        (row) => reversedSlide,
      );

      this.state = this.transposeArray(updatedCells);

      isMovable = true;

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
