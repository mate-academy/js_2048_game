'use strict';

let currentState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
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
    if (initialState !== currentState) {
      currentState = initialState;
    }
    this.gameStarted = false;
  }

  drawCells() {
    this.addRandom();

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

          for (const classItem of cell.classList) {
            if (classItem !== 'field-cell') {
              cell.classList.remove(classItem);
            }
          }

          cell.classList.add(
            `field-cell--${currentState[rowIndex][cellIndex]}`,
          );
        } else {
          for (const classItem of cell.classList) {
            if (classItem !== 'field-cell') {
              cell.classList.remove(classItem);
            }
          }
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

  addRandom() {
    const emptyCells = [];
    const options = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentState[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell = Math.floor(Math.random() * emptyCells.length);
    const randomOption = Math.floor(Math.random() * options.length);

    const [row, col] = emptyCells[randomCell];

    currentState[row][col] = options[randomOption];
  }

  moveCells(direction) {
    const result = [];

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
    if (this.gameStarted) {
      this.moveCells('left');
    }
  }

  moveRight() {
    if (this.gameStarted) {
      this.moveCells('right');
    }
  }

  moveUp() {
    if (this.gameStarted) {
      this.moveCells('up');
    }
  }

  moveDown() {
    if (this.gameStarted) {
      this.moveCells('down');
    }
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {
    return currentState;
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
    if (
      this.isMovePossibleHorisontally(currentState) ||
      this.isMovePossibleVertically(currentState)
    ) {
      return 'lose';
    }

    if (currentState.some((value) => value === 2048)) {
      return 'win';
    }

    if (currentState.every((value) => value === 0)) {
      return 'idle';
    } else {
      return 'playing';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.gameStarted = true;

    // const startMessage = document.querySelector('.message.message-start');

    // startMessage.hidden = true;
    this.addRandom();
    this.drawCells();
  }

  /**
   * Resets the game.
   */
  restart() {
    currentState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
}

module.exports = Game;
