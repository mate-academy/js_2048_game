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
    cells = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.cells = cells;
    this.restart();
  }

  slideAndMerge(row) {
    const filteredRow = row.filter((val) => val !== 0);
    const newRow = [];

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        newRow.push(filteredRow[i] * 2);
        this.score += filteredRow[i] * 2;
        i++;
      } else {
        newRow.push(filteredRow[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const rotated = (board) => {
      return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
    };

    let moved = false;

    if (direction === 'up' || direction === 'down') {
      this.board = rotated(this.board);
    }

    for (let i = 0; i < 4; i++) {
      const row =
        direction === 'right' || direction === 'down'
          ? [...this.board[i]].reverse()
          : [...this.board[i]];

      const newRow = this.slideAndMerge(row);

      if (direction === 'right' || direction === 'down') {
        newRow.reverse();
      }

      if (this.board[i].toString() !== newRow.toString()) {
        this.board[i] = newRow;
        moved = true;
      }
    }

    if (direction === 'up' || direction === 'down') {
      this.board = rotated(this.board);
    }

    if (moved) {
      this.addRandomTitle();
    }

    this.chechGameOver();
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {
    return this.getScore;
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
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.cells.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;
