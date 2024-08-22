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
    this.status = Game.gameStatus.idle;
    this.score = 0;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let hasMoved = false;

    for (let i = 0; i < this.state.length; i++) {
      let filteredRow = this.state[i].filter((value) => value !== 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] *= 2;
          filteredRow[j + 1] = 0;
          this.score += filteredRow[j];
          hasMoved = true;
        }
      }

      filteredRow = filteredRow.filter((value) => value !== 0);

      while (filteredRow.length < this.state[i].length) {
        filteredRow.push(0);
      }

      if (this.state[i].toString() !== filteredRow.toString()) {
        hasMoved = true;
        this.state[i] = filteredRow;
      }
    }

    if (hasMoved) {
      this.addCell();
      this.checkStatus();
    }
  }

  moveRight() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let hasMoved = false;

    for (let i = 0; i < this.state.length; i++) {
      let filteredRow = this.state[i].filter((value) => value !== 0);

      for (let j = filteredRow.length - 1; j > 0; j--) {
        if (filteredRow[j] === filteredRow[j - 1]) {
          filteredRow[j] *= 2;
          filteredRow[j - 1] = 0;
          this.score += filteredRow[j];
          hasMoved = true;
        }
      }

      filteredRow = filteredRow.filter((value) => value !== 0);

      while (filteredRow.length < this.state[i].length) {
        filteredRow.unshift(0);
      }

      if (this.state[i].toString() !== filteredRow.toString()) {
        hasMoved = true;
        this.state[i] = filteredRow;
      }
    }

    if (hasMoved) {
      this.addCell();
      this.checkStatus();
    }
  }

  moveUp() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let hasMoved = false;

    for (let col = 0; col < this.state.length; col++) {
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
          this.score += column[i];
          hasMoved = true;
        }
      }

      column = column.filter((value) => value !== 0);

      while (column.length < this.state.length) {
        column.push(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        if (this.state[row][col] !== column[row]) {
          this.state[row][col] = column[row];
          hasMoved = true;
        }
      }
    }

    if (hasMoved) {
      this.addCell();
      this.checkStatus();
    }
  }

  moveDown() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let hasMoved = false;

    for (let col = 0; col < this.state.length; col++) {
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
          this.score += column[i];
          hasMoved = true;
        }
      }

      column = column.filter((value) => value !== 0);

      while (column.length < this.state.length) {
        column.unshift(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        if (this.state[row][col] !== column[row]) {
          this.state[row][col] = column[row];
          hasMoved = true;
        }
      }
    }

    if (hasMoved) {
      this.addCell();
      this.checkStatus();
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
    this.status = Game.gameStatus.playing;
    this.state = this.initialState.map((row) => [...row]);
    this.addCell();
    this.addCell();
  }

  restart() {
    this.status = Game.gameStatus.idle;
    this.score = 0;
    this.resetState();
  }

  getRandomValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  checkStatus() {
    let movesAvailable = false;
    let canMerge = false;

    const size = this.state.length;

    for (let i = 0; i < size; i++) {
      if (this.state[i].includes(2048)) {
        this.status = Game.gameStatus.win;

        return;
      }
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (this.state[i][j] === 0) {
          movesAvailable = true;
        }

        if (j < size - 1 && this.state[i][j] === this.state[i][j + 1]) {
          canMerge = true;
        }

        if (i < size - 1 && this.state[i][j] === this.state[i + 1][j]) {
          canMerge = true;
        }

        if (movesAvailable || canMerge) {
          break;
        }
      }

      if (movesAvailable || canMerge) {
        break;
      }
    }

    if (!movesAvailable && !canMerge) {
      this.status = Game.gameStatus.lose;
    }
  }

  resetState() {
    this.state = [...this.initialState.map((row) => [...row])];
  }

  addCell() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ rowIndex: i, cellIndex: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = this.getRandomNumber(emptyCells.length);
    const { rowIndex, cellIndex } = emptyCells[randomIndex];
    const newState = this.state.map((row) => [...row]);

    newState[rowIndex][cellIndex] = this.getRandomValue();
    this.state = newState;
  }
}

module.exports = Game;
