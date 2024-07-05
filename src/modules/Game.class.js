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
    this.field = [...initialState];
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

    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, cell] = emptyCells[this.random(emptyCells.length - 1)];

      this.field[row][cell] = this.number[this.random(9)];
      this.zeroCell--;
    }
  }

  checkField() {
    let count = 0;
    let score = 0;

    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] === 0) {
          count++;
        } else {
          score += this.field[i][j];

          if (this.field[i][j] === 2048) {
            this.gameStatus = 'win';
          }
        }
      }
    }
    this.gameScore = score;
    this.zeroCell = count;

    if (count === 0 && !this.canMove()) {
      this.gameStatus = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] === 0) {
          return true;
        }

        if (
          j < this.field[i].length - 1 &&
          this.field[i][j] === this.field[i][j + 1]
        ) {
          return true;
        }

        if (
          i < this.field.length - 1 &&
          this.field[i][j] === this.field[i + 1][j]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    const arr = [];

    for (let i = 0; i < this.field.length; i++) {
      let row = this.field[i].filter((num) => num !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.gameScore += row[j];
        }
      }

      row = row.filter((num) => num !== 0);

      while (row.length < 4) {
        row.push(0);
      }
      arr.push(row);
    }

    if (JSON.stringify(arr) !== JSON.stringify(this.field)) {
      this.field = arr;
      this.addNewCell();
    }
    this.checkField();
  }

  moveRight() {
    const arr = [];

    for (let i = 0; i < this.field.length; i++) {
      let row = this.field[i].filter((num) => num !== 0);

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          row[j - 1] = 0;
          this.gameScore += row[j];
        }
      }

      row = row.filter((num) => num !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }
      arr.push(row);
    }

    if (JSON.stringify(arr) !== JSON.stringify(this.field)) {
      this.field = arr;
      this.addNewCell();
    }
    this.checkField();
  }

  moveUp() {
    const arr = [[], [], [], []];

    for (let i = 0; i < this.field.length; i++) {
      let column = [
        this.field[0][i],
        this.field[1][i],
        this.field[2][i],
        this.field[3][i],
      ];

      column = column.filter((num) => num !== 0);

      for (let j = 0; j < column.length - 1; j++) {
        if (column[j] === column[j + 1]) {
          column[j] *= 2;
          column[j + 1] = 0;
          this.gameScore += column[j];
        }
      }

      column = column.filter((num) => num !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let j = 0; j < this.field.length; j++) {
        arr[j][i] = column[j];
      }
    }

    if (JSON.stringify(arr) !== JSON.stringify(this.field)) {
      this.field = arr;
      this.addNewCell();
    }
    this.checkField();
  }
  moveDown() {
    const arr = [[], [], [], []];

    for (let i = 0; i < this.field.length; i++) {
      let column = [
        this.field[0][i],
        this.field[1][i],
        this.field[2][i],
        this.field[3][i],
      ];

      column = column.filter((num) => num !== 0);

      for (let j = column.length - 1; j > 0; j--) {
        if (column[j] === column[j - 1]) {
          column[j] *= 2;
          column[j - 1] = 0;
          this.gameScore += column[j];
        }
      }

      column = column.filter((num) => num !== 0);

      while (column.length < 4) {
        column.unshift(0);
      }

      for (let j = 0; j < this.field.length; j++) {
        arr[j][i] = column[j];
      }
    }

    if (JSON.stringify(arr) !== JSON.stringify(this.field)) {
      this.field = arr;
      this.addNewCell();
    }
    this.checkField();
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
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.gameStatus = 'playing';

    this.addNewCell();
    this.addNewCell();
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
    this.gameScore = 0;
    this.zeroCell = 16;
  }

  // Add your own methods here
}

module.exports = Game;
