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

  static INITIAL_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState = Game.INITIAL_STATE) {
    this.initialState = initialState;
    this.board = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
  }

  // initialization methods

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.initialState = Game.INITIAL_STATE;
    this.board = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
  }

  // Getters

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

  // Utility methods

  /**
   * Adds a random tile (2 or 4) to an empty spot on the board.
   */
  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length > 0) {
      const [randomRow, randomCol] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  /**
   * Compares two arrays for equality.
   * @param {Array} arr1
   * @param {Array} arr2
   * @returns {boolean}
   */
  arraysEqual(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((val, index) => val === arr2[index])
    );
  }

  /**
   * Transposes the board (turns rows into columns).
   * @returns {number[][]}
   */
  transposeBoard() {
    return this.board[0].map((_, colIndex) =>
      // eslint-disable-next-line prettier/prettier
      this.board.map((row) => row[colIndex]));
  }

  /**
   * Checks if the player has won (2048 tile).
   * @returns {boolean}
   */
  checkWin() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return true;
    }

    return false;
  }

  /**
   * Checks if the player has lost (no valid moves left).
   * @returns {boolean}
   */
  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          this.board[row][col] === 0 ||
          (col < 3 && this.board[row][col] === this.board[row][col + 1]) ||
          (row < 3 && this.board[row][col] === this.board[row + 1][col])
        ) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }

  // Movement Methods

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((num) => num !== 0);

      // Merge adjacent equal cells
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1); // Remove the merged cell
        }
      }

      // Fill the remaining cells with zeros
      while (newRow.length < 4) {
        newRow.push(0);
      }

      // Update the board if it has changed
      if (!this.arraysEqual(this.board[row], newRow)) {
        this.board[row] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }

    return moved;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    this.board = this.board.map((row) => row.slice().reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => row.reverse());

    return moved;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    this.board = this.transposeBoard();

    const moved = this.moveRight();

    this.board = this.transposeBoard();

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    this.board = this.transposeBoard();

    const moved = this.moveLeft();

    this.board = this.transposeBoard();

    return moved;
  }
}

module.exports = Game;
