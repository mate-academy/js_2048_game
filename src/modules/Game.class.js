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
    // if (initialState !== currentState) {
    //   currentState = initialState;
    // }
    this.initialStateSaved = JSON.parse(JSON.stringify(initialState));
    currentState = initialState;
    this.score = 0;
    this.status = 'idle';
    this.gameStarted = false;
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

    for (const row of Array.from(array)) {
      const filtered = row.filter((value) => value > 0);

      for (let i = 1; i < filtered.length; i++) {
        if (filtered[i] === filtered[i - 1]) {
          sameValueDetected = true;
        }
      }

      if (row.some((value) => value === 0)) {
        sameValueDetected = true;
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

    const randomCell =
      emptyCells.length === 1
        ? 0
        : Math.floor(Math.random() * emptyCells.length);
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

    return finalResult;
  }

  mergeRowLeft(row) {
    const rowResult = [0, 0, 0, 0];
    let count = 0;

    while (count < row.length) {
      if (row[count] === row[count + 1]) {
        rowResult[count] = row[count] + row[count + 1];
        this.score += rowResult[count];
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
      this.addRandom();
    }
  }

  moveRight() {
    if (this.gameStarted) {
      this.moveCells('right');
      this.addRandom();
    }
  }

  moveUp() {
    if (this.gameStarted) {
      this.moveCells('up');
      this.addRandom();
    }
  }

  moveDown() {
    if (this.gameStarted) {
      this.moveCells('down');
      this.addRandom();
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
    if (currentState.flat().some((value) => value === 2048)) {
      return 'win';
    }

    if (
      !this.isMovePossibleHorisontally(currentState) &&
      !this.isMovePossibleVertically(currentState)
    ) {
      return 'lose';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.gameStarted = true;
    this.addRandom();
    this.addRandom();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';

    if (!this.initialStateSaved.flat().every((value) => value === 0)) {
      currentState = [...this.initialStateSaved];
    } else {
      currentState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }
}

module.exports = Game;
