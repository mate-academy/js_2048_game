'use strict';

class Game {
  constructor() {
    this.score = 0;
    this.state = 'start';

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  cellsValues() {
    return this.field.reduce((prev, curr) => prev.concat(curr), []);
  }

  startingNewGame() {
    this.state = 'started';

    const initialCellNumber = 2;

    for (let i = 0; i < initialCellNumber; i++) {
      const [row, col] = this.randomEmptyCell();

      this.field[row][col] = 2;
    }
  }

  randomEmptyCell() {
    const emptyCells = [];

    this.field.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
      if (!cell) {
        emptyCells.push([rowIndex, columnIndex]);
      }
    }));

    if (!emptyCells.length) {
      throw new Error('no empty cells');
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex]; // [1, 3]
  }

  moveLeft() {
    this.collapseCells();
    this.moveCells();

    const [ row, col ] = this.randomEmptyCell();

    this.field[row][col] = Math.random() >= 0.9 ? 4 : 2;

    this.havePossibleMove();
  }

  moveRight() {
    this.rotateField().rotateField();
    this.moveLeft();
    this.rotateField().rotateField();
  }

  moveTop() {
    this.rotateField().rotateField().rotateField();
    this.moveLeft();
    this.rotateField();
  }

  moveBottom() {
    this.rotateField();
    this.moveLeft();
    this.rotateField().rotateField().rotateField();
  }

  moveCells() {
    this.field.forEach(row => {
      let emptyCell = row.findIndex(el => el === 0);

      if (emptyCell < 0) {
        return;
      }

      for (let i = emptyCell + 1; i < row.length; i++) {
        if (!row[i]) {
          continue;
        }

        row[emptyCell] = row[i];
        row[i] = 0;
        emptyCell++;
      }
    });
  }

  collapseCells() {
    this.field.forEach(row => {
      let index = row.findIndex(el => el !== 0);

      if (index === -1) {
        return;
      }

      for (let i = index + 1; i < this.field.length; i++) {
        if (!row[i]) {
          continue;
        }

        if (row[i] === row[index]) {
          row[index] *= 2;
          row[i] = 0;

          if (row[index] === 2048) {
            this.state = 'win';
          }

          this.score += row[index];

          index = row.findIndex((el, j) => el !== 0 && j > i);

          if (index === -1) {
            return;
          }

          i = index;
        }
        index = i;
      }
    });
  }

  rotateField() {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = i + 1; j < this.field[0].length; j++) {
        [this.field[i][j], this.field[j][i]]
          = [this.field[j][i], this.field[i][j]];
      }
    }

    this.field.forEach(row => row.reverse());

    return this;
  }

  havePossibleMove() {
    if (this.cellsValues().some(cell => cell === 0)) {
      return;
    }

    for (let row = 0; row < this.field.length; row++) {
      for (let col = 0; col < this.field[0].length; col++) {
        const equalRight = this.field[row][col] === this.field[row][col + 1];
        const equalBottom = this.field[row][col]
          === this.field[row + 1] ? this.field[row + 1][col] : undefined;

        if (equalRight || equalBottom) {
          return;
        }
      }
    }

    this.state = 'loss';
  }
}

module.exports = Game;

// const start = document.querySelector('.button');
// const cells = document.querySelectorAll('.field-cell');
// const gameScore = document.querySelector('.game-score');
// const messageStart = document.querySelector('.message-start');

// start.addEventListener('click', () => {
//   const game = new Game();

//   game.startingNewGame();
// });
