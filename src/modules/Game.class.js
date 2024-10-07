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
          if (this.status !== Game.gameStatus.win) {
            this.status = Game.gameStatus.win;
          }
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
      }
    }

    if (!hasEmptyCells && !canMove) {
      this.status = Game.gameStatus.lose;
    }
  }

  moveLeft() {
    const previousState = this.state.map((row) => row.slice());

    for (let row = 0; row < 4; row++) {
      const newRow = this.state[row].filter((val) => val !== 0);
      const mergedRow = [];

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      this.state[row] = mergedRow.concat(Array(4 - mergedRow.length).fill(0));
    }

    this.checkForChanges(previousState);
    this.checkStatus();
  }

  moveRight() {
    const previousState = this.state.map((row) => row.slice());

    for (let row = 0; row < 4; row++) {
      const newRow = this.state[row].filter((val) => val !== 0).reverse();
      const mergedRow = [];

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      this.state[row] = Array(4 - mergedRow.length)
        .fill(0)
        .concat(mergedRow.reverse());
    }

    this.checkForChanges(previousState);
    this.checkStatus();
  }

  moveUp() {
    this.state = this.transpose(this.state);
    this.moveLeft();
    this.state = this.transpose(this.state);
  }

  moveDown() {
    this.state = this.transpose(this.state);
    this.moveRight();
    this.state = this.transpose(this.state);
  }

  transpose(state) {
    const result = [];

    for (let col = 0; col < 4; col++) {
      result[col] = [];

      for (let row = 0; row < 4; row++) {
        result[col].push(state[row][col]);
      }
    }

    return result;
  }

  checkForChanges(previousState) {
    if (this.state.toString() !== previousState.toString()) {
      this.getRandomCell();
      this.status = Game.gameStatus.playing;
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
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.gameStatus.idle;
  }
}

module.exports = Game;
