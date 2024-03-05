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

  copyState(state) {
    return JSON.parse(JSON.stringify(state));
  }

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
    this.state = this.copyState(initialState);
  }
  // Function for check if any rows or columns were changed
  toComapare(comparingArr, toCompare) {
    if (comparingArr.length !== toCompare.length) {
      return false;
    }

    return comparingArr.every((val, index) => {
      if (Array.isArray(val) && Array.isArray(toCompare[index])) {
        if (this.toComapare(val, toCompare[index])) {
          return true;
        };
      } else if (val === toCompare[index]) {
        return true;
      }

      return false;
    });
  }

  // Function for check if 2048 is present
  setWinGame(cell) {
    if (cell === 2048) {
      this.gameStatus = 'win';
      this.getStatus();
    }
  }

  isGameLoseVertical() {
    for (let i = 0; i < this.state.length; i++) {
      const col = this.state.map(row => row[i]);

      for (let j = 0; j < col.length - 1; j++) {
        if (col[j] === 0 || col[j] === col[j + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  isGameLoseHorizontal() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length - 1; j++) {
        const row = this.state[i];

        if (row[j] === 0 || row[j] === row[j + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  // Function for horizontal moves cell
  horizontalMoves(direction) {
    if (this.getStatus() === 'idle') {
      return;
    }

    const toCompare = this.copyState(this.state);

    this.state.map((row, i) => {
      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        let nextIndex = j + 1;

        if (row[j] === 0) {
          nextIndex++;
          continue;
        }

        if (row[j] !== 0) {
          if (nextIndex < row.length && row[j] === row[nextIndex]) {
            row[j] += row[nextIndex];
            this.gameScore += row[j];
            row[nextIndex] = 0;
          }
          newRow.push(row[j]);
        }
      }

      while (newRow.length < row.length) {
        direction === 'left' ? newRow.push(0) : newRow.unshift(0);
      }
      this.state[i] = newRow;
    });

    console.log(this.getScore());

    if (!this.toComapare(toCompare, this.state)) {
      this.addNumberAfterStep();
    }

    if (this.isGameLoseVertical() && this.isGameLoseHorizontal()) {
      this.gameStatus = 'lose';
      this.getStatus();
    }
  }

  // Function for vertical moves cell
  verticalMoves(direction) {
    if (this.getStatus() === 'idle') {
      return;
    }

    const toCompare = this.copyState(this.state);
    let col = [];

    this.state.map((_, i) => {
      col = this.state.map(c => c[i]);

      const newColumn = [];

      for (let j = 0; j < col.length; j++) {
        let nextIndex = j + 1;

        if (col[j] === 0) {
          nextIndex++;
          continue;
        }

        if (col[j] !== 0) {
          if (nextIndex < col.length && col[j] === col[nextIndex]) {
            col[j] += col[nextIndex];
            this.gameScore += col[j];
            col[nextIndex] = 0;
          }
          newColumn.push(col[j]);
        }
      }

      while (newColumn.length < col.length) {
        direction === 'up' ? newColumn.push(0) : newColumn.unshift(0);
      }

      for (let k = 0; k < this.state.length; k++) {
        this.state[k][i] = newColumn[k];
      }
    });

    if (!this.toComapare(toCompare, this.state)) {
      this.addNumberAfterStep();
    }

    if (this.isGameLoseVertical() && this.isGameLoseHorizontal()) {
      this.gameStatus = 'lose';
      this.getStatus();
    }
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

  // Function search cell === 0 and fill the number if it's possible
  getIndexes() {
    const emptyFields = [];

    this.state.forEach((row, i) => {
      row.forEach((col, j) => {
        this.setWinGame(col);

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

  // Function cells with number
  renderFields(maxNumbers) {
    const indexes = [];

    while (indexes.length < maxNumbers) {
      let index = [...this.getIndexes()];
      const includesSubArray = indexes.some(arr =>
        arr.every((value, i) => value === index[i]));

      if (includesSubArray && maxNumbers === 2) {
        index = [...this.getIndexes()];
      }

      if (!index.length < 0) {
        return;
      }

      if (this.state[index[0]][index[1]] !== 0) {
        break;
      }

      indexes.push(index);
    }

    for (const [row, col] of indexes) {
      this.state[row][col] = this.getNumber();
    }
  }

  getState() {
    return this.state;
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
    this.state = this.copyState(this.initialState);
    this.gameScore = 0;
  }

  // Add your own methods here
}
module.exports = Game;
