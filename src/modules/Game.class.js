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

  checkAbleToMove(cells) {
    // let changed = false;
    const newCells = cells.flat();
    const oldCells = this.state.flat();

    for (let i = 0; i < newCells.length; i++) {
      if (newCells[i] !== oldCells[i]) {
        return true;
      }
    }

    return false;
  }

  moveLeft() {
    const filledCells = this.state.map((row) => this.filledFilter(row));

    this.slideLeft(filledCells);

    const changed = this.checkAbleToMove(filledCells);

    this.state = filledCells;

    return changed;
  }

  moveRight() {
    const filledCells = this.state.map((row) => {
      return this.filledFilter(row.reverse());
    });

    this.slideLeft(filledCells);

    const changed = this.checkAbleToMove(filledCells);
    const newCells = filledCells.map((row) => row.reverse());

    this.state = newCells;

    return changed;
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

    const changed = this.moveLeft();

    this.transpose();

    return changed;
  }

  moveDown() {
    this.transpose();

    const changed = this.moveRight();

    this.transpose();

    return changed;
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
    // let count = Math.min(2, emptyCells.length);

    if (emptyCells.length > 0) {
      const index = Math.floor(Math.random() * emptyCells.length);
      const [row, coll] = emptyCells[index];

      this.state[row][coll] = getRandomTwoOrFour();
      // emptyCells.splice(index, 1);

      // count -= 1;
    }
  }

  checkLose() {
    const emptyCells = getEmptyCells(this.state);

    if (!emptyCells.length) {
      for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE - 1; y++) {
          if (this.state[x][y] === this.state[x][y + 1]) {
            return;
          }
        }
      }

      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE - 1; x++) {
          if (this.state[x][y] === this.state[x + 1][y]) {
            return;
          }
        }
      }

      this.status = Game.gameStatus.lose;
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

    this.checkLose();
  }
}

module.exports = Game;
