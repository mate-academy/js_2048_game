'use strict';

class Game {
  static STATUS = {
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
    this.status = Game.STATUS.idle;
    this.score = 0;
    this.state = initialState.map((row) => [...row]);
    this.initialState = initialState;
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
    this.status = Game.STATUS.playing;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.status = Game.STATUS.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          emptyTiles.push([row, column]);
        }
      }
    }

    if (emptyTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);
      const [row, column] = emptyTiles[randomIndex];

      this.state[row][column] = Math.random() <= 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    this.move(
      (row) => row,
      (row, rowIndex) => (this.state[rowIndex] = row),
    );
  }

  moveRight() {
    this.move(
      (row) => row.reverse(),
      (row, rowIndex) => (this.state[rowIndex] = row.reverse()),
    );
  }

  moveUp() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    this.move(
      (_, columnIndex) => this.getColumn(columnIndex),
      (column, columnIndex) => this.setColumn(column, columnIndex),
    );
  }

  moveDown() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    this.move(
      (_, columnIndex) => this.getColumn(columnIndex).reverse(),
      (column, columnIndex) => this.setColumn(column.reverse(), columnIndex),
    );
  }

  move(getRow, setRow) {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = getRow(this.state[i], i);
      const [shiftedRow] = this.combineAndShift(row);

      if (shiftedRow.toString() !== row.toString()) {
        moved = true;
      }
      setRow(shiftedRow, i);
    }

    if (moved) {
      this.addRandomTile();
      this.checkLoseOrWin();
    }
  }

  getColumn(colIndex) {
    return this.state.map((row) => row[colIndex]);
  }

  setColumn(column, columnIndex) {
    column.forEach((value, rowIndex) => {
      this.state[rowIndex][columnIndex] = value;
    });
  }

  combineAndShift(row) {
    let newRow = row.filter((val) => val !== 0);
    let combined = false;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
        combined = true;
      }
    }

    newRow = newRow.filter((val) => val !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return [newRow, combined];
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          return true;
        }

        if (
          column < 3 &&
          this.state[row][column] === this.state[row][column + 1]
        ) {
          return true;
        }

        if (
          row < 3 &&
          this.state[row][column] === this.state[row + 1][column]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  checkLoseOrWin() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 2048) {
          this.status = Game.STATUS.win;

          return;
        }
      }
    }

    if (!this.canMove()) {
      this.status = Game.STATUS.lose;
    }
  }
}

module.exports = Game;
