'use strict';

const { getEmptyCells, getRandomTwoOrFour } = require('../utils/utils');

const SIZE = 4;

class Game {
  static gameStatus = {
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
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.gameStatus.idle;
  }

  slideLeft(filledCells) {
    filledCells.forEach((row) => {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row.splice(i + 1, 1);
        }
      }

      while (row.length < SIZE) {
        row.push(0);
      }
    });
  }

  filledFilter(row) {
    return row.filter((cell) => cell !== 0);
  }

  moveLeft() {
    const filledCells = this.state.map((row) => this.filledFilter(row));

    this.slideLeft(filledCells);
    this.state = filledCells;
  }

  moveRight() {
    const filledCells = this.state.map((row) => {
      return this.filledFilter(row.reverse());
    });

    this.slideLeft(filledCells);
    this.state = filledCells.map((row) => row.reverse());
  }

  swap(x, y) {
    const tempCell = this.state[x][y];

    this.state[x][y] = this.state[y][x];
    this.state[y][x] = tempCell;
  }

  transpose() {
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < x; y++) {
        this.swap(x, y);
      }
    }
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
    this.status = Game.gameStatus.playing;
    this.fillFreeCell();
    this.updateBorder();
  }

  restart() {
    this.status = Game.gameStatus.idle;
    this.score = 0;
    this.state = this.initialState.map((row) => [...row]);
    this.updateBorder();
  }

  fillFreeCell() {
    const emptyCells = getEmptyCells(this.state);
    let count = Math.min(2, emptyCells.length);

    while (count > 0) {
      const index = Math.floor(Math.random() * emptyCells.length);
      const [row, coll] = emptyCells[index];

      this.state[row][coll] = getRandomTwoOrFour();
      emptyCells.splice(index, 1);

      count -= 1;
    }
  }

  updateBorder() {
    const gameField = document.querySelector('.game-field');

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const gameCell = gameField.rows[rowIndex].children[cellIndex];

        gameCell.textContent = cell === 0 ? '' : cell;
        gameCell.className = 'field-cell';

        if (cell !== 0) {
          gameCell.classList.add(`field-cell--${cell}`);
        }

        if (cell === 2048) {
          this.status = Game.gameStatus.win;
        }
      });
    });

    const emptyCells = getEmptyCells(this.state);

    if (!emptyCells.length) {
      this.status = Game.gameStatus.lose;
    }
  }
}

module.exports = Game;
