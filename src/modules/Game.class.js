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
  constructor(initialState) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));
    this.initialState = this.board.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let boardChanged = false;

    for (let i = 0; i < this.board.length; i++) {
      const oldRow = this.board[i];
      const newRow = this.mergeRowLeft(oldRow);

      if (!this.areRowsEqual(oldRow, newRow)) {
        this.board[i] = newRow;

        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addRandomTile();
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }
  }

  moveRight() {
    let boardChanged = false;

    for (let i = 0; i < this.board.length; i++) {
      const originalRow = [...this.board[i]];
      const reversed = [...originalRow].reverse();
      const merged = this.mergeRowLeft(reversed);
      const newRow = merged.reverse();

      if (!this.areRowsEqual(originalRow, newRow)) {
        this.board[i] = newRow;

        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addRandomTile();
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }
  }

  moveUp() {
    let boardChanged = false;

    for (let col = 0; col < this.board.length; col++) {
      const column = [];

      for (let row = 0; row < this.board.length; row++) {
        column.push(this.board[row][col]);
      }

      const mergedColumn = this.mergeRowLeft(column);

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== mergedColumn[row]) {
          this.board[row][col] = mergedColumn[row];

          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.addRandomTile();
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }
  }

  moveDown() {
    let boardChanged = false;

    for (let col = 0; col < this.board.length; col++) {
      const column = [];

      for (let row = 0; row < this.board.length; row++) {
        column.push(this.board[row][col]);
      }

      const reversedCol = column.reverse();
      const mergedColumn = this.mergeRowLeft(reversedCol);
      const newCol = mergedColumn.reverse();

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];

          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.addRandomTile();
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }
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
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const empty = this.getEmptyCells();

    if (empty.length === 0) {
      return;
    }

    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[i][j] = value;
  }

  canMove() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        const current = this.board[i][j];

        if (j < this.board.length - 1 && current === this.board[i][j + 1]) {
          return true;
        }

        if (i < this.board.length - 1 && current === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  mergeRowLeft(row) {
    const withRow = row.filter((n) => n !== 0);

    for (let i = 0; i < withRow.length; i++) {
      if (withRow[i] === withRow[i + 1]) {
        withRow[i] += withRow[i + 1];
        this.score += withRow[i];
        withRow.splice(i + 1, 1);
      }
    }

    while (withRow.length < 4) {
      withRow.push(0);
    }

    return withRow;
  }

  areRowsEqual(row1, row2) {
    return row1.every((val, index) => val === row2[index]);
  }
}
