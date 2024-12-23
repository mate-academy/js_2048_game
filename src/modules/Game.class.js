'use strict';

let currentState = [
  [1, 0, 0, 0],
  [2, 2, 0, 0],
  [2, 3, 3, 0],
  [4, 4, 4, 4],
];

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

  constructor(initialState = currentState) {
    // eslint-disable-next-line no-console
    // console.log(initialState);

    if (initialState !== currentState) {
      currentState = initialState;
    }

    this.drawCells(currentState);
  }

  drawCells(state) {
    const table = document.querySelector('.game-field tbody');
    const rows = table.getElementsByClassName('field-row');

    Array.from(rows).forEach((row, rowIndex) => {
      const cells = row.getElementsByClassName('field-cell');

      Array.from(cells).forEach((cell, cellIndex) => {
        if (state[rowIndex][cellIndex] !== 0) {
          cell.textContent = state[rowIndex][cellIndex];
        }
      });
    });
  }

  isMovePossibleHorisontally(state) {
    let sameValueDetected = false;

    for (const rows of Array.from(state)) {
      const filtered = rows.filter((value) => value > 0);

      for (let i = 1; i < filtered.length; i++) {
        if (filtered[i] === filtered[i - 1]) {
          sameValueDetected = true;
        }
      }
    }

    return sameValueDetected;
  }

  isMovePossibleVertically(state) {
    let sameValueDetected = false;
    const rotated = this.rotateMatrix(state);

    for (const rows of Array.from(rotated)) {
      const filtered = rows.filter((value) => value > 0);

      for (let i = 1; i < filtered.length; i++) {
        if (filtered[i] === filtered[i - 1]) {
          sameValueDetected = true;
        }
      }
    }

    return sameValueDetected;
  }

  // from chat gpt
  rotateMatrix(array) {
    return array[0].map(
      (_, colIndex) => array.map((row) => row[colIndex]).reverse(),
      // eslint-disable-next-line function-paren-newline
    );
  }

  moveLeft() {
    this.isMovePossibleHorisontally(currentState);
  }

  moveRight() {
    this.isMovePossibleHorisontally(currentState);
  }

  moveUp() {
    this.isMovePossibleVertically(currentState);
  }

  moveDown() {
    this.isMovePossibleVertically(currentState);
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
}

module.exports = Game;
