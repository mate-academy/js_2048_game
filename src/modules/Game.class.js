'use strict';
import { GRID_SIZE, STATUS, WIN_TARGET } from './constants.js';

export default class Game {
  constructor(initialState) {
    this.tileCounter = 0;

    this.field =
      initialState ||
      Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(null));
    this.score = 0;
    this.gameStatus = STATUS.IDLE;
  }

  createTile(value) {
    return { id: this.tileCounter++, value };
  }

  moveLeft() {
    const prevState = JSON.stringify(this.field);

    for (let r = 0; r < GRID_SIZE; r++) {
      const row = this.field[r].filter((cell) => cell !== null);
      const newRow = Array(GRID_SIZE).fill(null);

      for (let i = 0; i < row.length; i++) {
        if (i < row.length - 1 && row[i].value === row[i + 1].value) {
          const mergedValue = row[i].value * 2;

          newRow[i] = {
            ...row[i],
            value: mergedValue,
            mergedFrom: [row[i], row[i + 1]],
          };
          this.score += mergedValue;
          row.splice(i + 1, 1);
        } else {
          newRow[i] = row[i];
        }
      }
      this.field[r] = newRow;
    }

    if (prevState !== JSON.stringify(this.field)) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();
    }
  }
  moveRight() {
    this.reverse();
    this.moveLeft();
    this.reverse();
  }
  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }
  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  reverse() {
    this.field = this.field.map((row) => row.reverse());
  }
  transpose() {
    this.field = this.field[0].map((_, c) => this.field.map((row) => row[c]));
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!this.field[r][c]) {
          empty.push({ r, c });
        }
      }
    }

    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];

      this.field[r][c] = this.createTile(Math.random() < 0.1 ? 4 : 2);
    }
  }

  checkWin() {
    if (this.field.flat().some((tile) => tile?.value === WIN_TARGET)) {
      this.gameStatus = STATUS.WIN;
    }
  }

  checkGameOver() {
    if (this.field.flat().some((tile) => tile === null)) {
      return;
    }

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const val = this.field[r][c].value;

        if (c < GRID_SIZE - 1 && val === this.field[r][c + 1].value) {
          return;
        }

        if (r < GRID_SIZE - 1 && val === this.field[r + 1][c].value) {
          return;
        }
      }
    }
    this.gameStatus = STATUS.LOSE;
  }

  start() {
    this.gameStatus = STATUS.PLAYING;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.field = Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(null));
    this.score = 0;
    this.gameStatus = STATUS.IDLE;
    this.start();
  }

  getState() {
    return this.field;
  }
  getScore() {
    return this.score;
  }
  getStatus() {
    return this.gameStatus;
  }
}
