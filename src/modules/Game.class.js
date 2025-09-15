/* eslint-disable no-param-reassign */
'use strict';
class Game {
  static gameStatus = {
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
    this.initialState = initialState;
    this.score = 0;
    this.status = Game.gameStatus.idle;
    this.playingField = initialState.map((row) => [...row]);
  }

  checkState(originState) {
    for (let i = 0; i < this.playingField.length; i++) {
      for (let j = 0; j < this.playingField.length; j++) {
        if (originState[i][j] !== this.playingField[i][j]) {

          return true;
        }
      }
    }

    return false;
  }

  isStateChanged(originState) {
    if (this.checkState(originState) === true) {
      this.fillRandomTile();
      this.checkLose();
      this.checkWin();
    }
  }

  slideAndCombine(cells) {
    cells = cells.filter((x) => x !== 0);

    for (let j = 0; j < cells.length - 1; j++) {
      if (cells[j] === cells[j + 1]) {
        cells[j] *= 2;
        cells[j + 1] = 0;
        j++;
      }
    }

    cells = cells.filter((x) => x !== 0);

    while (cells.length < this.playingField.length) {
      cells.push(0);
    }

    return cells;
  }

  moveLeft() {
    const originState = this.playingField.map((row) => [...row]);

    for (let i = 0; i < this.playingField.length; i++) {
      const cells = [...this.playingField[i]];

      this.playingField[i] = this.slideAndCombine(cells);
    }
    this.isStateChanged(originState);
  }

  moveRight() {
    const originState = this.playingField.map((row) => [...row]);

    for (let i = 0; i < this.playingField.length; i++) {
      const cells = [...this.playingField[i]].reverse();

      this.playingField[i] = this.slideAndCombine(cells).reverse();
    }

    this.isStateChanged(originState);
  }

  moveUp() {
    const originState = this.playingField.map((row) => [...row]);

    for (let col = 0; col < this.playingField.length; col++) {
      let column = this.playingField.map((row) => row[col]);

      column = this.slideAndCombine(column);

      for (let row = 0; row < this.playingField.length; row++) {
        this.playingField[row][col] = column[row];
      }
    }

    this.isStateChanged(originState);
  }

  moveDown() {
    const originState = this.playingField.map((row) => [...row]);

    for (let col = 0; col < this.playingField.length; col++) {
      let column = this.playingField.map((row) => row[col]).reverse();

      column = this.slideAndCombine(column).reverse();

      for (let row = 0; row < this.playingField.length; row++) {
        this.playingField[row][col] = column[row];
      }
    }

    this.isStateChanged(originState);
  }

  getScore() {
    this.score = this.playingField.reduce(
      (sum, row) => sum + row.reduce((rSum, cell) => rSum + cell, 0),
      0,
    );

    return this.score;
  }

  getState() {
    return this.playingField;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.gameStatus.playing;

    for (let i = 0; i < 2; i++) {
      this.fillRandomTile();
    }
  }

  restart() {
    this.playingField = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.gameStatus.idle;
  }

  fillRandomTile() {
    const emptyFields = [];

    for (let row = 0; row < this.playingField.length; row++) {
      for (let column = 0; column < this.playingField.length; column++) {
        if (this.playingField[row][column] === 0) {
          emptyFields.push([row, column]);
        }
      }
    }

    if (emptyFields.length > 0) {
      const [emptyRow, emptyColumn] =
        emptyFields[Math.floor(Math.random() * emptyFields.length)];

      this.playingField[emptyRow][emptyColumn] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkLose() {
    for (let row = 0; row < this.playingField.length; row++) {
      for (let col = 0; col < this.playingField.length; col++) {
        if (this.playingField[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < this.playingField.length; row++) {
      for (let col = 0; col < this.playingField.length - 1; col++) {
        if (this.playingField[row][col] === this.playingField[row][col + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < this.playingField.length; col++) {
      for (let row = 0; row < this.playingField.length - 1; row++) {
        if (this.playingField[row][col] === this.playingField[row + 1][col]) {
          return false;
        }
      }
    }

    this.status = Game.gameStatus.lose;

    return true;
  }

  checkWin() {
    for (let row = 0; row < this.playingField.length; row++) {
      for (let col = 0; col < this.playingField.length; col++) {
        if (this.playingField[row][col] === 2048) {
          this.status = Game.gameStatus.win;

          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
