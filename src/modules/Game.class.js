'use strict';

class Game {
  static gameStatus = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  static getInitialState() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  constructor(initialState = Game.getInitialState()) {
    this.initialState = JSON.parse(JSON.stringify(initialState));
    this.state = initialState;
    this.score = 0;
    this.status = Game.gameStatus.idle;
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

  start() {
    if (this.status === Game.gameStatus.idle) {
      this.status = Game.gameStatus.playing;
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.score = 0;
    this.state = this.initialState;
    this.status = Game.gameStatus.idle;
  }

  mergeAndSlideRow(row) {
    const nonEmptyValues = row.filter((value) => value);
    const mergedRow = [];

    for (let i = 0; i < nonEmptyValues.length; i++) {
      if (nonEmptyValues[i] === nonEmptyValues[i + 1]) {
        mergedRow.push(nonEmptyValues[i] * 2);
        this.score += nonEmptyValues[i] * 2;
        i++;
      } else {
        mergedRow.push(nonEmptyValues[i]);
      }
    }

    return mergedRow.concat(Array(4 - mergedRow.length).fill(0));
  }

  moveLeft() {
    if (this.status !== Game.gameStatus.playing) {
      return;
    }

    const originalState = JSON.stringify(this.state);

    this.state = this.state.map((row) => this.mergeAndSlideRow(row));

    if (JSON.stringify(this.state) !== originalState) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== Game.gameStatus.playing) {
      return;
    }

    const originalState = JSON.stringify(this.state);

    this.state = this.state.map((row) => {
      const reversedRow = [...row].reverse();
      const mergedRow = this.mergeAndSlideRow(reversedRow);

      return mergedRow.reverse();
    });

    if (JSON.stringify(this.state) !== originalState) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== Game.gameStatus.playing) {
      return;
    }

    const originalState = JSON.stringify(this.state);

    const transposedState = this.transpose(this.state);

    this.state = transposedState.map((row) => this.mergeAndSlideRow(row));
    this.state = this.transpose(this.state);

    if (JSON.stringify(this.state) !== originalState) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== Game.gameStatus.playing) {
      return;
    }

    const originalState = JSON.stringify(this.state);

    this.state = this.transpose(this.state).map((column) => {
      const reversedColumn = column.reverse();
      const mergedColumn = this.mergeAndSlideRow(reversedColumn);

      return mergedColumn.reverse();
    });

    this.state = this.transpose(this.state);

    if (JSON.stringify(this.state) !== originalState) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  transpose(state) {
    return state[0].map((_, i) => state.map((row) => row[i]));
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

  updateStatus() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = Game.gameStatus.win;

          return;
        }
      }
    }

    if (!this.hasAvailableMoves()) {
      this.status = Game.gameStatus.lose;
    }
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
