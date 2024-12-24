'use strict';

let currentState = [
  [0, 1, 0, 0],
  [2, 2, 2, 0],
  [4, 4, 2, 0],
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

    this.drawCells();
  }

  drawCells() {
    const table = document.querySelector('.game-field tbody');
    const rows = table.getElementsByClassName('field-row');

    Array.from(rows).forEach((row, rowIndex) => {
      const cells = row.getElementsByClassName('field-cell');

      Array.from(cells).forEach((cell) => {
        cell.textContent = '';
      });

      Array.from(cells).forEach((cell, cellIndex) => {
        if (currentState[rowIndex][cellIndex] !== 0) {
          cell.textContent = currentState[rowIndex][cellIndex];
        }
      });
    });
  }

  isMovePossibleHorisontally(state) {
    return this.hasSameNeighbours(state);
  }

  isMovePossibleVertically(state) {
    const rotated = this.rotateArrayClockwise(state);

    return this.hasSameNeighbours(rotated);
  }

  hasSameNeighbours(array) {
    let sameValueDetected = false;

    for (const rows of Array.from(array)) {
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
  rotateArrayClockwise(array) {
    return array[0].map(
      (_, colIndex) => array.map((row) => row[colIndex]).reverse(),
      // eslint-disable-next-line function-paren-newline
    );
  }

  rotateArrayCounterClockwise(array) {
    return array[0]
      .map((_, colIndex) => array.map((row) => row[colIndex]))
      .reverse();
  }

  mergeCells(direction) {
    const result = [];

    // const state =
    //   direction === 'up' || direction === 'down'
    //     ? this.rotateArrayClockwise(currentState)
    //     : [...currentState];

    const state =
      direction === 'up'
        ? this.rotateArrayCounterClockwise(currentState)
        : direction === 'down'
          ? this.rotateArrayClockwise(currentState)
          : [...currentState];

    for (const row of state) {
      const rowCopy = [...row].filter((value) => value > 0);

      if (direction === 'left') {
        const rowResult = this.mergeRowLeft(rowCopy);

        result.push(rowResult);
      }

      if (direction === 'right') {
        const rowResult = this.mergeRowLeft(rowCopy.reverse());

        result.push(rowResult.reverse());
      }

      if (direction === 'up') {
        const rowResult = this.mergeRowLeft(rowCopy);

        result.push(rowResult);
      }

      if (direction === 'down') {
        const rowResult = this.mergeRowLeft(rowCopy);

        result.push(rowResult);
      }
    }

    const finalResult =
      direction === 'up'
        ? this.rotateArrayClockwise(result)
        : direction === 'down'
          ? this.rotateArrayCounterClockwise(result)
          : result;

    this.drawCells();

    currentState = finalResult;
    this.drawCells();

    return finalResult;
  }

  mergeRowLeft(row) {
    const rowResult = [0, 0, 0, 0];
    let count = 0;

    while (count < row.length) {
      if (row[count] === row[count + 1]) {
        rowResult[count] = row[count] + row[count + 1];
        row.splice(count, 1);
        row.push(0);
      } else {
        rowResult[count] = row[count];
      }
      count += 1;
    }

    rowResult.length = 4;

    return rowResult;
  }

  moveLeft() {
    if (this.isMovePossibleHorisontally(currentState)) {
      currentState = this.mergeCells('left');
    }
  }

  moveRight() {
    if (this.isMovePossibleHorisontally(currentState)) {
      currentState = this.mergeCells('right');
    }
  }

  moveUp() {
    if (this.isMovePossibleVertically(currentState)) {
      currentState = this.mergeCells('up');
    }
  }

  moveDown() {
    if (this.isMovePossibleVertically(currentState)) {
      currentState = this.mergeCells('down');
    }
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
  getStatus() {
    if (
      !this.isMovePossibleHorisontally(currentState) &&
      !this.isMovePossibleVertically(currentState)
    ) {
      return 'lose';
    }
  }

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
