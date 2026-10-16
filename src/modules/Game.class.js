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
    console.log(initialState);

    this.field = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    for (let i = 0; i < this.field.length; i++) {
      const row = this.field[i];

      let newRow = row.filter((cell) => cell !== 0);

      newRow = this.mergeNumbers(newRow);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.field[i] = newRow;
    }

    this.placeRandomNumber();
  }

  moveRight() {
    for (let i = 0; i < this.field.length; i++) {
      const row = this.field[i];

      let newRow = row.filter((cell) => cell !== 0);

      newRow = this.mergeNumbers(newRow);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      this.field[i] = newRow;
    }
    this.placeRandomNumber();
  }

  moveUp() {
    const arr = this.transposeArray(this.field);

    for (let i = 0; i < arr.length; i++) {
      const row = arr[i];

      let newRow = row.filter((cell) => cell !== 0);

      newRow = this.mergeNumbers(newRow);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      arr[i] = newRow;
    }

    this.field = this.transposeArray(arr);
    this.placeRandomNumber();
  }

  moveDown() {
    const arr = this.transposeArray(this.field);

    for (let i = 0; i < arr.length; i++) {
      const row = arr[i];

      let newRow = row.filter((cell) => cell !== 0);

      newRow = this.mergeNumbers(newRow);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      arr[i] = newRow;
    }

    this.field = this.transposeArray(arr);
    this.placeRandomNumber();
  }

  /**
   * @returns {number}
   */
  getScore() {

    this.score = 0;

    this.field.forEach((row) => row.forEach((x) => (this.score += x)));

    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.field;
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
    if (this.getEmptyCells().length === 0 && this.noValidMove()) {
      this.status = 'lose';
    }

    if (this.field.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    const x1 = this.getRandomInt(0, 3);
    const y1 = this.getRandomInt(0, 3);

    let x2 = this.getRandomInt(0, 3);
    let y2 = this.getRandomInt(0, 3);

    while (x1 === x2 && y1 === y2) {
      x2 = this.getRandomInt(0, 3);
      y2 = this.getRandomInt(0, 3);
    }

    this.field[x1][y1] = 2;
    this.field[x2][y2] = 2;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.start();
  }

  // Add your own methods here

  checkIsRowEmpty(row) {
    return row.includes('0');
  }

  checkIsColEmpty(col) {
    return col.includes('0');
  }

  transposeArray(arr) {
    const transpose = arr[0].map((col, i) => arr.map((row) => row[i]));

    return transpose;
  }

  mergeNumbers(row) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row.splice(i + 1, 1);
        i++;
      }
    }

    return row;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  placeRandomNumber() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return; // No empty cells, can't place
    }

    const randomCell = this.getRandomInt(0, emptyCells.length);

    const possibilities = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

    const randomNumber = this.getRandomInt(0, possibilities.length);

    const { row, col } = emptyCells[randomCell];

    this.field[row][col] = possibilities[randomNumber];
  }

  getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  noValidMove() {

    for (let row of this.field) {
      if (row.includes(0)) {
        return false;
      }
    }

    for (let row of this.field) {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    const arr = this.transposeArray(this.field);
    for (let row of arr) {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    return true;

  }

}

export { Game };
