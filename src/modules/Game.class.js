'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
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
    this.status = Game.STATUS.IDLE;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
  }

  start() {
    this.status = Game.STATUS.PLAYING;
    this.getRandomCell();
    this.getRandomCell();
  }

  getRandomCell() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [randomI, randomJ] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomI][randomJ] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameStatus() {
    let canMove = false;
    let hasEmptyCell = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          this.status = Game.STATUS.WIN;

          return;
        }

        if (this.state[i][j] === 0) {
          hasEmptyCell = true;
        }

        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          canMove = true;
        }

        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          canMove = true;
        }
      }
    }

    if (!hasEmptyCell && !canMove) {
      this.status = Game.STATUS.LOSE;
    }
  }

  moveLeft() {
    if (this.status === Game.STATUS.PLAYING) {
      let canMove = false;

      for (let i = 0; i < 4; i++) {
        const values = [];

        for (let j = 0; j < 4; j++) {
          if (this.state[i][j] !== 0) {
            values.push(this.state[i][j]);
          }
        }

        while (values.length < 4) {
          values.push(0);
        }

        for (let t = 0; t < values.length - 1; t++) {
          if (values[t] === values[t + 1] && values[t] !== 0) {
            values[t] *= 2;
            values[t + 1] = 0;
            this.score += values[t];
            canMove = true;
          }
        }

        const mergedValues = values.filter((value) => value !== 0);

        while (mergedValues.length < 4) {
          mergedValues.push(0);
        }

        for (let j = 0; j < 4; j++) {
          if (this.state[i][j] !== mergedValues[j]) {
            this.state[i][j] = mergedValues[j];
            canMove = true;
          }
        }
      }

      if (canMove) {
        this.getRandomCell();
        this.checkGameStatus();
      }
    }
  }

  moveRight() {
    if (this.status === Game.STATUS.PLAYING) {
      let canMove = false;

      for (let i = 0; i < 4; i++) {
        const values = [];

        for (let j = 3; j >= 0; j--) {
          if (this.state[i][j] !== 0) {
            values.push(this.state[i][j]);
          }
        }

        for (let t = 0; t < values.length; t++) {
          if (values[t] === values[t + 1]) {
            values[t] *= 2;
            values[t + 1] = 0;
            this.score += values[t];
            canMove = true;
          }
        }

        const updateRow = values.filter((value) => value !== 0);

        while (updateRow.length < 4) {
          updateRow.push(0);
        }

        for (let j = 0; j < 4; j++) {
          if (this.state[i][j] !== updateRow[3 - j]) {
            this.state[i][j] = updateRow[3 - j];
            canMove = true;
          }
        }
      }

      if (canMove) {
        this.getRandomCell();
        this.checkGameStatus();
      }
    }
  }

  moveUp() {
    if (this.status === Game.STATUS.PLAYING) {
      let canMove = false;

      for (let j = 0; j < 4; j++) {
        const values = [];

        for (let i = 0; i < 4; i++) {
          if (this.state[i][j] !== 0) {
            values.push(this.state[i][j]);
          }
        }

        for (let t = 0; t < values.length; t++) {
          if (values[t] === values[t + 1]) {
            values[t] *= 2;
            values[t + 1] = 0;
            this.score += values[t];
            canMove = true;
          }
        }

        const updateColumn = values.filter((value) => value !== 0);

        while (updateColumn.length < 4) {
          updateColumn.push(0);
        }

        for (let i = 0; i < 4; i++) {
          if (this.state[i][j] !== updateColumn[i]) {
            this.state[i][j] = updateColumn[i];
            canMove = true;
          }
        }
      }

      if (canMove) {
        this.getRandomCell();
        this.checkGameStatus();
      }
    }
  }

  moveDown() {
    if (this.status === Game.STATUS.PLAYING) {
      let canMove = false;

      for (let j = 0; j < 4; j++) {
        const values = [];

        for (let i = 3; i >= 0; i--) {
          if (this.state[i][j] !== 0) {
            values.push(this.state[i][j]);
          }
        }

        for (let t = 0; t < values.length; t++) {
          if (values[t] === values[t + 1]) {
            values[t] *= 2;
            values[t + 1] = 0;
            this.score += values[t];
            canMove = true;
          }
        }

        const updateColumn = values.filter((value) => value !== 0);

        while (updateColumn.length < 4) {
          updateColumn.push(0);
        }

        for (let i = 0; i < 4; i++) {
          if (this.state[i][j] !== updateColumn[3 - i]) {
            this.state[i][j] = updateColumn[3 - i];
            canMove = true;
          }
        }
      }

      if (canMove) {
        this.getRandomCell();
        this.checkGameStatus();
      }
    }
  }

  restart() {
    this.status = Game.STATUS.IDLE;
    this.state = this.initialState.map((row) => [...row]);
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
}

module.exports = Game;
