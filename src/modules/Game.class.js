/* eslint-disable no-console */
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
  ) {
    this.board = initialState;

    this.score = 0;

    this.rows = 4;
    this.columns = 4;

    this.gameStatus = {
      idle: 'idle',
      playing: 'playing',
      win: 'win',
      lose: 'lose',
    };

    this.started = this.gameStatus.playing;

    this.status = this.gameStatus.idle;
  }

  filterRow(row) {
    return [...row].filter((el) => el !== 0);
  }

  finishRow(row) {
    const filteredRow = this.filterRow(row);

    for (let i = filteredRow.length; i < this.columns; i++) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  isEqual = () => {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const current = this.board[r][c];

        if (c < this.columns - 1) {
          if (current === this.board[r][c + 1]) {
            return true;
          }
        }

        if (r < this.rows - 1) {
          if (current === this.board[r + 1][c]) {
            return true;
          }
        }
      }
    }

    return false;
  };

  addValues(rowValues) {
    const filteredRow = this.filterRow(rowValues);

    if (filteredRow.length > 1) {
      for (let c = 0; c <= filteredRow.length - 1; c++) {
        if (filteredRow[c] === filteredRow[c + 1]) {
          const newValue = filteredRow[c] * 2;

          filteredRow[c] = newValue;
          filteredRow[c + 1] = 0;

          this.score += newValue;
          c++;
        }
      }
    }

    const finished = this.finishRow(filteredRow);

    return finished;
  }

  moveLeft() {
    for (let r = 0; r < this.rows; r++) {
      const row = [...this.board[r]];

      const newRow = this.addValues(row);

      this.board[r] = newRow;
    }
  }

  moveRight() {
    for (let r = 0; r < this.rows; r++) {
      const row = [...this.board[r]].reverse();

      const newRow = this.addValues(row).reverse();

      this.board[r] = newRow;
    }
  }

  moveUp() {
    for (let c = 0; c < this.columns; c++) {
      const column = [];

      for (let r = 0; r < this.rows; r++) {
        column.push(this.board[r][c]);
      }

      const newColumn = this.addValues(column);

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = newColumn[r];
      }
    }
  }

  moveDown() {
    for (let c = 0; c < this.columns; c++) {
      const column = [];

      for (let r = this.rows - 1; r >= 0; r--) {
        column.push(this.board[r][c]);
      }

      const newColumn = this.addValues(column).reverse();

      for (let r = this.rows - 1; r >= 0; r--) {
        this.board[r][c] = newColumn[r];
      }
    }
  }

  moveDone(initial, current) {
    const toStr = (arr) => arr.flat().join('');

    return toStr(initial) !== toStr(current);
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
    return this.board;
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
   * Starts the game.
   */
  start() {
    this.status = this.gameStatus.playing;
    this.setNum();
    this.setNum();
  }

  /**
   * Resets the game.
   */
  restart(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.status = this.gameStatus.idle;
    this.board = initialState;
    this.score = 0;
  }

  // Add your own methods here
  openBoard(currentBoard = this.board) {
    return currentBoard.flat();
  }

  getNum() {
    const probability = Math.random();

    if (probability <= 0.1) {
      return 4;
    }

    return 2;
  }

  setNum() {
    const cell = this.getCell();

    if (!cell) {
      return;
    }

    const x = cell[0];
    const y = cell[1];

    const num = this.getNum();

    this.board[x][y] = num;
  }

  getCell() {
    let x;
    let y;

    const openedBoard = this.openBoard();

    if (!openedBoard.includes(0)) {
      return null;
    }

    do {
      x = Math.floor(Math.random() * this.rows);
      y = Math.floor(Math.random() * this.columns);
    } while (!this.isEmpty(x, y));

    return [x, y];
  }

  isEmpty(x, y) {
    return this.board[x][y] === 0;
  }
}

module.exports = Game;
