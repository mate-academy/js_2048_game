'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status === 'win' || this.status === 'lose') {
      return;
    }

    const copy = this.makeCopy(this.board);

    for (let row = 0; row < this.board.length; row++) {
      const values = [];

      for (let col = 0; col < this.board[row].length; col++) {
        const cell = this.board[row][col];

        if (cell !== 0) {
          values.push(cell);
        }
      }

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          values.splice(i + 1, 1);
          this.score += values[i];
        }
      }

      while (values.length < this.board[row].length) {
        values.push(0);
      }

      this.board[row] = values;
    }

    this.generalCheck(copy);
  }
  moveRight() {
    if (this.status === 'win' || this.status === 'lose') {
      return;
    }

    const copy = this.makeCopy(this.board);

    for (let row = 0; row < this.board.length; row++) {
      const values = [];

      for (let col = this.board[row].length - 1; col >= 0; col--) {
        const cell = this.board[row][col];

        if (cell !== 0) {
          values.unshift(cell);
        }
      }

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          values.splice(i + 1, 1);
          this.score += values[i];
        }
      }

      while (values.length < this.board[row].length) {
        values.unshift(0);
      }

      this.board[row] = values;
    }

    this.generalCheck(copy);
  }
  moveUp() {
    if (this.status === 'win' || this.status === 'lose') {
      return;
    }

    const numCols = this.board[0].length;
    const copy = this.makeCopy(this.board);

    for (let col = 0; col < numCols; col++) {
      const values = [];

      for (let row = 0; row < this.board.length; row++) {
        const cell = this.board[row][col];

        if (cell !== 0) {
          values.push(cell);
        }
      }

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          values.splice(i + 1, 1);
          this.score += values[i];
        }
      }

      while (values.length < this.board.length) {
        values.push(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = values[row];
      }
    }

    this.generalCheck(copy);
  }
  moveDown() {
    if (this.status === 'win' || this.status === 'lose') {
      return;
    }

    const numCols = this.board[0].length;
    const copy = this.makeCopy(this.board);

    for (let col = 0; col < numCols; col++) {
      const values = [];

      for (let row = this.board.length - 1; row >= 0; row--) {
        const cell = this.board[row][col];

        if (cell !== 0) {
          values.push(cell);
        }
      }

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          values.splice(i + 1, 1);
          this.score += values[i];
        }
      }

      while (values.length < this.board.length) {
        values.push(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[this.board.length - 1 - row][col] = values[row];
      }
    }

    this.generalCheck(copy);
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
    return this.board.map((row) => [...row]);
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
    const coords = this.getEmptyCells();

    this.addTitle(coords);
    this.addTitle(coords);

    this.status = 'playing';
    this.score = 0;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.start();
  }

  /**
   * Checks the empty cells of the board.
   */
  getEmptyCells() {
    const coords = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          coords.push([row, col]);
        }
      }
    }

    return coords;
  }

  /**
   * Adds title to the board.
   */
  addTitle(coords) {
    if (coords.length === 0) {
      return;
    }

    const titleIndex = Math.floor(Math.random() * coords.length);
    const [r, c] = coords[titleIndex];

    coords.splice(titleIndex, 1);

    if (Math.random() < 0.1) {
      this.board[r][c] = 4;
    } else {
      this.board[r][c] = 2;
    }

    return this.board[r][c];
  }

  /**
   * Makes the deep copy of the board.
   */
  makeCopy(original) {
    return original.map((row) => [...row]);
  }

  /**
   * Compares states of the board before and after the moves.
   */
  compareStates(beforeBoard, afterBoard) {
    for (let row = 0; row < beforeBoard.length; row++) {
      for (let col = 0; col < beforeBoard[row].length; col++) {
        if (beforeBoard[row][col] !== afterBoard[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Checks the possibility of moving.
   */
  canMove() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (
          col + 1 < this.board[row].length &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }

        if (
          row + 1 < this.board.length &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks if user wins.
   */
  winningState() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks the possibility of adding cells and assigning win or lose state.
   */
  generalCheck(copy) {
    if (!this.compareStates(copy, this.board)) {
      const coords = this.getEmptyCells();

      this.addTitle(coords);
    }

    if (this.winningState()) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }
}
