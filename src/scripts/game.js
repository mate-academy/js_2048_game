'use strict';

module.exports = class Game {
  static getRandomNumber(start, end) {
    return Math.round(Math.random() * (end - start) + start);
  }

  constructor() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;

    this
      .addRandomCell()
      .addRandomCell();
  }

  addRandomCell() {
    const row = Game.getRandomNumber(0, 3);
    const column = Game.getRandomNumber(0, 3);

    if (this.field[row][column] === 0) {
      this.field[row][column] = Math.random() < 0.9 ? 2 : 4;
    } else if (!this.isGameOver()) {
      this.addRandomCell();
    }

    return this;
  }

  canCellBeCombined(row, column) {
    const currentCell = this.field[row][column];

    if (column > 0 && this.field[row][column - 1] === currentCell) {
      return true;
    }

    if (row > 0 && this.field[row - 1][column] === currentCell) {
      return true;
    }

    if (column < 3 && this.field[row][column + 1] === currentCell) {
      return true;
    }

    if (row < 3 && this.field[row + 1][column] === currentCell) {
      return true;
    }

    return false;
  }

  isGameOver() {
    const isEmptyCell = this.field.some(row => row.includes(0));
    const isMove = this.field.some((row, iR) =>
      row.some((_, iC) => this.canCellBeCombined(iR, iC)));
    const isGameOn = isEmptyCell || isMove;

    return !isGameOn;
  }

  isGameWin() {
    return this.field.some(row => row.some(cell => cell === 2048));
  }

  transposeField() {
    this.field = this.field[0].map((_, c) =>
      this.field.map((__, r) => this.field[r][c]));

    return this;
  }

  moveUp() {
    this
      .transposeField()
      .moveLeft()
      .transposeField();
  }

  moveDown() {
    this
      .transposeField()
      .moveRight()
      .transposeField();
  }

  moveLeft() {
    this.field = this.field.map(row => {
      const newRow = row.reduce((acc, currentCell) => {
        if (currentCell !== 0) {
          if (acc.length > 0 && acc[acc.length - 1] === currentCell) {
            acc[acc.length - 1] *= 2;
            this.score += acc[acc.length - 1];
          } else {
            acc.push(currentCell);
          }
        }

        return acc;
      }, []);

      newRow.push(...Array(4 - newRow.length).fill(0));

      return newRow;
    });
    this.addRandomCell();

    return this;
  }

  moveRight() {
    this.field = this.field.map(row => {
      const newRow = row.reduceRight((acc, currentCell) => {
        if (currentCell !== 0) {
          if (acc.length > 0 && acc[0] === currentCell) {
            acc[0] *= 2;
            this.score += acc[0];
          } else {
            acc.unshift(currentCell);
          }
        }

        return acc;
      }, []);

      newRow.unshift(...Array(4 - newRow.length).fill(0));

      return newRow;
    });
    this.addRandomCell();

    return this;
  }

  resetGame() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;

    this
      .addRandomCell()
      .addRandomCell();
  }

  getGameState() {
    return {
      field: this.field,
      score: this.score,
    };
  }
};
