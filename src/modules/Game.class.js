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
    this.state = initialState.map((row) => [...row]);
  }

  getRandomCell() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [randomRow, randomCol] = emptyCells[randomIndex];

      this.state[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkStatus() {
    let hasEmptyCells = false;
    let canMove = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cellValue = this.state[row][col];

        if (cellValue === 2048) {
          this.status = Game.gameStatus.win;

          return;
        }

        if (cellValue === 0) {
          hasEmptyCells = true;
        }

        if (
          (row < 3 && cellValue === this.state[row + 1][col]) ||
          (col < 3 && cellValue === this.state[row][col + 1])
        ) {
          canMove = true;
        }

        if (hasEmptyCells || canMove) {
          return;
        }
      }
    }

    this.status = Game.gameStatus.lose;
  }

  moveLeft() {
    if (this.status === Game.gameStatus.playing) {
      for (let row = 0; row < 4; row++) {
        let newRow = this.state[row].filter((val) => val !== 0);

        for (let col = 0; col < newRow.length - 1; col++) {
          if (newRow[col] === newRow[col + 1]) {
            newRow[col] *= 2;
            this.score += newRow[col];
            newRow[col + 1] = 0;
          }
        }
        newRow = newRow.filter((val) => val !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }
        this.state[row] = newRow;
      }
      this.getRandomCell();
      this.checkStatus();
    }
  }

  moveRight() {
    if (this.status === Game.gameStatus.playing) {
      for (let row = 0; row < 4; row++) {
        let newRow = this.state[row].filter((val) => val !== 0);

        for (let col = newRow.length - 1; col > 0; col--) {
          if (newRow[col] === newRow[col - 1]) {
            newRow[col] *= 2;
            this.score += newRow[col];
            newRow[col - 1] = 0;
          }
        }
        newRow = newRow.filter((val) => val !== 0);

        while (newRow.length < 4) {
          newRow.unshift(0);
        }
        this.state[row] = newRow;
      }

      this.getRandomCell();
      this.checkStatus();
    }
  }
  moveUp() {
    if (this.status === Game.gameStatus.playing) {
      for (let col = 0; col < 4; col++) {
        let newCol = [];

        for (let row = 0; row < 4; row++) {
          if (this.state[row][col] !== 0) {
            newCol.push(this.state[row][col]);
          }
        }

        for (let row = 0; row < newCol.length - 1; row++) {
          if (newCol[row] === newCol[row + 1]) {
            newCol[row] *= 2;
            this.score += newCol[row];
            newCol[row + 1] = 0;
          }
        }
        newCol = newCol.filter((val) => val !== 0);

        while (newCol.length < 4) {
          newCol.push(0);
        }

        for (let row = 0; row < 4; row++) {
          this.state[row][col] = newCol[row];
        }
      }

      this.getRandomCell();
      this.checkStatus();
    }
  }

  moveDown() {
    if (this.status === Game.gameStatus.playing) {
      for (let col = 0; col < 4; col++) {
        let newCol = [];

        for (let row = 0; row < 4; row++) {
          if (this.state[row][col] !== 0) {
            newCol.push(this.state[row][col]);
          }
        }

        for (let row = newCol.length - 1; row > 0; row--) {
          if (newCol[row] === newCol[row - 1]) {
            newCol[row] *= 2;
            this.score += newCol[row];
            newCol[row - 1] = 0;
          }
        }
        newCol = newCol.filter((val) => val !== 0);

        while (newCol.length < 4) {
          newCol.unshift(0);
        }

        for (let row = 0; row < 4; row++) {
          this.state[row][col] = newCol[row];
        }
      }
      this.getRandomCell();
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
    this.getRandomCell();
    this.getRandomCell();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }
}

module.exports = Game;
