'use strict';
/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
import { mergeAndShift } from '../utils/mergeAndShift.js';

class Game {
  static STATUS = {
    waiting: 'waiting',
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
    this.score = 0;
    this.status = Game.STATUS;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);
    let hasMoved = false;

    this.state = this.state.map((row) => {
      const { merged, mergeSum } = mergeAndShift(row);

      this.score += mergeSum;

      if (!hasMoved && row.some((val, i) => val !== merged[i])) {
        hasMoved = true;
      }

      return merged;
    });

    if (hasMoved) {
      this.addNumbers();
      this.setState();
      this.checkStatus();
    } else {
      this.state = previousState;
    }

    return hasMoved;
  }

  moveRight() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);
    let hasMoved = false;

    this.state = this.state.map((row) => {
      const { merged, mergeSum } = mergeAndShift(row);

      this.score += mergeSum;

      if (!hasMoved && row.some((val, i) => val !== merged[i])) {
        hasMoved = true;
      }

      return merged;
    });

    if (hasMoved) {
      this.addNumbers();
      this.setState();
      this.checkStatus();
    } else {
      this.state = previousState;
    }

    return hasMoved;
  }

  moveUp() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);
    let hasMoved = false;
    let totalMergeSum = 0;

    const transposed = this.transpose(this.state);

    const newState = transposed.map((col) => {
      const { merged, mergeSum } = mergeAndShift(col);

      totalMergeSum += mergeSum;

      if (!hasMoved && col.some((val, i) => val !== merged[i])) {
        hasMoved = true;
      }

      return merged;
    });

    if (hasMoved) {
      this.state = this.transpose(newState);
      this.score += totalMergeSum;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    } else {
      this.state = previousState;
    }

    return hasMoved;
  }

  moveDown() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);
    let hasMoved = false;
    let totalMergeSum = 0;

    const transposed = this.transpose(this.state);

    const newState = transposed.map((col) => {
      const { merged, mergeSum } = mergeAndShift(col, true);

      totalMergeSum += mergeSum;

      if (!hasMoved && col.some((val, i) => val !== merged[i])) {
        hasMoved = true;
      }

      return merged;
    });

    if (hasMoved) {
      this.state = this.transpose(newState);
      this.score += totalMergeSum;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    } else {
      this.state = previousState;
    }

    return hasMoved;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = Game.STATUS.playing;
    this.state = this.initialState.map((row) => [...row]);

    this.addNumbers();
    this.addNumbers();
    this.setState();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = Game.STATUS.waiting;
    this.state = this.initialState.map((row) => [...row]);

    this.setState();
  }

  getRandomCell() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  addNumbers() {
    const emptyCells = [];

    for (let rows = 0; rows < this.state.length; rows++) {
      for (let cells = 0; cells < this.state[rows].length; cells++) {
        if (this.state[rows][cells] === 0) {
          emptyCells.push({ r: rows, c: cells });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[randomIndex];

    this.state[r][c] = this.getRandomCell();
  }

  setState() {
    const cells = document.querySelectorAll('.field-cell');
    const stateValues = this.state.flat();

    if (cells.length === 0) {
      return;
    }

    for (let i = 0; i < stateValues.length; i++) {
      const currentCell = cells[i];
      const currentValue = stateValues[i];

      if (!currentCell) {
        continue;
      }

      currentCell.className = 'field-cell';

      if (currentValue > 0) {
        currentCell.textContent = currentValue;
        currentCell.classList.add(`field-cell--${currentValue}`);
      } else {
        currentCell.textContent = '';
      }
    }
  }

  checkStatus() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          this.status = Game.STATUS.win;

          return;
        }
      }
    }

    let canMerge = false;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          this.status = Game.STATUS.playing;

          return;
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length - 1; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          canMerge = true;
          break;
        }
      }

      if (canMerge) {
        break;
      }
    }

    for (let i = 0; i < this.state.length - 1; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          canMerge = true;
          break;
        }
      }

      if (canMerge) {
        break;
      }
    }

    if (!canMerge) {
      this.status = Game.STATUS.lose;
    }
  }
}

export default Game;
