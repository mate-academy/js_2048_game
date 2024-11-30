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
    // eslint-disable-next-line no-console
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.gameState = this.initialState.map((row) => [...row]);
    this.gameStatus = 'idle';
    this.gameScore = 0;
    this.zeroCell = 16;
    this.number = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
  }

  random(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  addNewCell() {
    const emptyCells = [];

    for (let i = 0; i < this.gameState.length; i++) {
      for (let j = 0; j < this.gameState[i].length; j++) {
        if (this.gameState[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, cell] = emptyCells[this.random(emptyCells.length - 1)];

      this.gameState[row][cell] = this.number[this.random(9)];
      this.zeroCell--;
    }
  }

  checkinitialState() {
    let count = 0;

    for (let i = 0; i < this.gameState.length; i++) {
      for (let j = 0; j < this.gameState[i].length; j++) {
        if (this.gameState[i][j] === 0) {
          count++;
        } else {
          if (this.gameState[i][j] === 2048) {
            this.gameStatus = 'win';
          }
        }
      }
    }
    this.zeroCell = count;

    if (count === 0 && !this.canMove()) {
      this.gameStatus = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < this.gameState.length; i++) {
      for (let j = 0; j < this.gameState[i].length; j++) {
        if (this.gameState[i][j] === 0) {
          return true;
        }

        if (
          j < this.gameState[i].length - 1 &&
          this.gameState[i][j] === this.gameState[i][j + 1]
        ) {
          return true;
        }

        if (
          i < this.gameState.length - 1 &&
          this.gameState[i][j] === this.gameState[i + 1][j]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const arr = [];
    let score = 0;

    for (let i = 0; i < this.gameState.length; i++) {
      let row = this.gameState[i].filter((num) => num !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          score += row[j];
        }
      }

      row = row.filter((num) => num !== 0);

      while (row.length < 4) {
        row.push(0);
      }
      arr.push(row);
    }

    if (JSON.stringify(arr) !== JSON.stringify(this.gameState)) {
      this.gameState = arr;
      this.addNewCell();
      this.gameScore += score;
      this.checkinitialState();
    }
  }

  moveRight() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const arr = [];
    let score = 0;

    for (let i = 0; i < this.gameState.length; i++) {
      let row = this.gameState[i].filter((num) => num !== 0);

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          row[j - 1] = 0;
          score += row[j];
        }
      }

      row = row.filter((num) => num !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }
      arr.push(row);
    }

    if (JSON.stringify(arr) !== JSON.stringify(this.gameState)) {
      this.gameState = arr;
      this.addNewCell();
      this.gameScore += score;
      this.checkinitialState();
    }
  }

  moveUp() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const arr = [[], [], [], []];
    let score = 0;

    for (let i = 0; i < this.gameState.length; i++) {
      let column = [
        this.gameState[0][i],
        this.gameState[1][i],
        this.gameState[2][i],
        this.gameState[3][i],
      ];

      column = column.filter((num) => num !== 0);

      for (let j = 0; j < column.length - 1; j++) {
        if (column[j] === column[j + 1]) {
          column[j] *= 2;
          column[j + 1] = 0;
          score += column[j];
        }
      }

      column = column.filter((num) => num !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let j = 0; j < this.gameState.length; j++) {
        arr[j][i] = column[j];
      }
    }

    if (JSON.stringify(arr) !== JSON.stringify(this.gameState)) {
      this.gameState = arr;
      this.addNewCell();
      this.gameScore += score;
      this.checkinitialState();
    }
  }
  moveDown() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const arr = [[], [], [], []];
    let score = 0;

    for (let i = 0; i < this.gameState.length; i++) {
      let column = [
        this.gameState[0][i],
        this.gameState[1][i],
        this.gameState[2][i],
        this.gameState[3][i],
      ];

      column = column.filter((num) => num !== 0);

      for (let j = column.length - 1; j > 0; j--) {
        if (column[j] === column[j - 1]) {
          column[j] *= 2;
          column[j - 1] = 0;
          score += column[j];
        }
      }

      column = column.filter((num) => num !== 0);

      while (column.length < 4) {
        column.unshift(0);
      }

      for (let j = 0; j < this.gameState.length; j++) {
        arr[j][i] = column[j];
      }
    }

    if (JSON.stringify(arr) !== JSON.stringify(this.gameState)) {
      this.gameState = arr;
      this.addNewCell();
      this.gameScore += score;
      this.checkinitialState();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.gameScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.gameState;
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
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.addNewCell();
    this.addNewCell();
    this.gameStatus = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.gameState = this.initialState.map((row) => [...row]);
    this.gameStatus = 'idle';
    this.gameScore = 0;
    this.zeroCell = 16;
  }
}
module.exports = Game;
