'use strict';

class Game {
  static STATUS = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // eslint-disable-next-line no-console
    this.status = Game.STATUS.IDLE;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
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
    this.status = Game.STATUS.PLAYING;
    this.state = this.initialState.map((row) => [...row]);
    this.addNewNumber();
    this.addNewNumber();
  }

  restart() {
    this.status = Game.STATUS.IDLE;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  addNewNumber() {
    const emptyPositions = this.getEmptyPosition();

    if (emptyPositions.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const [row, col] = emptyPositions[randomIndex];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  getEmptyPosition() {
    const emptyPositions = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyPositions.push([row, col]);
        }
      }
    }

    return emptyPositions;
  }

  moveLeft() {
    if (this.getStatus() === Game.STATUS.PLAYING) {
      const size = this.state.length;
      const state = this.getState();
      let moved = false;

      for (let row = 0; row < size; row++) {
        const newRow = [];
        const merged = Array(size).fill(false);

        for (let col = 0; col < size; col++) {
          if (state[row][col] !== 0) {
            newRow.push(state[row][col]);
          }
        }

        for (let i = 0; i < newRow.length - 1; i++) {
          if (newRow[i] === newRow[i + 1] && !merged[i] && !merged[i + 1]) {
            newRow[i] *= 2;
            this.score += newRow[i];
            newRow.splice(i + 1, 1);
            merged[i] = true;
          }
        }

        while (newRow.length < size) {
          newRow.push(0);
        }

        for (let col = 0; col < size; col++) {
          if (state[row][col] !== newRow[col]) {
            state[row][col] = newRow[col];
            moved = true;
          }
        }
      }

      this.handleMove(moved);
    }
  }

  moveRight() {
    if (this.getStatus() === Game.STATUS.PLAYING) {
      const size = this.state.length;
      const state = this.getState();
      let moved = false;

      for (let row = 0; row < size; row++) {
        const newRow = [];

        for (let col = 0; col < size; col++) {
          if (state[row][col] !== 0) {
            newRow.push(state[row][col]);
          }
        }

        const merged = Array(newRow.length).fill(false);

        for (let i = newRow.length - 1; i > 0; i--) {
          if (newRow[i] === newRow[i - 1] && !merged[i] && !merged[i - 1]) {
            newRow[i] *= 2;
            this.score += newRow[i];
            newRow.splice(i - 1, 1);
            merged.splice(i - 1, 1);
            merged[i - 1] = true;
          }
        }

        while (newRow.length < size) {
          newRow.unshift(0);
        }

        for (let col = 0; col < size; col++) {
          if (state[row][col] !== newRow[col]) {
            state[row][col] = newRow[col];
            moved = true;
          }
        }
      }

      this.handleMove(moved);
    }
  }

  moveUp() {
    if (this.getStatus() === Game.STATUS.PLAYING) {
      const size = this.state.length;
      const state = this.getState();
      let moved = false;

      for (let col = 0; col < size; col++) {
        const newColumn = [];

        for (let row = 0; row <= size - 1; row++) {
          if (state[row][col] !== 0) {
            newColumn.push(state[row][col]);
          }
        }

        for (let i = 0; i < newColumn.length; i++) {
          if (newColumn[i] === newColumn[i + 1]) {
            newColumn[i] *= 2;
            this.score += newColumn[i];
            newColumn.splice(i + 1, 1);
          }
        }

        while (newColumn.length < size) {
          newColumn.push(0);
        }

        for (let row = 0; row < size; row++) {
          if (state[row][col] !== newColumn[row]) {
            state[row][col] = newColumn[row];
            moved = true;
          }
        }
      }

      this.handleMove(moved);
    }
  }

  moveDown() {
    if (this.getStatus() === Game.STATUS.PLAYING) {
      const size = this.state.length;
      const state = this.getState();
      let moved = false;

      for (let col = 0; col < size; col++) {
        const newColumn = [];

        for (let row = 0; row <= size - 1; row++) {
          if (state[row][col] !== 0) {
            newColumn.push(state[row][col]);
          }
        }

        const merged = Array(newColumn.length).fill(false);

        for (let i = newColumn.length - 1; i > 0; i--) {
          if (
            newColumn[i] === newColumn[i - 1] &&
            !merged[i] &&
            !merged[i - 1]
          ) {
            newColumn[i] *= 2;
            this.score += newColumn[i];
            newColumn.splice(i - 1, 1);
            merged.splice(i - 1, 1);
            merged[i - 1] = true;
          }
        }

        while (newColumn.length < size) {
          newColumn.unshift(0);
        }

        for (let row = 0; row < size; row++) {
          if (state[row][col] !== newColumn[row]) {
            state[row][col] = newColumn[row];
            moved = true;
          }
        }
      }

      this.handleMove(moved);
    }
  }

  handleMove(moved) {
    if (moved) {
      this.addNewNumber();

      if (this.checkWin()) {
        this.status = Game.STATUS.WIN;
      }

      if (this.checkLose()) {
        this.status = Game.STATUS.LOSE;
      }
    }
  }

  checkWin() {
    return this.state.some((row) => row.includes(2048));
  }

  checkLose() {
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          return false;
        }

        if (row > 0 && this.state[row][col] === this.state[row - 1][col]) {
          return false;
        }

        if (
          row < this.state.length - 1 &&
          this.state[row][col] === this.state[row + 1][col]
        ) {
          return false;
        }

        if (col > 0 && this.state[row][col] === this.state[row][col - 1]) {
          return false;
        }

        if (
          col < this.state[row].lenth - 1 &&
          this.state[row][col] === this.state[row][col + 1]
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
