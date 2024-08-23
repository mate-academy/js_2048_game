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
    this.gameStatus = Game.gameStatus.idle;
    this.state = initialState.map((row) => [...row]);
  }

  isStateChanged(originalState) {
    if (this.hasStateChanged(originalState, this.state)) {
      this.addRandomTile();
      this.updateStatusOfTheGame(this.state);
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slideAndMerge(row) {
    const cellsWithValues = row.filter((value) => value !== 0);
    const mergedRow = [];

    for (let i = 0; i < cellsWithValues.length; i++) {
      if (cellsWithValues[i] === cellsWithValues[i + 1]) {
        mergedRow.push(cellsWithValues[i] * 2);
        this.score += cellsWithValues[i] * 2;
        i++;
      } else {
        mergedRow.push(cellsWithValues[i]);
      }
    }

    return mergedRow.concat(Array(4 - mergedRow.length).fill(0));
  }

  hasStateChanged(originalState, newState) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (originalState[row][col] !== newState[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  moveUp() {
    if (this.gameStatus !== Game.gameStatus.playing) {
      return;
    }

    const originalState = this.state.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = this.state.map((row) => row[col]);
      const newColumn = this.slideAndMerge(column);

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = newColumn[row];
      }
    }

    this.isStateChanged(originalState);
  }

  moveDown() {
    if (this.gameStatus !== Game.gameStatus.playing) {
      return;
    }

    const originalState = this.state.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = this.state.map((row) => row[col]).reverse();
      const newColumn = this.slideAndMerge(column).reverse();

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = newColumn[row];
      }
    }

    this.isStateChanged(originalState);
  }

  moveLeft() {
    if (this.gameStatus !== Game.gameStatus.playing) {
      return;
    }

    const originalState = this.state.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      this.state[row] = this.slideAndMerge(this.state[row]);
    }

    this.isStateChanged(originalState);
  }

  moveRight() {
    if (this.gameStatus !== Game.gameStatus.playing) {
      return;
    }

    const originalState = this.state.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      this.state[row] = this.slideAndMerge(this.state[row].reverse()).reverse();
    }

    this.isStateChanged(originalState);
  }

  updateStatusOfTheGame(state) {
    let has2048 = false;

    state.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 2048) {
          has2048 = true;
        }
      });
    });

    if (has2048) {
      this.gameStatus = Game.gameStatus.win;
    } else if (!this.canMove()) {
      this.gameStatus = Game.gameStatus.lose;
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    if (this.gameStatus === Game.gameStatus.idle) {
      this.gameStatus = Game.gameStatus.playing;
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.score = 0;
    this.gameStatus = Game.gameStatus.idle;
    this.state = this.initialState.map((row) => [...row]);
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const currentCell = this.state[row][col];

        if (this.state[row][col] === 0) {
          return true;
        }

        if (col < 3 && currentCell === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && currentCell === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
