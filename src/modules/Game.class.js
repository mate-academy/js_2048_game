'use strict';
import * as lodash from 'lodash';

/**
 * This class represents the this.
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
  constructor(initialState) {
    this.initialState = initialState || this.generateTable();
    this.board = initialState;
    this.status = 'idle';
    this.score = 0;
    this.cellArr = document.querySelectorAll('.field-cell');
  }

  mergeToLeft(row, merged = []) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        merged.push(row[i] * 2);
        this.score += row[i] * 2;
        i++;
      } else {
        merged.push(row[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  mergeToRight(row, merged = []) {
    for (let i = row.length - 1; i >= 0; i--) {
      if (row[i] === row[i - 1]) {
        merged.unshift(row[i] * 2);
        this.score += row[i] * 2;
        i--;
      } else {
        merged.unshift(row[i]);
      }
    }

    while (merged.length < 4) {
      merged.unshift(0);
    }

    return merged;
  }
  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let newBoard = [];

    for (let rowStart = 0; rowStart < 16; rowStart += 4) {
      const row = this.getState()
        .slice(rowStart, rowStart + 4)
        .filter((item) => item > 0);

      const merged = this.mergeToLeft(row);

      newBoard = newBoard.concat(merged);
    }

    const moved = JSON.stringify(newBoard) !== JSON.stringify(this.getState());

    this.board = newBoard;

    if (moved) {
      this.addRandom();
    }

    this.checkStatus(moved);
    this.visualizeTable();
  }
  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let newBoard = [];

    for (let rowStart = 0; rowStart < 16; rowStart += 4) {
      const row = this.getState()
        .slice(rowStart, rowStart + 4)
        .filter((item) => item > 0);

      const merged = this.mergeToRight(row);

      newBoard = newBoard.concat(merged);
    }

    const moved = JSON.stringify(newBoard) !== JSON.stringify(this.getState());

    this.board = newBoard;

    if (moved) {
      this.addRandom();
    }

    this.checkStatus(moved);
    this.visualizeTable();
  }
  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const newBoard = Array(16).fill(0);

    for (let f = 0; f < 4; f++) {
      const row = [];

      for (let i = f; i < 16; i += 4) {
        row.push(this.getState()[i]);
      }

      const merged = this.mergeToLeft(row.filter((item) => item > 0));

      for (let j = 0; j < 4; j++) {
        newBoard[f + j * 4] = merged[j];
      }
    }

    const moved = JSON.stringify(newBoard) !== JSON.stringify(this.getState());

    this.board = newBoard;

    if (moved) {
      this.addRandom();
    }
    this.checkStatus(moved);
    this.visualizeTable();
  }
  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const newBoard = Array(16).fill(0);

    for (let f = 0; f < 4; f++) {
      const row = [];

      for (let i = f; i < 16; i += 4) {
        row.push(this.getState()[i]);
      }

      const merged = this.mergeToRight(row.filter((item) => item > 0));

      for (let j = 0; j < 4; j++) {
        newBoard[f + j * 4] = merged[j];
      }
    }

    const moved = JSON.stringify(newBoard) !== JSON.stringify(this.getState());

    this.board = newBoard;

    if (moved) {
      this.addRandom();
    }

    this.checkStatus(moved);
    this.visualizeTable();
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
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the this.
   */
  start() {
    this.score = 0;
    this.board = this.initialState || this.generateTable;
    this.status = 'playing';
  }

  /**
   * Resets the this.
   */
  restart() {
    this.score = 0;
    this.board = Array(16).fill(0);
    this.status = 'idle';
  }

  generateTable() {
    const indexes = lodash.sampleSize(
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      2,
    );
    const table = Array(16).fill(0);

    for (const item of indexes) {
      table[item] = Math.random() < 0.1 ? 4 : 2;
    }

    return table;
  }

  visualizeTable() {
    this.cellArr.forEach((item, index) => {
      if (this.getState()[index] !== 0) {
        item.className = 'field-cell';
        item.classList.add(`field-cell--${this.getState()[index]}`);
        item.textContent = this.getState()[index];
      } else {
        item.textContent = '';
        item.className = 'field-cell';
      }
    });
  }

  addRandom() {
    const indexes = [];

    this.getState().forEach((item, index) => {
      if (item === 0) {
        indexes.push(index);
      }
    });

    this.board[lodash.sample(indexes)] = Math.random() < 0.1 ? 4 : 2;
  }

  checkStatus() {
    if (this.getState().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.getState().includes(0)) {
      return;
    }

    let condition = true;

    for (let i = 0; i < 16; i += 4) {
      const row = [];

      for (let n = i; n < i + 4; n++) {
        row.push(this.getState()[n]);
      }

      for (let j = 0; j < row.length; j++) {
        if (row[j] !== 0 && row[j - 1] === row[j]) {
          condition = false;
        }
      }
    }

    for (let f = 0; f < 4; f++) {
      const col = [];

      for (let i = f; i < 16; i += 4) {
        col.push(this.getState()[i]);
      }

      for (let i = 0; i < col.length; i++) {
        if (col[i] !== 0 && col[i - 1] === col[i]) {
          condition = false;
        }
      }
    }

    if (condition) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
