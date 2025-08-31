'use strict';

class Game {
  constructor(initialState) {
    this.statusGame = 'idle';
    this.gameScore = 0;

    this.gameStatus = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.tabelStart = this.gameStatus.map((row) => [...row]);
  }

  moveLeft() {
    if (this.statusGame !== 'playing') {
      return;
    }

    let change = false;

    for (let i = 0; i < this.gameStatus.length; i++) {
      const row = this.gameStatus[i];

      let newRow = row.filter((n) => n !== 0);

      newRow = this.cellDood(newRow);

      for (let n = 0; n < newRow.length; n++) {
        if (this.gameStatus[i][n] !== newRow[n]) {
          this.gameStatus[i] = newRow;
          change = true;
        }
      }
    }

    if (change) {
      this.randomCells();
      this.getScore();
    }
  }

  moveRight() {
    if (this.statusGame !== 'playing') {
      return;
    }

    let change = false;

    for (let i = 0; i < this.gameStatus.length; i++) {
      const row = [...this.gameStatus[i]].reverse();

      let newRow = row.filter((n) => n !== 0);

      newRow = this.cellDood(newRow);

      newRow.reverse();

      for (let n = 0; n < row.length; n++) {
        if (this.gameStatus[i][n] !== newRow[n]) {
          this.gameStatus[i] = newRow;
          change = true;
        }
      }
    }

    if (change) {
      this.randomCells();
      this.getScore();
    }
  }

  moveUp() {
    if (this.statusGame !== 'playing') {
      return;
    }

    let change = false;

    for (let i = 0; i < this.gameStatus.length; i++) {
      const colum = this.gameStatus.map((row) => row[i]);

      let newColumn = colum.filter((n) => n !== 0);

      newColumn = this.cellDood(newColumn);

      for (let k = 0; k < colum.length; k++) {
        if (this.gameStatus[k][i] !== newColumn[k]) {
          change = true;
          this.gameStatus[k][i] = newColumn[k];
        }
      }
    }

    if (change) {
      this.randomCells();
      this.getScore();
    }
  }

  moveDown() {
    if (this.statusGame !== 'playing') {
      return;
    }

    let change = false;

    for (let i = 0; i < this.gameStatus.length; i++) {
      const colum = this.gameStatus.map((row) => row[i]).reverse();

      let newColumn = colum.filter((n) => n !== 0);

      newColumn = this.cellDood(newColumn);

      newColumn.reverse();

      for (let k = 0; k < colum.length; k++) {
        if (this.gameStatus[k][i] !== newColumn[k]) {
          change = true;
          this.gameStatus[k][i] = newColumn[k];
        }
      }
    }

    if (change) {
      this.randomCells();
      this.getScore();
    }
  }

  getScore() {
    this.winGame();
    this.loseGame();

    return this.gameScore;
  }

  getState() {
    return this.gameStatus;
  }

  getStatus() {
    return this.statusGame;
  }

  start() {
    this.statusGame = 'playing';
    this.randomCells(2);

    return this;
  }

  restart() {
    this.gameStatus = this.tabelStart.map((row) => [...row]);
    this.statusGame = 'idle';
    this.gameScore = 0;

    this.getScore();
  }

  randomCells(cell = 1) {
    for (let i = 0; i < cell; i++) {
      const randomNum = Math.random() > 0.9 ? 4 : 2;
      const rowIndex = Math.floor(Math.random() * 4);
      const cellsIndex = Math.floor(Math.random() * 4);

      if (this.gameStatus[rowIndex][cellsIndex] === 0) {
        this.gameStatus[rowIndex][cellsIndex] = randomNum;
      } else {
        this.randomCells(1);
      }
    }
  }

  cellDood(arr) {
    let newArr = [...arr];

    for (let j = 0; j < newArr.length; j++) {
      if (newArr[j] === newArr[j + 1]) {
        newArr[j] *= 2;
        this.gameScore += +newArr[j];
        newArr.splice(j + 1, 1);
      }
    }

    newArr = newArr.filter((n) => n !== 0);

    while (newArr.length < 4) {
      newArr.push(0);
    }

    return newArr;
  }

  winGame() {
    if (this.gameStatus.flat().some((n) => n === 2048)) {
      this.statusGame = 'win';
    }
  }

  loseGame() {
    for (let i = 0; i < this.gameStatus.length; i++) {
      const row = this.gameStatus[i];
      const colum = this.gameStatus.map((n) => n[i]);

      if (colum.includes(0) || row.includes(0)) {
        return;
      }

      for (let j = 0; j < row.length; j++) {
        if (row[j] === row[j + 1]) {
          return;
        }
      }

      for (let j = 0; j < row.length; j++) {
        if (colum[j] === colum[j + 1]) {
          return;
        }
      }
    }
    this.statusGame = 'lose';
  }
}

module.exports = Game;
