'use strict';

import { renderField, stylingCells } from '../scripts/main';

const field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Game {
  constructor(initialField = field) {
    // eslint-disable-next-line no-console
    console.log(initialField);
    this.gameStatus = 'idle';
    this.score = 0;
    this.field = initialField;
  }

  moveLeft() {
    for (let j = 0; j < this.field.length; j++) {
      for (let i = 1; i < this.field[j].length; i++) {
        let k = i;

        while (k > 0 && this.field[j][k - 1] === 0) {
          this.field[j][k - 1] = this.field[j][k];
          this.field[j][k] = 0;
          k--;
        }

        if (k > 0 && this.field[j][k - 1] === this.field[j][k]) {
          this.score += this.field[j][k - 1] * 2;
          this.field[j][k - 1] *= 2;
          this.field[j][k] = 0;
        }
      }
    }
  }

  moveRight() {
    for (let j = 0; j < this.field.length; j++) {
      for (let i = this.field[j].length - 1; i >= 0; i--) {
        let k = i;

        while (k < this.field[j].length - 1 && this.field[j][k + 1] === 0) {
          this.field[j][k + 1] = this.field[j][k];
          this.field[j][k] = 0;
          k++;
        }

        if (
          k < this.field[j].length - 1 &&
          this.field[j][k + 1] === this.field[j][k]
        ) {
          this.score += this.field[j][k + 1] * 2;
          this.field[j][k + 1] *= 2;
          this.field[j][k] = 0;
        }
      }
    }
  }

  moveUp() {
    const size = field.length;

    for (let j = 0; j < size; j++) {
      let mergeOccurred = false;

      for (let i = 1; i < size; i++) {
        if (field[i][j] !== 0) {
          let k = i;

          while (k > 0 && field[k - 1][j] === 0) {
            field[k - 1][j] = field[k][j];
            field[k][j] = 0;
            k--;
          }

          if (!mergeOccurred && k > 0 && field[k - 1][j] === field[k][j]) {
            field[k - 1][j] *= 2;
            field[k][j] = 0;
            mergeOccurred = true;
          }
        }
      }
    }
  }

  moveDown() {
    for (let i = this.field.length - 2; i >= 0; i--) {
      for (let j = 0; j < this.field[i].length; j++) {
        let k = i;

        while (k < this.field.length - 1 && this.field[k + 1][j] === 0) {
          this.field[k + 1][j] = this.field[k][j];
          this.field[k][j] = 0;
          k++;
        }

        if (
          k < this.field.length - 1 &&
          this.field[k + 1][j] === this.field[k][j]
        ) {
          this.score += this.field[k + 1][j] * 2;
          this.field[k + 1][j] *= 2;
          this.field[k][j] = 0;
        }
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.field;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.addingNumberToField();
    this.addingNumberToField();
    this.gameStatus = 'playing';
  }

  restart() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addingNumberToField();
    this.addingNumberToField();
    renderField();
    this.gameStatus = 'playing';
    this.score = 0;
    stylingCells();
  }

  addingNumberToField() {
    const randomRow = +Math.floor(Math.random() * 4);
    const randomCeil = +Math.floor(Math.random() * 4);
    const firstNum = Math.random() >= 0.9 ? 4 : 2;

    if (!this.field[randomRow][randomCeil]) {
      this.field[randomRow][randomCeil] = firstNum;

      renderField();
    } else {
      this.addingNumberToField();
    }
  }

  checkVictory() {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] === 2048) {
          this.gameStatus = 'win';

          return true;
        }
      }
    }

    return false;
  }

  canMoveCellsRight() {
    for (let j = 0; j < this.field.length; j++) {
      for (let i = this.field[j].length - 1; i >= 0; i--) {
        if (
          (this.field[j][i + 1] === 0 &&
            this.field[j][i] !== this.field[j][i + 1]) ||
          (this.field[j][i + 1] === this.field[j][i] && this.field[j][i] !== 0)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveCellsLeft() {
    for (let j = 0; j < this.field.length; j++) {
      for (let i = this.field[j].length - 1; i >= 1; i--) {
        if (
          (this.field[j][i - 1] === 0 &&
            this.field[j][i] !== this.field[j][i - 1]) ||
          (this.field[j][i - 1] === this.field[j][i] && this.field[j][i] !== 0)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveCellsUp() {
    for (let i = 1; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (
          (this.field[i - 1][j] === 0 &&
            this.field[i][j] !== this.field[i - 1][j]) ||
          (this.field[i - 1][j] === this.field[i][j] && this.field[i][j] !== 0)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveCellsDown() {
    for (let i = 0; i < this.field.length - 1; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (
          (this.field[i + 1][j] === 0 &&
            this.field[i][j] !== this.field[i + 1][j]) ||
          (this.field[i + 1][j] === this.field[i][j] && this.field[i][j] !== 0)
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
