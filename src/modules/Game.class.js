'use strict';

class Game {
  gameStatus = {
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
    this.boardState = this.initialState.map((row) => row.slice());
    this.currentStatus = this.gameStatus.idle;
    this.currentScore = 0;
  }

  moveUp() {
    if (this.currentStatus === this.gameStatus.playing) {
      let hasMoved = false;

      for (let column = 0; column < 4; column++) {
        const valuesOfColumn = [];

        for (let row = 0; row < 4; row++) {
          if (this.boardState[row][column] !== 0) {
            valuesOfColumn.push(this.boardState[row][column]);
          }
        }

        for (let i = 0; i < valuesOfColumn.length; i++) {
          if (valuesOfColumn[i] === valuesOfColumn[i + 1]) {
            valuesOfColumn[i] *= 2;
            valuesOfColumn[i + 1] = 0;
            this.currentScore += valuesOfColumn[i];
            hasMoved = true;
          }
        }

        const newColumn = valuesOfColumn.filter((value) => value !== 0);

        while (newColumn.length < 4) {
          newColumn.push(0);
        }

        for (let row = 0; row < 4; row++) {
          if (this.boardState[row][column] !== newColumn[row]) {
            this.boardState[row][column] = newColumn[row];
            hasMoved = true;
          }
        }
      }

      if (hasMoved) {
        this.addTile();
        this.checkStatus();
      }
    }
  }

  moveDown() {
    if (this.currentStatus === this.gameStatus.playing) {
      let hasMoved = false;

      for (let column = 0; column < 4; column++) {
        const valuesOfColumn = [];

        for (let row = 3; row >= 0; row--) {
          if (this.boardState[row][column] !== 0) {
            valuesOfColumn.push(this.boardState[row][column]);
          }
        }

        for (let i = 0; i < valuesOfColumn.length; i++) {
          if (valuesOfColumn[i] === valuesOfColumn[i + 1]) {
            valuesOfColumn[i] *= 2;
            valuesOfColumn[i + 1] = 0;
            this.currentScore += valuesOfColumn[i];
            hasMoved = true;
          }
        }

        const newColumn = valuesOfColumn.filter((value) => value !== 0);

        while (newColumn.length < 4) {
          newColumn.push(0);
        }

        for (let row = 0; row < 4; row++) {
          if (this.boardState[row][column] !== newColumn[3 - row]) {
            this.boardState[row][column] = newColumn[3 - row];
            hasMoved = true;
          }
        }
      }

      if (hasMoved) {
        this.addTile();
        this.checkStatus();
      }
    }
  }

  moveLeft() {
    if (this.currentStatus === this.gameStatus.playing) {
      let hasMoved = false;

      for (let row = 0; row < 4; row++) {
        const valuesOfRows = [];

        for (let column = 0; column < 4; column++) {
          if (this.boardState[row][column] !== 0) {
            valuesOfRows.push(this.boardState[row][column]);
          }
        }

        for (let i = 0; i < valuesOfRows.length; i++) {
          if (valuesOfRows[i] === valuesOfRows[i + 1]) {
            valuesOfRows[i] *= 2;
            valuesOfRows[i + 1] = 0;
            this.currentScore += valuesOfRows[i];
            hasMoved = true;
          }
        }

        const newRow = valuesOfRows.filter((value) => value !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }

        for (let column = 0; column < 4; column++) {
          if (this.boardState[row][column] !== newRow[column]) {
            this.boardState[row][column] = newRow[column];
            hasMoved = true;
          }
        }
      }

      if (hasMoved) {
        this.addTile();
        this.checkStatus();
      }
    }
  }

  moveRight() {
    if (this.currentStatus === this.gameStatus.playing) {
      let hasMoved = false;

      for (let row = 0; row < 4; row++) {
        const valuesOfRows = [];

        for (let column = 3; column >= 0; column--) {
          if (this.boardState[row][column] !== 0) {
            valuesOfRows.push(this.boardState[row][column]);
          }
        }

        for (let i = 0; i < valuesOfRows.length; i++) {
          if (valuesOfRows[i] === valuesOfRows[i + 1]) {
            valuesOfRows[i] *= 2;
            valuesOfRows[i + 1] = 0;
            this.currentScore += valuesOfRows[i];
            hasMoved = true;
          }
        }

        const newRow = valuesOfRows.filter((value) => value !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }

        for (let column = 0; column < 4; column++) {
          if (this.boardState[row][column] !== newRow[3 - column]) {
            this.boardState[row][column] = newRow[3 - column];
            hasMoved = true;
          }
        }
      }

      if (hasMoved) {
        this.addTile();
        this.checkStatus();
      }
    }
  }

  getScore() {
    return this.currentScore;
  }

  getState() {
    return this.boardState;
  }

  getStatus() {
    return this.currentStatus;
  }

  start() {
    this.currentStatus = this.gameStatus.playing;
    this.addTile();
    this.addTile();
  }

  restart() {
    this.currentStatus = this.gameStatus.idle;
    this.boardState = this.initialState.map((row) => row.slice());
    this.currentScore = 0;
  }

  addTile() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.boardState[row][column] === 0) {
          emptyTiles.push([row, column]);
        }
      }
    }

    if (emptyTiles.length > 0) {
      const [randomRow, randomColumn] =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.boardState[randomRow][randomColumn] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkStatus() {
    let hasMoves = false;
    let hasEmptyTiles = false;

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.boardState[row][column] === 2048) {
          this.currentStatus = this.gameStatus.win;

          return;
        }

        if (this.boardState[row][column] === 0) {
          hasEmptyTiles = true;
        }

        if (
          (row < 3 &&
            this.boardState[row][column] ===
              this.boardState[row + 1][column]) ||
          (column < 3 &&
            this.boardState[row][column] === this.boardState[row][column + 1])
        ) {
          hasMoves = true;
        }
      }
    }

    if (!hasEmptyTiles && !hasMoves) {
      this.currentStatus = this.gameStatus.lose;
    }
  }
}

module.exports = Game;
