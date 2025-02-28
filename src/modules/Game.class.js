/* eslint-disable padding-line-between-statements */
'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this._initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this._state = initialState;
    this._status = 'idle';
    this._score = 0;
  }

  moveLeft() {
    if (this._status !== 'playing') {
      return [];
    }

    const newState = [...this._state];
    const numbersPos = [];

    for (let i = 0; i < newState.length; i++) {
      const tempNumb = [];
      let newRow = newState[i].filter((el, index) => {
        if (el !== 0) {
          tempNumb.push({
            fromRow: i,
            fromCol: index,
          });
        }
        return el !== 0;
      });
      tempNumb.forEach((el, index) => {
        el.toRow = i;
        el.toCol = index;
        el.isMoved = el.toCol !== el.fromCol;
      });
      newRow = [
        ...newRow,
        ...new Array(newState[i].length - newRow.length).fill(0),
      ];

      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1] && newRow[j] !== 0) {
          newRow[j] += newRow[j + 1];
          this._score += newRow[j];
          newRow.splice(j + 1, 1);
          newRow.push(0);

          tempNumb.forEach((el) => {
            if (el.toCol === j) {
              el.toCol = j;
              el.isMerged = true;
              el.isMoved = el.fromCol !== j;
            } else if (el.toCol === j + 1) {
              el.toCol = j + 1;
              el.isMerged = true;
              el.isMoved = true;
            }
            if (el.toCol > j + 1) {
              el.toCol -= 1;
            }
          });
        }
      }
      numbersPos.push(...tempNumb);
      newState[i] = newRow;
    }
    this._state = newState;
    if (numbersPos.some((el) => el.isMoved || el.isMerged)) {
      this.spawnNumber();
      this.updateStatus();
    }
    return numbersPos;
  }

  moveRight() {
    if (this._status !== 'playing') {
      return [];
    }

    const newState = [...this._state];
    const numbersPos = [];

    for (let i = 0; i < newState.length; i++) {
      const tempNumb = [];
      let newRow = newState[i].filter((el, index) => {
        if (el !== 0) {
          tempNumb.push({
            fromRow: i,
            fromCol: index,
          });
        }
        return el !== 0;
      });

      tempNumb.forEach((el, index) => {
        el.toRow = i;
        el.toCol = newState[i].length - newRow.length + index;
        el.isMoved = el.toCol !== el.fromCol;
      });

      newRow = [
        ...new Array(newState[i].length - newRow.length).fill(0),
        ...newRow,
      ];

      for (let j = newRow.length - 1; j > 0; j--) {
        if (newRow[j] === newRow[j - 1] && newRow[j] !== 0) {
          newRow[j] += newRow[j - 1];
          this._score += newRow[j];
          newRow.splice(j - 1, 1);
          newRow.unshift(0);

          tempNumb.forEach((el) => {
            if (el.toCol === j) {
              el.toCol = j;
              el.isMerged = true;
            } else if (el.toCol === j - 1) {
              el.toCol = j - 1;
              el.isMerged = true;
              el.isMoved = true;
            }
            if (el.toCol < j - 1) {
              el.toCol += 1;
            }
          });
        }
      }
      numbersPos.push(...tempNumb);
      newState[i] = newRow;
    }
    this._state = newState;
    if (numbersPos.some((el) => el.isMoved || el.isMerged)) {
      this.spawnNumber();
      this.updateStatus();
    }
    return numbersPos;
  }

  moveUp() {
    if (this._status !== 'playing') {
      return [];
    }

    const newState = [...this._state];
    const numbersPos = [];

    for (let i = 0; i < newState[0].length; i++) {
      let newCol = [];
      const tempNumb = [];

      for (let j = 0; j < newState.length; j++) {
        if (newState[j][i] !== 0) {
          newCol.push(newState[j][i]);
          tempNumb.push({
            fromRow: j,
            fromCol: i,
          });
        }
      }

      tempNumb.forEach((el, index) => {
        el.toRow = index;
        el.toCol = i;
        el.isMoved = el.toRow !== el.fromRow;
      });

      newCol = [
        ...newCol,
        ...new Array(newState.length - newCol.length).fill(0),
      ];

      for (let j = 0; j < newCol.length; j++) {
        if (newCol[j] === newCol[j + 1] && newCol[j] !== 0) {
          newCol[j] += newCol[j + 1];
          this._score += newCol[j];
          newCol.splice(j + 1, 1);
          newCol.push(0);

          tempNumb.forEach((el) => {
            if (el.toRow === j) {
              el.toRow = j;
              el.isMerged = true;
            } else if (el.toRow === j + 1) {
              el.toRow = j + 1;
              el.isMerged = true;
              el.isMoved = true;
            }
            if (el.toRow > j + 1) {
              el.toRow -= 1;
            }
          });
        }
      }
      for (let j = 0; j < newState.length; j++) {
        newState[j][i] = newCol[j];
      }
      numbersPos.push(...tempNumb);
    }
    this._state = newState;
    if (numbersPos.some((el) => el.isMoved || el.isMerged)) {
      this.spawnNumber();
      this.updateStatus();
    }
    return numbersPos;
  }

  moveDown() {
    if (this._status !== 'playing') {
      return [];
    }

    const newState = [...this._state];
    const numbersPos = [];

    for (let i = 0; i < newState[0].length; i++) {
      let newCol = [];
      const tempNumb = [];

      for (let j = 0; j < newState.length; j++) {
        if (newState[j][i] !== 0) {
          newCol.push(newState[j][i]);
          tempNumb.push({
            fromRow: j,
            fromCol: i,
          });
        }
      }

      tempNumb.forEach((el, index) => {
        el.toRow = newState.length - newCol.length + index;
        el.toCol = i;
        el.isMoved = el.toRow !== el.fromRow;
      });

      newCol = [
        ...new Array(newState.length - newCol.length).fill(0),
        ...newCol,
      ];

      for (let j = newCol.length - 1; j > 0; j--) {
        if (newCol[j] === newCol[j - 1] && newCol[j] !== 0) {
          newCol[j] += newCol[j - 1];
          this._score += newCol[j];
          newCol.splice(j - 1, 1);
          newCol.unshift(0);

          tempNumb.forEach((el) => {
            if (el.toRow === j) {
              el.toRow = j;
              el.isMerged = true;
            } else if (el.toRow === j - 1) {
              el.toRow = j - 1;
              el.isMerged = true;
              el.isMoved = true;
            }
            if (el.toRow < j - 1) {
              el.toRow += 1;
            }
          });
        }
      }

      for (let j = 0; j < newState.length; j++) {
        newState[j][i] = newCol[j];
      }
      numbersPos.push(...tempNumb);
    }
    this._state = newState;
    if (numbersPos.some((el) => el.isMoved || el.isMerged)) {
      this.spawnNumber();
      this.updateStatus();
    }
    return numbersPos;
  }

  getScore() {
    return this._score;
  }

  getState() {
    return this._state;
  }

  updateStatus() {
    if (this.isWin()) {
      this._status = 'win';
    } else if (!this.canMove()) {
      this._status = 'lose';
    }
  }

  // Повертає поточний статус
  getStatus() {
    return this._status;
  }

  start() {
    if (this._status === 'idle') {
      this._status = 'playing';
      this.spawnNumber();
      this.spawnNumber();
      this._score = 0;
    }
  }

  reset() {
    this._state = structuredClone(this._initialState);
    this._score = 0;
    this._status = 'idle';
  }

  restart() {
    this.reset();
  }

  spawnNumber() {
    const freeCell = [];
    if (!this._state.some((row) => row.includes(0))) {
      return false;
    }
    for (let i = 0; i < this._state.length; i++) {
      for (let j = 0; j < this._state[i].length; j++) {
        if (this._state[i][j] === 0) {
          freeCell.push({ x: j, y: i });
        }
      }
    }

    const randPos = Math.floor(Math.random() * freeCell.length);
    const newXpos = freeCell[randPos].x;
    const newYpos = freeCell[randPos].y;

    const PROPABILITY_PERCENT = 10;
    const valuePropability = Math.random() * 100;
    const number = valuePropability <= PROPABILITY_PERCENT ? 4 : 2;

    this._state[newYpos][newXpos] = number;

    return true;
  }

  isWin() {
    return this._state.some((row) => row.includes(2048));
  }

  canMove() {
    if (this._state.some((row) => row.includes(0))) {
      return true;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this._state[i][j];
        if (i < 3 && current === this._state[i + 1][j]) {
          return true;
        }
        if (j < 3 && current === this._state[i][j + 1]) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = Game;
