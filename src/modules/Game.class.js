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
  constructor(initialState = null) {
    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : this.board.map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;

    for (let r = 0; r < 4; r++) {
      const newRow = this.mergeLine(this.board[r]);

      if (this.board[r].toString() !== newRow.toString()) {
        this.board[r] = newRow;
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addNewTile();
      this.checkWin();

      if (this.status !== 'win') {
        this.checkGameOver();
      }
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;

    for (let r = 0; r < 4; r++) {
      const reversed = [...this.board[r]].reverse();
      const merged = this.mergeLine(reversed).reverse();

      if (this.board[r].toString() !== merged.toString()) {
        this.board[r] = merged;
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addNewTile();
      this.checkWin();

      if (this.status !== 'win') {
        this.checkGameOver();
      }
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;

    for (let c = 0; c < 4; c++) {
      const col = this.board.map((row) => row[c]);
      const merged = this.mergeLine(col);

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== merged[r]) {
          this.board[r][c] = merged[r];
          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.addNewTile();
      this.checkWin();

      if (this.status !== 'win') {
        this.checkGameOver();
      }
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;

    for (let c = 0; c < 4; c++) {
      const col = this.board.map((row) => row[c]).reverse();
      const merged = this.mergeLine(col).reverse();

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== merged[r]) {
          this.board[r][c] = merged[r];
          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.addNewTile();
      this.checkWin();

      if (this.status !== 'win') {
        this.checkGameOver();
      }
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
    return JSON.parse(JSON.stringify(this.board));
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
    this.score = 0;

    const emptyCells = this.getEmptyCells();

    if (emptyCells.length >= 2) {
      this.addNewTile();
      this.addNewTile();
    } else if (emptyCells.length === 1) {
      this.addNewTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addNewTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let column = 0; column < this.board[row].length; column++) {
        if (this.board[row][column] === 0) {
          emptyCells.push({ row, column });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, column } = emptyCells[randomIndex];

      this.board[row][column] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.board[row][column] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  checkGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.board[row][column] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (
          column < 3 &&
          this.board[row][column] === this.board[row][column + 1]
        ) {
          return false;
        }

        if (
          row < 3 &&
          this.board[row][column] === this.board[row + 1][column]
        ) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  getEmptyCells() {
    const empty = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          empty.push([row, col]);
        }
      }
    }

    return empty;
  }

  mergeLine(line) {
    let newLine = line.filter((v) => v !== 0);

    for (let i = 0; i < newLine.length; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        this.score += newLine[i];
        newLine[i + 1] = 0;
        i++;
      }
    }

    newLine = newLine.filter((v) => v !== 0);

    while (newLine.length < 4) {
      newLine.push(0);
    }

    return newLine;
  }
}

module.exports = Game;
