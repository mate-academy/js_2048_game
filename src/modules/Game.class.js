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
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
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

  start() {
    this.status = Game.STATUS.playing;
    this.getRandomBlock();
    this.getRandomBlock();
  }

  restart() {
    this.status = Game.STATUS.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  getRandomBlock() {
    const emptyBlock = this.state.reduce((acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          acc.push([rowIndex, colIndex]);
        }
      });

      return acc;
    }, []);

    if (emptyBlock.length > 0) {
      const [randomR, randomC] =
        emptyBlock[Math.floor(Math.random() * emptyBlock.length)];

      this.state[randomR][randomC] = Math.random() < 0.9 ? 2 : 4;
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
      (_, colIndex) => this.getColumn(colIndex),
      (col, colIndex) => this.setColumn(col, colIndex),
    );
  }

  moveDown() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    this.move(
      (_, colIndex) => this.getColumn(colIndex).reverse(),
      (col, colIndex) => this.setColumn(col.reverse(), colIndex),
    );
  }

  move(getRowFunc, setRowFunc) {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = getRowFunc(this.state[i], i);
      const [shiftedRow] = this.combineAndShift(row);

      if (shiftedRow.toString() !== row.toString()) {
        moved = true;
      }
      setRowFunc(shiftedRow, i);
    }

    if (moved) {
      this.getRandomBlock();
      this.checkGameOverOrWin();
    }
  }

  getColumn(colIndex) {
    return this.state.map((row) => row[colIndex]);
  }

  setColumn(col, colIndex) {
    col.forEach((value, rowIndex) => {
      this.state[rowIndex][colIndex] = value;
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

  checkGameOverOrWin() {
    if (this.state.flat().includes(2048)) {
      this.status = Game.STATUS.win;

      return;
    }

    if (!this.canMove()) {
      this.status = Game.STATUS.lose;
    }
  }

  canMove() {
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
