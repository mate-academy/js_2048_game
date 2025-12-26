/* eslint-disable function-paren-newline */
'use strict';

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
  constructor(initialState) {
    this.size = 4;

    this.score = 0;
    this.status = 'idle';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  getRandomNumber(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  startNumbers() {
    const randomValue = Math.random() < 0.9 ? 2 : 4;

    this.board[this.getRandomNumber(0, 4)][this.getRandomNumber(0, 4)] =
      randomValue;
    this.board[this.getRandomNumber(0, 4)][this.getRandomNumber(0, 4)] = 2;
  }

  addNumbers(array) {
    const empty = [];

    for (let rowAdd = 0; rowAdd < 4; rowAdd++) {
      for (let colAdd = 0; colAdd < 4; colAdd++) {
        if (array[rowAdd][colAdd] === 0) {
          empty.push([rowAdd, colAdd]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[this.getRandomNumber(0, empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    array[row][col] = value;
  }

  moveLeft(array) {
    const resArr = [];
    let score = 0;

    for (const arr of array) {
      const filtered = arr.filter((num) => num !== 0);

      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] += filtered[j + 1];
          score += filtered[j];
          filtered.splice(j + 1, 1);
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      resArr.push(filtered);
    }

    this.score += score;
    this.board = resArr;

    return resArr;
  }
  moveRight(array) {
    const resArr = [];
    let score = 0;

    for (const arr of array) {
      const filtered = arr.filter((num) => num !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] = filtered[i] + filtered[i + 1];
          score += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }

      while (filtered.length < 4) {
        filtered.unshift(0);
      }

      resArr.push(filtered);
    }

    this.score += score;
    this.board = resArr;

    return resArr;
  }
  moveUp(array) {
    const resArr = Array.from({ length: 4 }, () => Array(4).fill(0));
    let score = 0;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(array[row][col]);
      }

      const filtered = column.filter((num) => num !== 0);

      for (let q = 0; q < filtered.length; q++) {
        if (filtered[q] === filtered[q + 1]) {
          filtered[q] += filtered[q + 1];
          score += filtered[q];
          filtered.splice(q + 1, 1);
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      for (let row = 0; row < 4; row++) {
        resArr[row][col] = filtered[row];
      }
    }

    this.score += score;
    this.board = resArr;

    return resArr;
  }

  moveDown(array) {
    const resArr = Array.from({ length: 4 }, () => Array(4).fill(0));

    let score = 0;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(array[row][col]);
      }

      const filtered = column.filter((num) => num !== 0);

      for (let q = 0; q < filtered.length; q++) {
        if (filtered[q] === filtered[q + 1]) {
          filtered[q] += filtered[q + 1];
          score += filtered[q];
          filtered.splice(q + 1, 1);
        }
      }

      while (filtered.length < 4) {
        filtered.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        resArr[row][col] = filtered[row];
      }
    }
    this.score += score;
    this.board = resArr;

    return resArr;
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
    return this.board.map((row) => [...row]);
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
  hasWon(array) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (array[row][col] === 2048) {
          return true;
        }
      }
    }
  }

  hasOtherMoves(array) {
    const everyNumIsNull = array.every((row) =>
      row.every((cell) => cell !== 0),
    );

    if (!everyNumIsNull) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (array[row][col] === array[row][col + 1]) {
          return true;
        }
      }
    }

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 3; i++) {
        if (array[i][j] === array[i + 1][j]) {
          return true;
        }
      }
    }

    // console.log('no moves');

    return false;
  }

  getStatus() {
    if (this.hasOtherMoves(this.board) === false) {
      this.status = 'lose';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */

  restart() {
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
  }
}

module.exports = Game;
