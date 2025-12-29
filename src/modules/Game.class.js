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
    console.log(initialState);

    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < 4; r++) {
      const oldRow = this.board[r];
      const newRow = this.merge(oldRow);

      if (!oldRow.every((val, i) => val === newRow[i])) {
        moved = true;
        this.board[r] = newRow;
      }
    }

    if (moved) {
      this.addRandomCell();
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    if (!this.canMove() && this.status !== 'win') {
      this.status = 'lose';
    }
  }

  addRandomCell() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < 4; r++) {
      const oldRow = this.board[r];
      const rowCopy = [...oldRow];

      rowCopy.reverse();

      const merged = this.merge(rowCopy);
      const newRow = [...merged].reverse();

      if (oldRow.some((value, i) => value !== newRow[i])) {
        moved = true;
        this.board[r] = newRow;
      }
    }

    if (moved) {
      this.addRandomCell();
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    if (!this.canMove() && this.status !== 'win') {
      this.status = 'lose';
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < 4; c++) {
      const copyCol = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      const merged = this.merge(copyCol);
      const newCol = merged;

      if (!copyCol.every((val, i) => val === newCol[i])) {
        moved = true;

        this.board[0][c] = newCol[0];
        this.board[1][c] = newCol[1];
        this.board[2][c] = newCol[2];
        this.board[3][c] = newCol[3];
      }
    }

    if (moved) {
      this.addRandomCell();
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    if (!this.canMove() && this.status !== 'win') {
      this.status = 'lose';
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < 4; c++) {
      const originalCol = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      const copyCol = [...originalCol];

      copyCol.reverse();

      const merged = this.merge(copyCol);
      const newCol = merged.reverse();

      if (!originalCol.every((val, i) => val === newCol[i])) {
        moved = true;

        this.board[0][c] = newCol[0];
        this.board[1][c] = newCol[1];
        this.board[2][c] = newCol[2];
        this.board[3][c] = newCol[3];
      }
    }

    if (moved) {
      this.addRandomCell();
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    if (!this.canMove() && this.status !== 'win') {
      this.status = 'lose';
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

    for (let i = 0; i < 2; i++) {
      const emptyCells = [];

      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (this.board[r][c] === 0) {
            emptyCells.push([r, c]);
          }
        }
      }

      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, cell] = emptyCells[randomIndex];

      const value = Math.random() < 0.1 ? 4 : 2;

      this.board[row][cell] = value;
    }
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

    this.score = 0;
    this.status = 'idle';
  }

  merge(row) {
    const newRow = [];
    let skip = false;
    const numbers = row.filter((num) => num !== 0);

    for (let i = 0; i < numbers.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (i < numbers.length - 1 && numbers[i] === numbers[i + 1]) {
        const merged = numbers[i] * 2;

        newRow.push(merged);
        this.score += merged;
        skip = true;
      } else {
        newRow.push(numbers[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }
}

export default Game;
