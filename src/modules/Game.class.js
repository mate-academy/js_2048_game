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

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]]) {
    this.initialState = initialState;
    this.resultOfMowes = [];

    // console.log(initialState);
  }

  moveLeft() {
    for (let i = 0; i < this.initialState.length; i++) {
      const row = this.initialState[i];
      const newRow = [];

      for (let j = 0; j < row.length - 1; j++) {
        let nextIndex = j + 1;

        if (row[j] !== 0) {
          while (nextIndex < row.length && row[nextIndex] === 0) {
            nextIndex++;
          }

          if (nextIndex < row.length && row[nextIndex] === row[j]) {
            row[j] += row[nextIndex];
            row[nextIndex] = 0;
          } else if (row[nextIndex] !== row[j] && row[j] !== 0) {
            console.log('error');
          }
        }
      }

      for (let j = 0; j < row.length; j++) {
        if (row[j] !== 0) {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }
      this.initialState[i] = newRow;
    }
    this.addNumberAfterStep();
  }

  moveRight() {
    for (let i = 0; i < this.initialState.length; i++) {
      const row = this.initialState[i];

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] !== 0) {
          let nextIndex = j + 1;

          while (nextIndex < row.length && row[nextIndex] === 0) {
            nextIndex++;
          }

          if (nextIndex < row.length && row[nextIndex] === row[j]) {
            row[j] += row[nextIndex];
            row[nextIndex] = 0;
          }
        }
      }

      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        if (row[j] !== 0) {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < row.length) {
        newRow.unshift(0);
      }
      this.initialState[i] = newRow;
    }
    this.addNumberAfterStep();
  }

  moveUp() {
    this.initialState.map((_, i) => {
      const col = this.initialState.map(c => c[i]);

      for (let j = 0; j < col.length - 1; j++) {
        if (col[j] !== 0) {
          let nextIndex = j + 1;

          while (nextIndex < col.length && col[nextIndex] === 0) {
            nextIndex++;
          }

          if (nextIndex < col.length && col[nextIndex] === col[j]) {
            col[j] += col[nextIndex];
            col[nextIndex] = 0;
          }
        }
      }

      const newColumn = [];

      for (let j = 0; j < col.length; j++) {
        if (col[j] !== 0) {
          newColumn.push(col[j]);
        }
      }

      while (newColumn.length < col.length) {
        newColumn.push(0);
      }

      for (let j = 0; j < this.initialState.length; j++) {
        this.initialState[j][i] = newColumn[j];
      }
    });
    this.addNumberAfterStep();
  }

  moveDown() {
    this.initialState.map((_, i) => {
      const col = this.initialState.map(c => c[i]);

      for (let j = 0; j < col.length - 1; j++) {
        if (col[j] !== 0) {
          let nextIndex = j + 1;

          while (nextIndex < col.length && col[nextIndex] === 0) {
            nextIndex++;
          }

          if (nextIndex < col.length && col[nextIndex] === col[j]) {
            col[j] += col[nextIndex];
            col[nextIndex] = 0;
          }
        }
      }

      const newColumn = [];

      for (let j = 0; j < col.length; j++) {
        if (col[j] !== 0) {
          newColumn.push(col[j]);
        }
      }

      while (newColumn.length < col.length) {
        newColumn.unshift(0);
      }

      for (let j = 0; j < this.initialState.length; j++) {
        this.initialState[j][i] = newColumn[j];
      }
    });
    this.addNumberAfterStep();
  }

  /**
   * @returns {number}
   */
  getScore() { }

  /**
   * @returns {number[][]}
   */
  getIndexes() {
    const emptyFields = [];

    this.initialState.map((row, i) => {
      row.map((col, j) => {
        if (col === 0) {
          emptyFields.push([i, j]);
        }
      });
    });

    const randomEnptyValues = Math.floor(Math.random() * emptyFields.length);

    return emptyFields[randomEnptyValues];
  }

  getNumber() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  renderFields(maxNumbers) {
    const indexes = [];

    while (indexes.length < maxNumbers) {
      const index = [this.getIndexes()[0], this.getIndexes()[1]];

      if (this.initialState[index[0]][index[1]] !== 0) {
        break;
      }

      indexes.push(index);
    }

    for (const [row, col] of indexes) {
      this.initialState[row][col] = this.getNumber();
    }
  }

  getState() {
    this.renderFields(2);
  }

  addNumberAfterStep() {
    this.renderFields(1);
    console.log(this.resultOfMowes);
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
  getStatus() { }

  /**
   * Starts the game.
   */

  start() {
    this.getState();

    console.log(this.initialState);
  }
  /**
   * Resets the game.
   */
  restart() { }

  // Add your own methods here
}
module.exports = Game;
