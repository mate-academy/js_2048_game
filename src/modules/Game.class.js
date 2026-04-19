'use strict';

const INITIAL_BOARD_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const BOARD_LENGTH = 4;
const WIN_CELL_VALUE = 2048;

const getRandomFrom0To3 = () => {
  return Math.floor(Math.random() * 4);
};

const is4ShouldAdded = () => {
  return Math.random() <= 0.1;
};

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
  constructor(initialState = INITIAL_BOARD_STATE) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    // flag that indicates, if at least one cell was moved
    let flag = false;

    // moving & merging logic
    for (let i = 0; i < BOARD_LENGTH; i++) {
      // first, let's get rid of 0 in the row
      const newRow = this.state[i].filter((num) => num !== 0);

      // and after complete it by pushing 0 until it gets size 4
      while (newRow.length < BOARD_LENGTH) {
        newRow.push(0);
      }

      // now we are going to merge
      for (let k = BOARD_LENGTH - 1; k > 0; k--) {
        if (newRow[k - 1] === newRow[k] && newRow[k] !== 0) {
          newRow[k - 1] *= 2;
          this.score += newRow[k - 1];
          newRow[k] = 0;
          // only one merging for each cell in one move allowed
          k--;
        }
      }

      // finally, let's get rid of 0 in the row again
      const finalizedRow = newRow.filter((num) => num !== 0);

      while (finalizedRow.length < BOARD_LENGTH) {
        finalizedRow.push(0);
      }

      // check, if row is changed and new Cell should be added
      const rowChanged = this.state[i].some(
        (num, index) => num !== finalizedRow[index],
      );

      if (rowChanged) {
        flag = true;
      }

      // and re-write finalizedRow to Game state
      this.state[i] = [...finalizedRow];
    }

    if (flag) {
      this.addRandomCell();
    }
    this.checkStatusAfterMove();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    // flag that indicates, if at least one cell was moved
    let flag = false;

    // moving & merging logic
    for (let i = 0; i < BOARD_LENGTH; i++) {
      // first, let's get rid of 0 in the row
      const newRow = this.state[i].filter((num) => num !== 0);

      // and after complete it by unshifting 0 until it gets size 4
      while (newRow.length < BOARD_LENGTH) {
        newRow.unshift(0);
      }

      // now we are going to merge
      for (let k = 1; k < BOARD_LENGTH; k++) {
        if (newRow[k] === newRow[k - 1] && newRow[k] !== 0) {
          newRow[k] *= 2;
          this.score += newRow[k];
          newRow[k - 1] = 0;
          // only one merging for each cell in one move allowed
          k++;
        }
      }

      // finally, let's get rid of 0 in the row again
      const finalizedRow = newRow.filter((num) => num !== 0);

      while (finalizedRow.length < BOARD_LENGTH) {
        finalizedRow.unshift(0);
      }

      // check, if row is changed and new Cell should be added
      const rowChanged = this.state[i].some(
        (num, index) => num !== finalizedRow[index],
      );

      if (rowChanged) {
        flag = true;
      }

      // and re-write finalizedRow to Game state
      this.state[i] = [...finalizedRow];
    }

    if (flag) {
      this.addRandomCell();
    }
    this.checkStatusAfterMove();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    // flag that indicates, if at least one cell was moved
    let flag = false;

    // moving & merging logic
    for (let i = 0; i < BOARD_LENGTH; i++) {
      // for UP & DOWN moves, we should work with Columns, not with rows
      // THIS SOLUTION DOESN'T CONTAINS TRANSPOSING - it's just 101
      const column = [];

      for (let j = 0; j < BOARD_LENGTH; j++) {
        column.push(this.state[j][i]);
      }

      // first, let's get rid of 0 in the column
      const newColumn = column.filter((num) => num !== 0);

      // and after complete it by pushing 0 until it gets size 4
      while (newColumn.length < BOARD_LENGTH) {
        newColumn.push(0);
      }

      // now we are going to merge
      for (let k = 1; k < BOARD_LENGTH; k++) {
        if (newColumn[k] === newColumn[k - 1] && newColumn[k] !== 0) {
          newColumn[k] *= 2;
          this.score += newColumn[k];
          newColumn[k - 1] = 0;
          // only one merging for each cell in one move allowed
          k++;
        }
      }

      // finally, let's get rid of 0 in the column again
      const finalizedColumn = newColumn.filter((num) => num !== 0);

      while (finalizedColumn.length < BOARD_LENGTH) {
        finalizedColumn.push(0);
      }

      // check, if column is changed and new Cell should be added
      const columnChanged = column.some(
        (num, index) => num !== finalizedColumn[index],
      );

      if (columnChanged) {
        flag = true;
      }

      // and re-write finalizedColumn to Game state
      for (let o = 0; o < BOARD_LENGTH; o++) {
        this.state[o][i] = finalizedColumn[o];
      }
    }

    if (flag) {
      this.addRandomCell();
    }
    this.checkStatusAfterMove();
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    // flag that indicates, if at least one cell was moved
    let flag = false;

    // moving & merging logic
    for (let i = 0; i < BOARD_LENGTH; i++) {
      // for UP & DOWN moves, we should work with Columns, not with rows
      // THIS SOLUTION DOESN'T CONTAINS TRANSPOSING - it's just 101
      const column = [];

      for (let j = 0; j < BOARD_LENGTH; j++) {
        column.push(this.state[j][i]);
      }

      // first, let's get rid of 0 in the column
      const newColumn = column.filter((num) => num !== 0);

      // and after complete it by unshifting 0 until it gets size 4
      while (newColumn.length < BOARD_LENGTH) {
        newColumn.unshift(0);
      }

      // now we are going to merge
      for (let k = BOARD_LENGTH - 1; k > 0; k--) {
        if (newColumn[k] === newColumn[k - 1] && newColumn[k] !== 0) {
          newColumn[k - 1] *= 2;
          this.score += newColumn[k - 1];
          newColumn[k] = 0;
          // only one merging for each cell in one move allowed
          k--;
        }
      }

      // finally, let's get rid of 0 in the column again
      const finalizedColumn = newColumn.filter((num) => num !== 0);

      while (finalizedColumn.length < BOARD_LENGTH) {
        finalizedColumn.unshift(0);
      }

      // check, if column is changed and new Cell should be added
      const columnChanged = column.some(
        (num, index) => num !== finalizedColumn[index],
      );

      if (columnChanged) {
        flag = true;
      }

      // and re-write finalizedColumn to Game state
      for (let o = 0; o < BOARD_LENGTH; o++) {
        this.state[o][i] = finalizedColumn[o];
      }
    }

    if (flag) {
      this.addRandomCell();
    }
    this.checkStatusAfterMove();
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
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  addRandomCell() {
    let randomCellValue;
    let rowNumber;
    let colNumber;

    // if randomly taken cell is already !== 0, we'll find again
    do {
      rowNumber = getRandomFrom0To3();
      colNumber = getRandomFrom0To3();

      randomCellValue = this.state[rowNumber][colNumber];
    } while (randomCellValue !== 0);

    this.state[rowNumber][colNumber] = is4ShouldAdded() ? 4 : 2;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.score = 0;
    this.addRandomCell();
    this.addRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.state = this.initialState.map((row) => [...row]);
  }

  checkStatusAfterMove() {
    // let's start from Win position
    if (this.state.some((row) => row.includes(WIN_CELL_VALUE))) {
      this.status = 'win';

      return;
    }

    // if at least one empty cell, there is no lose
    for (const row of this.state) {
      if (row.includes(0)) {
        return;
      }
    }

    // first let's check, if there are possible moves in rows
    for (let i = 0; i < BOARD_LENGTH; i++) {
      for (let k = 0; k < BOARD_LENGTH - 1; k++) {
        if (this.state[i][k] === this.state[i][k + 1]) {
          return;
        }
      }
    }

    // then let's check columns
    for (let i = 0; i < BOARD_LENGTH; i++) {
      for (let k = 0; k < BOARD_LENGTH - 1; k++) {
        if (this.state[k][i] === this.state[k + 1][i]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  // Add your own methods here
}

module.exports = Game;
