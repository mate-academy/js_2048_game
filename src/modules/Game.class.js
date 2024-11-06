'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const IDLE = 'idle';
const PLAYING = 'playing';
// const WIN = 'win';
// const LOSE = 'lose';

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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.status = IDLE;
  }

  addRandomTitle() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = 2;
    }
  }

  createColumn(col) {
    const newColumn = [];

    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][col] !== 0) {
        newColumn.push(this.board[row][col]);
      }
    }

    return newColumn;
  }

  updateColumn(col, newColumn) {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][col] !== newColumn[row]) {
        this.board[row][col] = newColumn[row];
        moved = true;
      }
    }

    return moved;
  }

  resetGameStart() {
    this.score = 0;
    this.status = PLAYING;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTitle();
    this.addRandomTitle();
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row];
      const newRow = currentRow.filter((val) => val !== 0);
      const canMerge = new Array(newRow.length).fill(true);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow.splice(i + 1, 1);
          moved = true;
          canMerge[i] = false;
        }
      }

      while (newRow.length < currentRow.length) {
        newRow.push(0);
      }

      this.board[row] = newRow;
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let row = this.board.length - 1; row >= 0; row--) {
      const currentRow = this.board[row];
      const newRow = currentRow.filter((val) => val !== 0);
      const canMerge = new Array(newRow.length).fill(true);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          newRow.splice(i - 1, 1);
          moved = true;
          canMerge[i] = false;
        }
      }

      while (newRow.length < currentRow.length) {
        newRow.unshift(0);
      }

      this.board[row] = newRow;
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < this.board.length; col++) {
      const newColumn = this.createColumn(col);
      const canMerge = new Array(newColumn.length).fill(true);

      for (let i = 0; i < newColumn.length - 1; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          newColumn[i] *= 2;
          newColumn.splice(i + 1, 1);
          moved = true;
          canMerge[i] = false;
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.push(0);
      }

      moved = this.updateColumn(col, newColumn) || moved;
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < this.board.length; col++) {
      const newColumn = this.createColumn(col);
      const canMerge = new Array(newColumn.length).fill(true);

      for (let i = newColumn.length - 1; i > 0; i--) {
        if (newColumn[i] === newColumn[i - 1]) {
          newColumn[i] *= 2;
          newColumn.splice(i - 1, 1);
          moved = true;
          canMerge[i] = false;
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.unshift(0);
      }

      moved = this.updateColumn(col, newColumn) || moved;
    }

    return moved;
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {}
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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {}

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
}

module.exports = Game;
