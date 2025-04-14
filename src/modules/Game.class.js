'use strict';

class Game {
  static STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };
  static NUM_COLUMNS = 4;
  static NUM_ROWS = 4;
  static PROBABILITY = 0.1;

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.status = Game.STATUS.idle;
    this.initialState = initialState;
    this.state = this.initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.status === 'playing') {
      const previousState = this.cloneState(this.state);

      this.state.map((row) => {
        this.move('Left', row);
      });

      this.checkState(previousState, this.state);
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const previousState = this.cloneState(this.state);

      this.state.map((row) => {
        this.move('Right', row);
      });

      this.checkState(previousState, this.state);
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const previousState = this.cloneState(this.state);

      this.move('Up');

      this.checkState(previousState, this.state);
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const previousState = this.cloneState(this.state);

      this.move('Down');

      this.checkState(previousState, this.state);
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    if (this.isLoseCase()) {
      this.status = Game.STATUS.lose;
    }

    if (this.isWinCase()) {
      this.status = Game.STATUS.win;
    }

    return this.status;
  }

  start() {
    if (this.getStatus() === 'idle') {
      this.status = Game.STATUS.playing;
      this.setRandomNumber();
      this.setRandomNumber();
    }
  }

  restart() {
    this.status = 'idle';
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  // Add your own methods here

  move(direction, item) {
    const shiftMethod = `shift${direction}`;
    const mergeMethod = `mergeCells${direction}`;

    this[shiftMethod](item);
    this[mergeMethod](item);
    this[shiftMethod](item);
  }

  checkState(prev, current) {
    const hasStateChanged = !this.areStatesEqual(prev, current);

    if (hasStateChanged) {
      this.setRandomNumber();
    }
  }

  isWinCase() {
    const winValue = 2048;

    return this.state.some((row) => row.includes(winValue));
  }

  isLoseCase() {
    return this.getEmptyCells().length === 0 && this.noMovePossible();
  }

  noMovePossible() {
    for (let i = 0; i < Game.NUM_ROWS; i++) {
      for (let j = 0; j < Game.NUM_COLUMNS; j++) {
        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          return false;
        }

        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < Game.NUM_ROWS; i++) {
      for (let j = 0; j < Game.NUM_COLUMNS; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  shiftDown() {
    for (let col = 0; col < Game.NUM_COLUMNS; col++) {
      const tempColumn = [];

      for (let row = 0; row < Game.NUM_ROWS; row++) {
        if (this.state[row][col] !== 0) {
          tempColumn.push(this.state[row][col]);
        }
      }

      while (tempColumn.length < Game.NUM_ROWS) {
        tempColumn.unshift(0);
      }

      for (let row = 0; row < Game.NUM_ROWS; row++) {
        this.state[row][col] = tempColumn[row];
      }
    }

    return this.state;
  }

  mergeCellsDown() {
    for (let col = 0; col < Game.NUM_COLUMNS; col++) {
      const tempColumn = [];

      for (let row = 0; row < Game.NUM_ROWS; row++) {
        tempColumn.push(this.state[row][col]);
      }

      this.mergeCellsRight(tempColumn);

      for (let row = 0; row < Game.NUM_ROWS; row++) {
        this.state[row][col] = tempColumn[row];
      }
    }
  }

  shiftUp() {
    for (let col = 0; col < Game.NUM_COLUMNS; col++) {
      const tempColumn = [];

      for (let row = 0; row < Game.NUM_ROWS; row++) {
        if (this.state[row][col] !== 0) {
          tempColumn.push(this.state[row][col]);
        }
      }

      while (tempColumn.length < Game.NUM_ROWS) {
        tempColumn.push(0);
      }

      for (let row = 0; row < Game.NUM_ROWS; row++) {
        this.state[row][col] = tempColumn[row];
      }
    }

    return this.state;
  }

  mergeCellsUp() {
    for (let col = 0; col < Game.NUM_COLUMNS; col++) {
      const tempColumn = [];

      for (let row = 0; row < Game.NUM_ROWS; row++) {
        tempColumn.push(this.state[row][col]);
      }

      this.mergeCellsLeft(tempColumn);

      for (let row = 0; row < Game.NUM_ROWS; row++) {
        this.state[row][col] = tempColumn[row];
      }
    }
  }

  setRandomNumber(count = 1) {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    for (let k = 0; k < count; k++) {
      if (emptyCells.length > 0) {
        const randomEmptyCell = Math.floor(Math.random() * emptyCells.length);

        const randNum = Math.random() < Game.PROBABILITY ? 4 : 2;
        const [i, j] = emptyCells[randomEmptyCell];

        this.state[i][j] = randNum;
      }
    }
  }

  shiftLeft(row) {
    for (let i = 1; i < row.length; i++) {
      if (row[i] !== 0) {
        let j = i;

        while (j > 0 && row[j - 1] === 0) {
          row[j - 1] = row[j];
          row[j] = 0;
          j--;
        }
      }
    }
  }

  mergeCellsLeft(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] = row[i] * 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return row;
  }

  shiftRight(row) {
    for (let i = row.length - 2; i >= 0; i--) {
      if (row[i] !== 0) {
        let j = i;

        while (j < row.length - 1 && row[j + 1] === 0) {
          row[j + 1] = row[j];
          row[j] = 0;
          j++;
        }
      }
    }
  }

  mergeCellsRight(row) {
    for (let i = row.length - 1; i >= 0; i--) {
      if (row[i] === row[i - 1]) {
        row[i] = row[i] * 2;
        row[i - 1] = 0;
        this.score += row[i];
      }
    }

    return row;
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  areStatesEqual(state1, state2) {
    for (let i = 0; i < state1.length; i++) {
      for (let j = 0; j < state1[i].length; j++) {
        if (state1[i][j] !== state2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
