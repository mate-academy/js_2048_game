'use strict';

class Game {
  static GAME_STATUS = {
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
    this.status = Game.GAME_STATUS.idle;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
  }

  moveLeft() {
    const newState = [];

    for (const row of this.state) {
      let filteredRow = row.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      const newRow = [
        ...filteredRow,
        ...Array(row.length - filteredRow.length).fill(0),
      ];

      newState.push(newRow);
    }

    this.setState(newState);
  }
  moveRight() {
    const newState = [];

    for (const row of this.state) {
      let filteredRow = row.filter((num) => num !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          filteredRow[i - 1] = 0;
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      const newRow = [
        ...Array(row.length - filteredRow.length).fill(0),
        ...filteredRow,
      ];

      newState.push(newRow);
    }

    this.setState(newState);
  }
  moveUp() {
    const newState = [];
    const transposedState = this.#transposeState(this.state);

    for (const row of transposedState) {
      let filteredRow = row.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      const newRow = [
        ...filteredRow,
        ...Array(row.length - filteredRow.length).fill(0),
      ];

      newState.push(newRow);
    }

    this.setState(this.#transposeState(newState));
  }
  moveDown() {
    const newState = [];
    const transposedState = this.#transposeState(this.state);

    for (const row of transposedState) {
      let filteredRow = row.filter((num) => num !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          filteredRow[i - 1] = 0;
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      const newRow = [
        ...Array(row.length - filteredRow.length).fill(0),
        ...filteredRow,
      ];

      newState.push(newRow);
    }

    this.setState(this.#transposeState(newState));
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

  setState(newState) {
    this.state = newState.map((row) => [...row]);
  }

  #transposeState(matrix) {
    return matrix[0].map((_, colIndex) => {
      return matrix.map((row) => row[colIndex]);
    });
  }

  start() {
    this.status = Game.GAME_STATUS.playing;
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }
}

module.exports = Game;
