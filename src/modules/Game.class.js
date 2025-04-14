'use strict';
/* eslint-disable */

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  START_TILES_AMOUNT = 2;
  SCORE_START_VALUE = 0;
  score = this.SCORE_START_VALUE;
  statusValues = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };
  status = this.statusValues.idle;

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = Game.copyState(initialState);
    this.initialState = Game.copyState(initialState);
  }

  static copyState(state) {
    return state.map((row) => row.slice());
  }

  move(key) {
    switch (key) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      default:
    }
  }

  moveLeft() {
    if (this.status !== this.statusValues.playing) {
      return;
    }

    const lastStateVersion = Game.copyState(this.state);

    Game.moveNumbersToLeft(this.state);
    Game.combineTilesLeft(this.state, this);
    Game.moveNumbersToLeft(this.state);

    if (!Game.checkStatesAreTheSame(lastStateVersion, this.state)) {
      Game.addRandomTile(this.state);
      Game.checkGameStatus(this);
    }
  }

  moveRight() {
    if (this.status !== this.statusValues.playing) {
      return;
    }

    const lastStateVersion = Game.copyState(this.state);

    Game.moveNumbersToRight(this.state);
    Game.combineTilesRight(this.state, this);
    Game.moveNumbersToRight(this.state);

    if (!Game.checkStatesAreTheSame(lastStateVersion, this.state)) {
      Game.addRandomTile(this.state);
      Game.checkGameStatus(this);
    }
  }

  moveUp() {
    if (this.status !== this.statusValues.playing) {
      return;
    }

    const lastStateVersion = Game.copyState(this.state);

    Game.moveNumbersUp(this.state);
    Game.combineTilesUp(this.state, this);
    Game.moveNumbersUp(this.state);

    if (!Game.checkStatesAreTheSame(lastStateVersion, this.state)) {
      Game.addRandomTile(this.state);
      Game.checkGameStatus(this);
    }
  }

  moveDown() {
    if (this.status !== this.statusValues.playing) {
      return;
    }

    const lastStateVersion = Game.copyState(this.state);

    Game.moveNumbersDown(this.state);
    Game.combineTilesDown(this.state, this);
    Game.moveNumbersDown(this.state);

    if (!Game.checkStatesAreTheSame(lastStateVersion, this.state)) {
      Game.addRandomTile(this.state);
      Game.checkGameStatus(this);
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return Game.copyState(this.state);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = this.statusValues.playing;

    for (let i = 0; i < this.START_TILES_AMOUNT; i++) {
      Game.addRandomTile(this.state);
    }
  }

  restart() {
    this.score = this.SCORE_START_VALUE;
    this.status = this.statusValues.idle;
    this.state = Game.copyState(this.initialState);
  }

  reset() {
    this.state = Game.copyState(this.initialState);
    this.status = this.statusValues.idle;
    this.score = this.SCORE_START_VALUE;
  }

  static clearState(gameInstance) {
    gameInstance.state = Game.copyState(gameInstance.initialState);
  }
  static addRandomTile(state) {
    const emptyCells = [];

    state.forEach((r, i) => {
      r.forEach((cell, n) => {
        if (cell !== 0) {
          return;
        }

        emptyCells.push({ row: i, coll: n });
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { row, coll } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    state[row][coll] = Math.random() < 0.9 ? 2 : 4;
  }
  static moveNumbersToLeft(state) {
    state.forEach((row) => {
      for (let k = 0; k < row.length; k++) {
        for (let i = 0; i < row.length; i++) {
          if (row[i] === 0 && i < row.length - 1) {
            row[i] = row[i + 1];
            row[i + 1] = 0;
          }
        }
      }
    });
  }
  static combineTilesLeft(state, gameInstance) {
    state.forEach((row) => {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
          row[i] *= 2;
          gameInstance.score += row[i];
          row[i + 1] = 0;
        }
      }
    });
  }
  static moveNumbersToRight(state) {
    state.forEach((row) => {
      for (let i = row.length - 1; i > 0; i--) {
        for (let k = row.length - 1; k > 0; k--) {
          if (row[k] === 0) {
            row[k] = row[k - 1];
            row[k - 1] = 0;
          }
        }
      }
    });
  }
  static combineTilesRight(state, gameInstance) {
    state.forEach((row) => {
      for (let i = row.length - 1; i > 0; i--) {
        if (row[i] === row[i - 1] && row[i]) {
          row[i] *= 2;
          gameInstance.score += row[i];
          row[i - 1] = 0;
        }
      }
    });
  }
  static moveNumbersUp(state) {
    for (let n = 0; n < state.length; n++) {
      for (let i = 0; i < state.length; i++) {
        for (let k = 0; k < state.length; k++) {
          if (state[k][i] === 0 && k !== 3) {
            state[k][i] = state[k + 1][i];
            state[k + 1][i] = 0;
          }
        }
      }
    }
  }
  static combineTilesUp(state, gameInstance) {
    for (let i = 0; i < state.length; i++) {
      for (let k = 0; k < state.length - 1; k++) {
        if (state[k][i] === state[k + 1][i] && state[k][i] !== 0) {
          state[k][i] *= 2;
          gameInstance.score += state[k][i];
          state[k + 1][i] = 0;
        }
      }
    }
  }
  static moveNumbersDown(state) {
    for (let n = 0; n < state.length; n++) {
      for (let k = state.length - 1; k > 0; k--) {
        for (let i = 0; i < state.length; i++) {
          if (state[k][i] === 0) {
            state[k][i] = state[k - 1][i];
            state[k - 1][i] = 0;
          }
        }
      }
    }
  }
  static combineTilesDown(state, gameInstance) {
    for (let k = state.length - 1; k > 0; k--) {
      for (let i = 0; i < state.length; i++) {
        if (state[k][i] && state[k][i] === state[k - 1][i]) {
          state[k][i] *= 2;
          gameInstance.score += state[k][i];
          state[k - 1][i] = 0;
        }
      }
    }
  }
  static checkStatesAreTheSame(state1, state2) {
    for (let r = 0; r < state1.length; r++) {
      for (let c = 0; c < state1[r].length; c++) {
        if (state1[r][c] !== state2[r][c]) {
          return false;
        }
      }
    }

    return true;
  }
  static checkGameStatus(gameInstance) {
    const state = gameInstance.state;
    const values = gameInstance.statusValues;
    let hasEmptyCell = false;
    let hasMove = false;

    for (let r = 0; r < state.length; r++) {
      for (let c = 0; c < state[r].length; c++) {
        if (state[r][c] === 2048) {
          gameInstance.status = values.win;

          return;
        }

        if (state[r][c] === 0) {
          hasEmptyCell = true;
        }

        if (
          (c < state[r].length - 1 && state[r][c] === state[r][c + 1]) ||
          (r < state.length - 1 && state[r][c] === state[r + 1][c])
        ) {
          hasMove = true;
        }
      }
    }

    if (gameInstance.status !== values.win) {
      gameInstance.status =
        hasEmptyCell || hasMove ? values.playing : values.lose;
    }
  }
}

module.exports = Game;
