'use strict';

import { transpose, foldNumbers } from './utils';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState = []) {
    const defaultField = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));

    this.field = initialState.length ? initialState : defaultField;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const oldFieldString = JSON.stringify(this.field);
    let gainedScore = 0;

    const newField = this.field.map((row) => {
      const result = foldNumbers(row);

      gainedScore += result.score;

      return result.line;
    });

    if (oldFieldString === JSON.stringify(newField)) {
      return false;
    }

    this.field = newField;
    this.score += gainedScore;

    return true;
  }
  moveRight() {
    const oldFieldString = JSON.stringify(this.field);
    let gainedScore = 0;

    const newField = this.field.map((row) => {
      const reversed = [...row].reverse();
      const result = foldNumbers(reversed);

      gainedScore += result.score;

      return result.line.reverse();
    });

    if (oldFieldString === JSON.stringify(newField)) {
      return false;
    }

    this.field = newField;
    this.score += gainedScore;

    return true;
  }
  moveUp() {
    const oldFieldString = JSON.stringify(this.field);
    let gainedScore = 0;

    const transposed = transpose(this.field);
    const shifted = transposed.map((col) => {
      const result = foldNumbers(col);

      gainedScore += result.score;

      return result.line;
    });

    const newField = transpose(shifted);

    if (oldFieldString === JSON.stringify(newField)) {
      return false;
    }

    this.field = newField;
    this.score += gainedScore;

    return true;
  }
  moveDown() {
    const oldFieldString = JSON.stringify(this.field);
    let gainedScore = 0;

    const transposed = transpose(this.field);
    const shifted = transposed.map((col) => {
      const reversed = [...col].reverse();
      const result = foldNumbers(reversed);

      gainedScore += result.score;

      return result.line.reverse();
    });

    const newField = transpose(shifted);

    if (oldFieldString === JSON.stringify(newField)) {
      return false;
    }

    this.field = newField;
    this.score += gainedScore;

    return true;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.field.map((row) => [...row]);
  }

  /**
   * Повертає поточний статус гри.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - гра ще не почалася (початковий стан);
   * `playing` - гра триває;
   * `win` - гра виграна;
   * `lose` - гра програна
   */
  getStatus() {
    return this.status;
  }

  isGameOver() {
    const rows = this.field.length;
    const cols = this.field[0].length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.field[r][c] === 0) {
          return false;
        }
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const current = this.field[r][c];

        if (c < cols - 1 && current === this.field[r][c + 1]) {
          return false;
        }

        if (r < rows - 1 && current === this.field[r + 1][c]) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  checkWin() {
    const rows = this.field.length;
    const cols = this.field[0].length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.field[r][c] >= 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.score = 0;

    this.field = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));

    this.addRandomTile();
    this.addRandomTile();

    this.render();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;

    this.field = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));

    this.render();
  }

  render() {
    const rowElements = document.querySelectorAll('.field-row');

    for (let row = 0; row < this.field.length; row++) {
      const cellElements = rowElements[row].children;

      for (let col = 0; col < this.field[row].length; col++) {
        const cellElement = cellElements[col];

        if (cellElement) {
          const value = this.field[row][col];

          cellElement.textContent = value !== 0 ? value : '';

          cellElement.className = 'field-cell';

          if (value !== 0) {
            cellElement.classList.add(`field-cell--${value}`);
          }
        }
      }
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          emptyCells.push({ r: row, c: col });
        }
      }
    }

    // eslint-disable-next-line curly
    if (emptyCells.length === 0) return;

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.field[r][c] = Math.random() < 0.1 ? 4 : 2;
  }
}

module.exports = Game;
