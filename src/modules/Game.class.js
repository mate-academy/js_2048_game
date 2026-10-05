'use strict';

class Game {
  /**
   *
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
    if (initialState) {
      this.state = initialState;
    } else {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';
  }

  randomizer() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] === 0) {
          emptyCells.push([row, column]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, column] = emptyCells[randomIndex];

      this.state[row][column] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  hasStateChanged(previousState) {
    return this.state.some((row, rowIndex) => {
      return row.some((value, columnIndex) => {
        return value !== previousState[rowIndex][columnIndex];
      });
    });
  }

  updateStatus() {
    if (this.checkForWin() === 'win') {
      return;
    }

    this.checkForLose();
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let i = 0; i < this.state.length; i++) {
      const row = this.state[i];
      const numbers = row.filter((number) => number !== 0);
      const results = [];

      for (let v = 0; v < numbers.length; v++) {
        if (numbers[v] === numbers[v + 1]) {
          const value = numbers[v] * 2;

          results.push(value);
          this.score += value;
          v++;
        } else {
          results.push(numbers[v]);
        }
      }

      while (results.length < row.length) {
        results.push(0);
      }
      row.splice(0, 4, ...results);
    }

    if (this.hasStateChanged(previousState)) {
      this.randomizer();
    }

    this.updateStatus();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let i = 0; i < this.state.length; i++) {
      const row = this.state[i];
      const numbers = row.filter((number) => number !== 0).reverse();

      const results = [];

      for (let v = 0; v < numbers.length; v++) {
        if (numbers[v] === numbers[v + 1]) {
          const value = numbers[v] * 2;

          results.push(value);
          this.score += value;
          v++;
        } else {
          results.push(numbers[v]);
        }
      }

      while (results.length < row.length) {
        results.push(0);
      }
      results.reverse();
      row.splice(0, 4, ...results);
    }

    if (this.hasStateChanged(previousState)) {
      this.randomizer();
    }

    this.updateStatus();
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let column = 0; column < this.state[0].length; column++) {
      const columnValue = [];

      for (let row = 0; row < this.state.length; row++) {
        columnValue.push(this.state[row][column]);
      }

      const numbers = columnValue.filter((number) => number !== 0).reverse();
      const results = [];

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] === numbers[i + 1]) {
          const value = numbers[i] * 2;

          results.push(value);
          this.score += value;
          i++;
        } else {
          results.push(numbers[i]);
        }
      }

      while (results.length < this.state.length) {
        results.push(0);
      }
      results.reverse();

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][column] = results[row];
      }
    }

    if (this.hasStateChanged(previousState)) {
      this.randomizer();
    }

    this.updateStatus();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let column = 0; column < this.state[0].length; column++) {
      const columnValue = [];

      for (let row = 0; row < this.state.length; row++) {
        columnValue.push(this.state[row][column]);
      }

      const numbers = columnValue.filter((number) => number !== 0);
      const results = [];

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] === numbers[i + 1]) {
          const value = numbers[i] * 2;

          results.push(value);
          this.score += value;
          i++;
        } else {
          results.push(numbers[i]);
        }
      }

      while (results.length < this.state.length) {
        results.push(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][column] = results[row];
      }
    }

    if (this.hasStateChanged(previousState)) {
      this.randomizer();
    }

    this.updateStatus();
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
    return this.state;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * idle - the game has not started yet (the initial state);
   * playing - the game is in progress;
   * win - the game is won;
   * lose - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.randomizer();
    this.randomizer();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  checkForWin() {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] >= 2048) {
          this.status = 'win';

          return 'win';
        }
      }
    }
  }

  checkForLose() {
    if (this.status === 'win') {
      return;
    }

    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        const value = this.state[row][column];

        if (value === 0) {
          return;
        }

        if (
          column < this.state[row].length - 1 &&
          value === this.state[row][column + 1]
        ) {
          return;
        }

        if (
          row < this.state.length - 1 &&
          value === this.state[row + 1][column]
        ) {
          return;
        }
      }
    }
    this.status = 'lose';

    return 'lose';
  }
}
module.exports = Game;
