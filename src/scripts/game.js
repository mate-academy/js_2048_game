'use strict';

const desiredNumber = 2048;

export const [Left, Up, Right, Down] = [1, 2, 3, 4];
export const PossibleState = {
  Reset: 0,
  Started: 1,
  InProgress: 2,
  GameOver: 3,
  Win: 4,
};

export class Game {
  constructor(gameSize) {
    this.gameSize = gameSize;
    this.gameCells = [...Array(gameSize ** 2)].map(v => -1);
    this.gameState = PossibleState.Reset;
    this.gameScore = 0;
  }

  getRandom() {
    const num = Math.random();

    return (num < 0.9) ? 2 : 4;
  }

  getRandomCellIndex() {
    const emptyCells = this.gameCells
      .map((cell, index) => (
        {
          index: index,
          value: cell,
        }
      ))
      .filter((cell) => cell.value === -1);

    if (emptyCells.length) {
      const index = Math.floor(Math.random() * emptyCells.length);

      return emptyCells[index].index;
    }

    return -1;
  }

  reset() {
    this.gameCells.fill(-1);
    this.gameScore = 0;
    this.start();
  }

  start() {
    this.gameState = PossibleState.Started;
  
    const testing = false;
  
    if (testing) {
      this.gameCells[9] = 1024;
      this.gameCells[5] = 1024;
      this.gameCells[13] = 128;
      this.gameCells[1] = 8;
    } else {
      const cell1 = this.getRandomCellIndex();
  
      this.gameCells[cell1] = this.getRandom();
  
      const cell2 = this.getRandomCellIndex();
  
      this.gameCells[cell2] = this.getRandom();
    }
  }

  updateScore(addScore) {
    this.gameScore += addScore;
  
    if (addScore === desiredNumber) {
      this.gameState = PossibleState.Win;
    }
  }
  
  combineValues(cells, direction) {
    const values = cells
      .filter(elem => elem !== -1);
    let comparePos = direction ? 1 : values.length - 2;
    const prevPos = direction ? 0 : values.length - 1;
  
    for (let startPos = prevPos;
      direction ? comparePos < values.length : comparePos >= 0;
    ) {
      if (values[startPos] === values[comparePos]) {
        this.updateScore(values[startPos] * 2);
        values[direction ? startPos : comparePos] *= 2;
        values[direction ? comparePos : startPos] = -1;
        direction ? comparePos += 2 : startPos -= 2;
        direction ? startPos += 2 : comparePos -= 2;
      } else {
        direction ? comparePos++ : startPos--;
        direction ? startPos++ : comparePos--;
      }
    }
  
    return values.filter(value => value !== -1);
  }
  
  fillNewValues(indexes, newValues, direction) {
    const oldValues = indexes.map(index => this.gameCells[index]);
  
    if (direction) {
      for (let i = 0; i < newValues.length; i++) {
        this.gameCells[indexes[i]] = newValues[i];
      }
  
      for (let i = newValues.length; i < indexes.length; i++) {
        this.gameCells[indexes[i]] = -1;
      }
    } else {
      for (let i = 0; i < indexes.length - newValues.length; i++) {
        this.gameCells[indexes[i]] = -1;
      }
  
      for (let i = 0; i < newValues.length; i++) {
        const ind = indexes[indexes.length - newValues.length + i];
  
        this.gameCells[ind] = newValues[i];
      }
    }
  
    const refreshedValues = indexes.map(index => this.gameCells[index]);
    let haveChanges = false;
  
    for (let i = 0; i < oldValues.length; i++) {
      if (oldValues[i] !== refreshedValues[i]) {
        haveChanges = true;
        break;
      }
    }
  
    return haveChanges;
  }
  
  move(direction) {
    let haveChanges = false;
  
    if (direction % 2 === 1) {
      haveChanges = this.moveRow(direction === Left);
    } else {
      haveChanges = this.moveColumn(direction === Up);
    }
  
    if (this.gameState === PossibleState.Started) {
      this.gameState = PossibleState.InProgress;
    }
  
    const cell = this.getRandomCellIndex();
  
    if (cell >= 0) {
      if (haveChanges) {
        this.gameCells[cell] = this.getRandom();
      }
    } else {
      this.gameState = PossibleState.GameOver;
    }
  
  }
  
  moveRow(left) {
    let haveChanges = false;
  
    for (let i = 0; i < this.gameSize; i++) {
      const indexes = [];
  
      for (let j = i * this.gameSize; j < i * this.gameSize + this.gameSize; j++) {
        indexes.push(j);
      }
  
      const row = this.gameCells.slice(i * this.gameSize, i * this.gameSize + this.gameSize);
      const result = this.combineValues(row, left);
  
      haveChanges |= this.fillNewValues(indexes, result, left);
    }
  
    return haveChanges;
  }
  
  moveColumn(up) {
    let haveChanges = false;
  
    for (let i = 0; i < this.gameSize; i++) {
      const indexes = [];
  
      for (let j = 0; j < this.gameSize; j++) {
        indexes.push(i + j * this.gameSize);
      }
  
      const column = this.gameCells
        .filter((item, index) => (index - i) % this.gameSize === 0);
      const result = this.combineValues(column, up);
  
      haveChanges |= this.fillNewValues(indexes, result, up);
    }
  
    return haveChanges;
  }

}