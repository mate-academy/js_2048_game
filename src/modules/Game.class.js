'use strict';

class Game {
  static SIDE_LENGTH = 4;
  static WIN_NUMBER = 2048;
  static DEFAULT_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState) {
    this.initial = initialState || Game.DEFAULT_STATE.map((row) => [...row]);
    this.state = JSON.parse(JSON.stringify(this.initial));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const stateBeforeMove = this.state.map((row) => [...row]);

    for (let i = 0; i < Game.SIDE_LENGTH; i++) {
      const row = [0, 0, 0, 0];
      let count = 0;

      const currentRow = this.state[i].filter((num) => num > 0);

      for (let j = 0; j < currentRow.length; j++) {
        if (currentRow[j] === currentRow[j + 1]) {
          row[count] = currentRow[j] * 2;
          this.score += currentRow[j] * 2;
          j++;
          count++;
        } else {
          row[count] = currentRow[j];
          count++;
        }
      }

      this.state[i] = row;
    }

    if (JSON.stringify(stateBeforeMove) === JSON.stringify(this.state)) {
      return;
    }

    this.addRandomNumber();
    this.checkAndSetWinStatus();
  }

  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const stateBeforeMove = this.state.map((row) => [...row]);

    for (let i = 0; i < Game.SIDE_LENGTH; i++) {
      const row = [0, 0, 0, 0];
      let count = row.length - 1;

      const currentRow = this.state[i].filter((num) => num > 0);

      for (let j = currentRow.length - 1; j >= 0; j--) {
        if (currentRow[j] === currentRow[j - 1]) {
          row[count] = currentRow[j] * 2;
          this.score += currentRow[j] * 2;
          j--;
          count--;
        } else {
          row[count] = currentRow[j];
          count--;
        }
      }

      this.state[i] = row;
    }

    if (JSON.stringify(stateBeforeMove) === JSON.stringify(this.state)) {
      return;
    }

    this.addRandomNumber();
    this.checkAndSetWinStatus();
  }

  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const stateBeforeMove = this.state.map((row) => [...row]);

    for (let i = 0; i < Game.SIDE_LENGTH; i++) {
      const column = [0, 0, 0, 0];
      let count = 0;
      const currentColumn = [];

      for (let j = 0; j < Game.SIDE_LENGTH; j++) {
        if (this.state[j][i] === 0) {
          continue;
        }
        currentColumn.push(this.state[j][i]);
      }

      for (let j = 0; j < currentColumn.length; j++) {
        if (currentColumn[j] === currentColumn[j + 1]) {
          column[count] = currentColumn[j] * 2;
          this.score += currentColumn[j] * 2;
          j++;
          count++;
        } else {
          column[count] = currentColumn[j];
          count++;
        }
      }

      for (let j = 0; j < Game.SIDE_LENGTH; j++) {
        this.state[j][i] = column[j];
      }
    }

    if (JSON.stringify(stateBeforeMove) === JSON.stringify(this.state)) {
      return;
    }

    this.addRandomNumber();
    this.checkAndSetWinStatus();
  }

  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const stateBeforeMove = this.state.map((row) => [...row]);

    for (let i = 0; i < Game.SIDE_LENGTH; i++) {
      const column = [0, 0, 0, 0];
      let count = Game.SIDE_LENGTH - 1;
      const currentColumn = [];

      for (let j = 0; j < Game.SIDE_LENGTH; j++) {
        if (this.state[j][i] === 0) {
          continue;
        }
        currentColumn.push(this.state[j][i]);
      }

      for (let j = currentColumn.length - 1; j >= 0; j--) {
        if (currentColumn[j] === currentColumn[j - 1]) {
          column[count] = currentColumn[j] * 2;
          this.score += currentColumn[j] * 2;
          j--;
          count--;
        } else {
          column[count] = currentColumn[j];
          count--;
        }
      }

      for (let j = Game.SIDE_LENGTH - 1; j >= 0; j--) {
        this.state[j][i] = column[j];
      }
    }

    if (JSON.stringify(stateBeforeMove) === JSON.stringify(this.state)) {
      return;
    }

    this.addRandomNumber();
    this.checkAndSetWinStatus();
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
    this.addRandomNumber();
    this.addRandomNumber();
    this.status = 'playing';

    return this;
  }

  restart() {
    this.state = JSON.parse(JSON.stringify(this.initial));
    this.score = 0;
    this.status = 'idle';

    return this;
  }

  getEmptyPositions() {
    const emptyPositions = [];

    for (let i = 0; i < Game.SIDE_LENGTH; i++) {
      for (let j = 0; j < Game.SIDE_LENGTH; j++) {
        if (this.state[i][j] === 0) {
          emptyPositions.push([i, j]);
        }
      }
    }

    return emptyPositions;
  }

  addRandomNumber() {
    const emptyPositions = this.getEmptyPositions();
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const randomPosition = emptyPositions[randomIndex];
    const randomNumber = Math.floor(Math.random() * 10) === 0 ? 4 : 2;

    this.state[randomPosition[0]][randomPosition[1]] = randomNumber;

    return this;
  }

  checkAndSetWinStatus() {
    if (this.state.some((row) => row.includes(Game.WIN_NUMBER))) {
      this.status = 'win';
    }
  }

  checkAndSetLoseStatus() {
    if (this.getEmptyPositions().length > 0) {
      return;
    }

    const defaultGame = new Game();

    defaultGame.state = this.state.map((row) => [...row]);
    defaultGame.status = 'playing';
    defaultGame.moveDown();

    if (JSON.stringify(defaultGame.state) !== JSON.stringify(this.state)) {
      return;
    }

    defaultGame.moveUp();

    if (JSON.stringify(defaultGame.state) !== JSON.stringify(this.state)) {
      return;
    }

    defaultGame.moveLeft();

    if (JSON.stringify(defaultGame.state) !== JSON.stringify(this.state)) {
      return;
    }

    defaultGame.moveRight();

    if (JSON.stringify(defaultGame.state) !== JSON.stringify(this.state)) {
      return;
    }

    this.status = 'lose';
  }
}

module.exports = Game;
