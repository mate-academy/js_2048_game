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
      [0, 0, 0, 0],
    ],
    gameStatus = 'idle',
    gameScore = 0) {
    this.initialState = initialState;
    this.gameStatus = gameStatus;
    this.gameScore = gameScore;
    this.copyState = [...initialState];
  }

  toComapare(comparingArr, toCompare) {
    if (comparingArr.length !== toCompare.length) {
      return false;
    }

    return comparingArr.every((val, index) => {
      if (Array.isArray(val) && Array.isArray(toCompare[index])) {
        if (!this.toComapare(val, toCompare[index])) {
          return false;
        };
      } else if (val !== toCompare[index]) {
        return false;
      }

      return true;
    });
  }

  horizontalMoves(direction) {
    const toCompare = [...this.copyState];

    for (let i = 0; i < this.copyState.length; i++) {
      const row = this.copyState[i];
      const newRow = [];

      for (let j = 0; j < row.length - 1; j++) {
        let nextIndex = j + 1;

        if (row[j] !== 0) {
          while (nextIndex < row.length && row[nextIndex] === 0) {
            nextIndex++;
          }

          if (nextIndex < row.length && row[nextIndex] === row[j]) {
            row[j] += row[nextIndex];
            this.gameScore += row[j];
            row[nextIndex] = 0;
          }
        }
      }

      for (let j = 0; j < row.length; j++) {
        if (row[j] !== 0) {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < row.length) {
        direction === 'left' ? newRow.push(0) : newRow.unshift(0);
      }
      this.copyState[i] = newRow;
    }

    if (!this.toComapare(toCompare, this.copyState)) {
      this.addNumberAfterStep();
    }

    return this.copyState;
  }

  verticalMoves(direction) {
    const toCompare = [...this.copyState];

    this.copyState.map((_, i) => {
      const col = this.copyState.map(c => c[i]);

      for (let j = 0; j < col.length - 1; j++) {
        if (col[j] !== 0) {
          let nextIndex = j + 1;

          while (nextIndex < col.length && col[nextIndex] === 0) {
            nextIndex++;
          }

          if (nextIndex < col.length && col[nextIndex] === col[j]) {
            col[j] += col[nextIndex];
            this.gameScore += col[j];
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
        direction === 'up' ? newColumn.push(0) : newColumn.unshift(0);
      }

      for (let j = 0; j < this.copyState.length; j++) {
        this.copyState[j][i] = newColumn[j];
      }
    });

    if (!this.toComapare(toCompare, this.copyState)) {
      this.addNumberAfterStep();
    }

    return this.copyState;
  }

  moveLeft() {
    this.horizontalMoves('left');
  }

  moveRight() {
    this.horizontalMoves('right');
  }

  moveUp() {
    this.verticalMoves('up');
  }

  moveDown() {
    this.verticalMoves('down');
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
  getIndexes() {
    const emptyFields = [];

    this.copyState.map((row, i) => {
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

    if (!this.getIndexes()) {
      return;
    }

    while (indexes.length < maxNumbers) {
      const index = [this.getIndexes()[0], this.getIndexes()[1]];

      if (this.copyState[index[0]][index[1]] !== 0) {
        break;
      }

      indexes.push(index);
    }

    for (const [row, col] of indexes) {
      this.copyState[row][col] = this.getNumber();
    }
  }

  getState() {
    return this.initialState;
  }

  addNumberAfterStep() {
    this.renderFields(1);
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
    this.renderFields(2);
    this.gameStatus = 'playing';
    this.getStatus();
  }
  /**
   * Resets the game.
   */
  restart() {
    this.gameStatus = 'idle';
    this.getStatus();
    this.gameScore = 0;
  }

  // Add your own methods here
}
module.exports = Game;
