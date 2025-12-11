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

  deepCopy(arr) {
    return arr.map((row) => row.slice());
  }

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    const EMPTY_BOARD = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = initialState
      ? this.deepCopy(initialState)
      : this.deepCopy(EMPTY_BOARD);

    this.initialBoardState = this.deepCopy(this.board);
    this.score = 0;
    this.status = 'idle';
    this.rows = 4;
    this.columns = 4;

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  setNumber() {
    let isEmpty = false;
    const chance = Math.random();
    let randomNumber;

    if (chance < 0.1) {
      randomNumber = 4;
    } else {
      randomNumber = 2;
    }

    while (!isEmpty) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.columns);

      if (this.board[r][c] === 0) {
        this.board[r][c] = randomNumber;
        isEmpty = true;
      }
    }
  }

  slide(row) {
    const newRow = row.filter((item) => item !== 0);
    const result = [];

    for (let r = 0; r < newRow.length; r++) {
      if (newRow[r] === newRow[r + 1]) {
        result.push(newRow[r] * 2);
        this.score += newRow[r] * 2;
        r++;
      } else {
        result.push(newRow[r]);
      }
    }

    return result;
  }

  isWin() {
    return JSON.stringify(this.board).includes(2048);
  }

  canMove() {
    let move = false;
    let hasEmpty = false;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns - 1; c++) {
        if (!this.board[r][c]) {
          hasEmpty = true;
        }

        if (this.board[r][c] === this.board[r][c + 1]) {
          move = true;
        }
      }
    }

    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows - 1; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          move = true;
        }
      }
    }

    if (move) {
      return true;
    }

    if (hasEmpty) {
      return true;
    }

    return false;
  }

  processRow(row, isReversed) {
    if (isReversed) {
      row.reverse();
    }

    const newRow = this.slide(row);

    while (newRow.length < this.columns) {
      newRow.push(0);
    }

    if (isReversed) {
      newRow.reverse();
    }

    return newRow;
  }

  finalizeMove(boardBeforeMove) {
    const boardAfterMove = JSON.stringify(this.board);

    if (boardBeforeMove !== boardAfterMove) {
      this.setNumber();
    }

    if (this.isWin()) {
      this.status = 'win';
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  handleRow(direction) {
    const isRight = direction === 'right';

    for (let r = 0; r < this.rows; r++) {
      const row = this.board[r];
      const newRow = this.processRow(row, isRight);

      this.board[r] = newRow;
    }
  }

  handleColumn(direction) {
    const isDown = direction === 'down';

    for (let c = 0; c < this.columns; c++) {
      const column = [];

      for (let r = 0; r < this.rows; r++) {
        column.push(this.board[r][c]);
      }

      const newColumm = this.processRow(column, isDown);

      for (let i = 0; i < this.rows; i++) {
        this.board[i][c] = newColumm[i];
      }
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    this.handleRow('left');
    this.finalizeMove(boardBeforeMove);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    this.handleRow('right');
    this.finalizeMove(boardBeforeMove);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    this.handleColumn('up');
    this.finalizeMove(boardBeforeMove);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    this.handleColumn('down');
    this.finalizeMove(boardBeforeMove);
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.setNumber();
      this.setNumber();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.board = this.initialBoardState.map((row) => row.slice());
  }
  // Add your own methods here
}

module.exports = Game;
