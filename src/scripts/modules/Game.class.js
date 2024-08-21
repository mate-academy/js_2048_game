'use strict';

const { getRandomIndex, createFreeNumber } = require('./helpers.js');

class Game {
  constructor(initialState) {
    this.state = [];

    if (initialState) {
      this.state = initialState;
    } else {
      for (let i = 0; i < 4; i++) {
        this.state.push(new Array(4).fill(0));
      }
    }

    this.status = 'idle';
    this.score = 0;
    this.initialState = JSON.parse(JSON.stringify(this.state));
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

  static getFreeCells(state) {
    const freeCells = [];

    for (let i = 0; i < state.length; i++) {
      const row = state[i];

      if (row.some((el) => el === 0)) {
        for (let j = 0; j < row.length; j++) {
          if (row[j] === 0) {
            freeCells.push([i, j]);
          }
        }
      }
    }

    return freeCells;
  }

  static fillRandomCell(state) {
    const freeCells = Game.getFreeCells(state);
    const freeCellsLength = freeCells.length;

    if (freeCellsLength === 0) {
      return;
    }

    const [row, column] = freeCells[getRandomIndex(freeCellsLength)];

    state[row][column] = createFreeNumber(2, 4);
  }

  static moveFilledCellsRight(state) {
    state.forEach((row, ind) => {
      const filledCells = row.filter((x) => x !== 0);

      const emptyCells = Array(row.length - filledCells.length).fill(0);

      state[ind] = emptyCells.concat(filledCells);
    });
  }

  static moveFilledCellsLeft(state) {
    state.forEach((row, ind) => {
      const filledCells = row.filter((x) => x !== 0);

      const emptyCells = Array(row.length - filledCells.length).fill(0);

      state[ind] = filledCells.concat(emptyCells);
    });
  }

  static moveFilledCellsDown(state) {
    for (let i = 0; i < state.length; i++) {
      const stackFilled = [];
      const stackEmpty = [];

      for (let j = 0; j < state[i].length; j++) {
        if (state[j][i] === 0) {
          stackEmpty.push(state[j][i]);
        } else {
          stackFilled.push(state[j][i]);
        }
      }

      const fullStack = stackEmpty.concat(stackFilled);

      if (stackEmpty.length) {
        for (let j = 0; j < state[i].length; j++) {
          state[j][i] = fullStack[j];
        }
      }
    }
  }

  static moveFilledCellsUp(state) {
    for (let i = 0; i < state.length; i++) {
      const stackFilled = [];
      const stackEmpty = [];

      for (let j = 0; j < state[i].length; j++) {
        if (state[j][i] === 0) {
          stackEmpty.push(state[j][i]);
        } else {
          stackFilled.push(state[j][i]);
        }
      }

      const fullStack = stackFilled.concat(stackEmpty);

      if (stackEmpty.length) {
        for (let j = 0; j < state[i].length; j++) {
          state[j][i] = fullStack[j];
        }
      }
    }
  }

  static canMove(state) {
    for (let i = 0; i < state.length; i++) {
      const row = state[i];

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          return true;
        }

        if (state[j][i] === state[j + 1][i]) {
          return true;
        }
      }
    }

    return false;
  }

  static isstateChanged(prevState, newstate) {
    let isChanged = false;

    prevState.forEach((row, rowInd) => {
      const equal = row.every(
        (val, valInd) => newstate[rowInd][valInd] === val,
      );

      if (!equal) {
        isChanged = true;
      }
    });

    return isChanged;
  }

  static checkStatus(game) {
    const state = game.state;

    state.forEach((row) => {
      if (row.some((el) => el === 2048)) {
        game.status = 'win';
      }
    });

    const freeCells = Game.getFreeCells(state);

    if (!Game.canMove(state) && freeCells.length === 0) {
      game.status = 'lose';
    }
  }

  static checkAfterMove(game, prevState, state) {
    if (Game.isstateChanged(prevState, state)) {
      Game.fillRandomCell(state);
    }

    Game.checkStatus(game);
  }

  start() {
    this.status = 'playing';

    for (let i = 0; i < 2; i++) {
      Game.fillRandomCell(this.state);
    }
  }

  restart() {
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
    this.score = 0;
  }

  moveRight() {
    const state = this.state;
    const prevState = JSON.parse(JSON.stringify(state));

    Game.moveFilledCellsRight(state);

    for (let i = 0; i < state.length; i++) {
      const row = state[i];

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1] && row[j] !== 0) {
          row[j] *= 2;
          row[j - 1] = 0;

          this.score += row[j];
        }
      }
    }

    Game.moveFilledCellsRight(state);
    Game.checkAfterMove(this, prevState, state);
  }

  moveLeft() {
    const state = this.state;
    const prevState = JSON.parse(JSON.stringify(state));

    Game.moveFilledCellsLeft(state);

    for (let i = 0; i < state.length; i++) {
      const row = state[i];

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1] && row[j] !== 0) {
          row[j] *= 2;
          row[j + 1] = 0;

          this.score += row[j];
        }
      }
    }

    Game.moveFilledCellsLeft(state);
    Game.checkAfterMove(this, prevState, state);
  }

  moveDown() {
    const state = this.state;
    const prevState = JSON.parse(JSON.stringify(state));

    Game.moveFilledCellsDown(state);

    for (let i = 0; i < state.length; i++) {
      for (let j = state[i].length - 1; j > 0; j--) {
        if (state[j][i] === state[j - 1][i] && state[j][i] !== 0) {
          state[j][i] *= 2;
          state[j - 1][i] = 0;

          this.score += state[j][i];
        }
      }
    }

    Game.moveFilledCellsDown(state);
    Game.checkAfterMove(this, prevState, state);
  }

  moveUp() {
    const state = this.state;
    const prevState = JSON.parse(JSON.stringify(state));

    Game.moveFilledCellsUp(state);

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length - 1; j++) {
        if (state[j][i] === state[j + 1][i] && state[j][i] !== 0) {
          state[j][i] *= 2;
          state[j + 1][i] = 0;

          this.score += state[j][i];
        }
      }
    }

    Game.moveFilledCellsUp(state);
    Game.checkAfterMove(this, prevState, state);
  }
}

module.exports = Game;
