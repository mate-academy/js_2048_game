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
    this.status = 'idle';
    this.score = 0;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    const previousState = JSON.stringify(this.board);
    let merged = false;

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      let row = this.board[rowIndex].filter((value) => value !== 0);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row[i + 1] = 0;
          merged = true;
        }
      }

      row = row.filter((value) => value !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      this.board[rowIndex] = row;
    }

    if (merged || JSON.stringify(this.board) !== previousState) {
      this.spawnTile();
    }
  }
  moveRight() {
    const previousState = JSON.stringify(this.board);
    let merged = false;

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      let row = this.board[rowIndex].filter((value) => value !== 0).reverse();

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row[i + 1] = 0;
          merged = true;
        }
      }

      row = row.filter((value) => value !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      row.reverse();

      this.board[rowIndex] = row;
    }

    if (merged || JSON.stringify(this.board) !== previousState) {
      this.spawnTile();
    }
  }

  moveUp() {
    const previousState = JSON.stringify(this.board);
    let merged = false;

    for (let col = 0; col < 4; col++) {
      let newColumn = this.board.map((row) => row[col]).filter((v) => v !== 0);

      for (let i = 0; i < newColumn.length - 1; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          newColumn[i] *= 2;
          this.score += newColumn[i];
          newColumn[i + 1] = 0;
          merged = true;
        }
      }

      newColumn = newColumn.filter((v) => v !== 0);

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    if (merged || JSON.stringify(this.board) !== previousState) {
      this.spawnTile();
    }
  }
  moveDown() {
    const previousState = JSON.stringify(this.board);
    let merged = false;

    for (let col = 0; col < 4; col++) {
      let newColumn = this.board
        .map((row) => row[col])
        .filter((v) => v !== 0)
        .reverse();

      for (let i = 0; i < newColumn.length - 1; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          newColumn[i] *= 2;
          this.score += newColumn[i];
          newColumn[i + 1] = 0;
          merged = true;
        }
      }

      newColumn = newColumn.filter((v) => v !== 0);

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      newColumn.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    if (merged || JSON.stringify(this.board) !== previousState) {
      this.spawnTile();
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
    if (this.checkForWin()) {
      return 'win';
    }

    if (this.isGameOver()) {
      this.status = 'lose';

      return 'lose';
    }

    if (this.isIdle()) {
      return 'idle';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.spawnTile();
    this.spawnTile();
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

  spawnTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      const newTile = Math.random() < 0.9 ? 2 : 4;

      this.board[randomCell.row][randomCell.col] = newTile;
    }
  }

  checkForWin() {
    for (const row of this.board) {
      for (const tile of row) {
        if (tile === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  isIdle() {
    for (const row of this.board) {
      for (const tile of row) {
        if (tile !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  isGameOver() {
    for (const row of this.board) {
      if (row.includes(0)) {
        return false;
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
