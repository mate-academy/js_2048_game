'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static WIN_NUMBER = 2048;
  static STATUS_PLAYING = 'playing';
  static STATUS_IDLE = 'idle';
  static STATUS_LOSE = 'lose';
  static STATUS_WIN = 'win';
  static DEFAULT_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

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
  constructor(initialState = Game.DEFAULT_STATE) {
    this.initialState = initialState;
    this.state = this.deepCloneArray(this.initialState);
    this.setStatus();
    this.setScore();
  }

  moveLeft(checkMoves = false) {
    if (this.getStatus() !== Game.STATUS_PLAYING) {
      return;
    }

    const result = this.deepCloneArray(Game.DEFAULT_STATE);

    for (let row = 0; row < this.state.length; row++) {
      const rowValues = [];

      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] !== 0) {
          rowValues.push(this.state[row][col]);
        }
      }

      const combinedValues = [];

      while (rowValues.length > 0) {
        const value = rowValues.shift();

        if (rowValues.length > 0 && value === rowValues[0]) {
          const combinedValue = value * 2;

          if (!checkMoves) {
            this.setScore(this.getScore() + combinedValue);
          }

          combinedValues.push(combinedValue);
          rowValues.shift();
        } else {
          combinedValues.push(value);
        }
      }

      let column = 0;

      while (combinedValues.length > 0) {
        result[row][column] = combinedValues.shift();
        column++;
      }
    }

    if (!this.compareArrays(this.state, result)) {
      if (checkMoves) {
        return true;
      }

      this.state = result;
      this.checkForWin();
      this.populateEmptyCell();
    }

    if (checkMoves) {
      return false;
    }

    if (!this.hasOtherMoves() && this.getStatus() !== Game.STATUS_WIN) {
      this.gameOver();
    }
  }

  moveRight(checkMoves = false) {
    if (this.getStatus() !== Game.STATUS_PLAYING) {
      return;
    }

    const result = this.deepCloneArray(Game.DEFAULT_STATE);

    for (let row = 0; row < this.state.length; row++) {
      const rowValues = [];

      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] !== 0) {
          rowValues.push(this.state[row][col]);
        }
      }

      const combinedValues = [];

      while (rowValues.length > 0) {
        const value = rowValues.pop();

        if (rowValues.length > 0 && value === rowValues[rowValues.length - 1]) {
          const combinedValue = value * 2;

          if (!checkMoves) {
            this.setScore(this.getScore() + combinedValue);
          }

          combinedValues.push(combinedValue);
          rowValues.pop();
        } else {
          combinedValues.push(value);
        }
      }

      let column = this.state[row].length - 1;

      while (combinedValues.length > 0) {
        result[row][column] = combinedValues.shift();
        column--;
      }
    }

    if (!this.compareArrays(this.state, result)) {
      if (checkMoves) {
        return true;
      }

      this.state = result;
      this.checkForWin();
      this.populateEmptyCell();
    }

    if (checkMoves) {
      return false;
    }

    if (!this.hasOtherMoves() && this.getStatus() !== Game.STATUS_WIN) {
      this.gameOver();
    }
  }

  moveUp(checkMoves = false) {
    if (this.getStatus() !== Game.STATUS_PLAYING) {
      return;
    }

    const result = this.deepCloneArray(Game.DEFAULT_STATE);

    for (let col = 0; col < this.state.length; col++) {
      const columnValues = [];

      // eslint-disable-next-line no-shadow
      for (let row = 0; row < this.state[col].length; row++) {
        if (this.state[row][col] !== 0) {
          columnValues.push(this.state[row][col]);
        }
      }

      const combinedValues = [];

      while (columnValues.length > 0) {
        const value = columnValues.shift();

        if (columnValues.length > 0 && value === columnValues[0]) {
          const combinedValue = value * 2;

          if (!checkMoves) {
            this.setScore(this.getScore() + combinedValue);
          }

          combinedValues.push(combinedValue);
          columnValues.shift();
        } else {
          combinedValues.push(value);
        }
      }

      let row = 0;

      while (combinedValues.length > 0) {
        result[row][col] = combinedValues.shift();
        row++;
      }
    }

    if (!this.compareArrays(this.state, result)) {
      if (checkMoves) {
        return true;
      }

      this.state = result;
      this.checkForWin();
      this.populateEmptyCell();
    }

    if (checkMoves) {
      return false;
    }

    if (!this.hasOtherMoves() && this.getStatus() !== Game.STATUS_WIN) {
      this.gameOver();
    }
  }

  moveDown(checkMoves = false) {
    if (this.getStatus() !== Game.STATUS_PLAYING) {
      return;
    }

    const result = this.deepCloneArray(Game.DEFAULT_STATE);

    for (let col = 0; col < this.state.length; col++) {
      const columnValues = [];

      // eslint-disable-next-line no-shadow
      for (let row = 0; row < this.state[col].length; row++) {
        if (this.state[row][col] !== 0) {
          columnValues.push(this.state[row][col]);
        }
      }

      const combinedValues = [];

      while (columnValues.length > 0) {
        const value = columnValues.pop();

        if (
          columnValues.length > 0 &&
          value === columnValues[columnValues.length - 1]
        ) {
          const combinedValue = value * 2;

          if (!checkMoves) {
            this.setScore(this.getScore() + combinedValue);
          }

          combinedValues.push(combinedValue);
          columnValues.pop();
        } else {
          combinedValues.push(value);
        }
      }

      let row = this.state.length - 1;

      while (combinedValues.length > 0) {
        result[row][col] = combinedValues.shift();
        row--;
      }
    }

    if (!this.compareArrays(this.state, result)) {
      if (checkMoves) {
        return true;
      }

      this.state = result;
      this.checkForWin();
      this.populateEmptyCell();
    }

    if (checkMoves) {
      return false;
    }

    if (!this.hasOtherMoves() && this.getStatus() !== Game.STATUS_WIN) {
      this.gameOver();
    }
  }

  /**
   * Get current game score.
   *
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * Set current game score.
   *
   * @param score
   */
  setScore(score = 0) {
    this.score = score;
  }

  /**
   * Get current game state.
   *
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

  /**
   * Set current game state.
   */
  setState(newState = Game.DEFAULT_STATE) {
    this.state = newState;
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
   * Setter for the game status.
   *
   * @param gameStatus
   */
  setStatus(gameStatus = Game.STATUS_IDLE) {
    this.status = gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.setStatus(Game.STATUS_PLAYING);
    this.setScore();
    this.populateEmptyCells();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.setScore();
    this.setStatus();
    this.state = this.deepCloneArray(this.initialState);

    if (this.compareArrays(this.initialState, Game.DEFAULT_STATE)) {
      this.populateEmptyCells();
    }
  }

  /**
   * Check if newly populated number should be 4 with 10% chance.
   *
   * @returns {boolean}
   */
  isFour() {
    return Math.random() < 0.1;
  }

  /**
   * Creates a new number for empty cell.
   *
   * @returns {number}
   */
  getNewEmptyCellNumber() {
    return this.isFour() ? 4 : 2;
  }

  /**
   * Get an array of empty cells.
   *
   * @returns {*[]}
   */
  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  /**
   * Populate single empty cell.
   */
  populateEmptyCell() {
    const emptyCells = this.getEmptyCells();
    const randomEmptyCell = Math.floor(Math.random() * emptyCells.length);
    const row = emptyCells[randomEmptyCell][0];
    const column = emptyCells[randomEmptyCell][1];

    this.state[row][column] = this.getNewEmptyCellNumber();
  }

  /**
   * Populate two empty cells.
   */
  populateEmptyCells() {
    for (let i = 1; i <= 2; i++) {
      this.populateEmptyCell();
    }
  }

  /**
   * Check if both arrays have the same values.
   *
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
  compareArrays(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr1[i].length; j++) {
        if (typeof arr2[i][j] !== 'undefined' && arr1[i][j] === arr2[i][j]) {
          continue;
        }

        return false;
      }
    }

    return true;
  }

  /**
   * Check if there are other possible moves.
   *
   * @returns {boolean}
   */
  hasOtherMoves() {
    return (
      this.moveDown(true) ||
      this.moveUp(true) ||
      this.moveLeft(true) ||
      this.moveRight(true)
    );
  }

  /**
   * The game over.
   */
  gameOver() {
    this.setStatus(Game.STATUS_LOSE);
  }

  /**
   * The game won.
   */
  gameWon() {
    this.setStatus(Game.STATUS_WIN);
  }

  /**
   * Check if any cell on the field has reached the win number.
   */
  checkForWin() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === Game.WIN_NUMBER) {
          this.gameWon();
          break;
        }
      }
    }
  }

  /**
   * Deep clone milty-dimensional array to prevent original array changes.
   *
   * @param array
   * @returns {*}
   */
  deepCloneArray(array) {
    return array.map((item) => item.slice());
  }
}

module.exports = Game;
