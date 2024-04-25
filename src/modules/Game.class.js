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
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    if (
      initialState.length === 4 &&
      initialState.every((row) => row.length === 4)
    ) {
      this.initialState = initialState;
      this.restart();
    } else {
      throw new Error('Initial state is not valid!');
    }
  }

  moveLeft() {
    if (this.status === 'playing') {
      const result = this.moveTiles(true, false);

      if (this.isStateDifferent(result.state)) {
        this.updateGame(result);
      }
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const result = this.moveTiles(true, true);

      if (this.isStateDifferent(result.state)) {
        this.updateGame(result);
      }
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const result = this.moveTiles(false, false);

      if (this.isStateDifferent(result.state)) {
        this.updateGame(result);
      }
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const result = this.moveTiles(false, true);

      if (this.isStateDifferent(result.state)) {
        this.updateGame(result);
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
    return this.state;
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
    this.restart();
    this.status = 'playing';

    this.putNewNumber();
    this.putNewNumber();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
    this.firstMoveMade = false;
  }

  // Add your own methods here
  cloneState(state) {
    const newState = [];

    for (let row = 0; row < state.length; row++) {
      newState.push([...state[row]]);
    }

    return newState;
  }

  isStateDifferent(newState) {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] !== newState[row][column]) {
          return true;
        }
      }
    }

    return false;
  }

  updateGame(result) {
    this.state = result.state;
    this.score += result.score;
    this.firstMoveMade = true;
    this.putNewNumber();

    if (this.isGameLost()) {
      this.status = 'lose';
    } else if (this.isGameWon()) {
      this.status = 'win';
    }
  }

  getFirstMoveMade() {
    return this.firstMoveMade;
  }

  getAvailableSpace() {
    return this.state.reduce((space, row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          space.push({
            x: cellIndex,
            y: rowIndex,
          });
        }
      });

      return space;
    }, []);
  }

  getRandomSpace(space) {
    return space[Math.floor(Math.random() * space.length)];
  }

  getNewNumber() {
    return Math.floor(Math.random() * 10) === 0 ? 4 : 2;
  }

  putNewNumber() {
    const availableSpace = this.getAvailableSpace();
    const randomSpace = this.getRandomSpace(availableSpace);

    this.state[randomSpace.y][randomSpace.x] = this.getNewNumber();
  }

  isGameLost() {
    if (this.getAvailableSpace().length === 0) {
      if (
        this.isStateDifferent(this.moveTiles(false, false).state) ||
        this.isStateDifferent(this.moveTiles(true, true).state) ||
        this.isStateDifferent(this.moveTiles(false, true).state) ||
        this.isStateDifferent(this.moveTiles(true, false).state)
      ) {
        return false;
      }

      return true;
    }

    return false;
  }

  isGameWon() {
    return this.state.some((row) => row.some((cell) => cell === 2048));
  }

  getCellCoords(horizontal, firstCoord, position) {
    if (horizontal) {
      return {
        row: firstCoord,
        column: position,
      };
    }

    return {
      row: position,
      column: firstCoord,
    };
  }

  moveTiles(horizontal, forward, addScore) {
    const state = this.cloneState(this.state);
    let score = 0;

    const rowLength = state[0].length;
    const columnLength = state.length;
    let firstCoordLength;
    let secondCoordLength;

    if (horizontal) {
      firstCoordLength = columnLength;
      secondCoordLength = rowLength;
    } else {
      firstCoordLength = rowLength;
      secondCoordLength = columnLength;
    }

    let initialSecondCoord;
    let startOfStripe;
    let endOfStirpe;
    let step;

    if (forward) {
      initialSecondCoord = secondCoordLength - 2;
      startOfStripe = -1;
      endOfStirpe = secondCoordLength;
      step = 1;
    } else {
      initialSecondCoord = 1;
      startOfStripe = secondCoordLength;
      endOfStirpe = -1;
      step = -1;
    }

    for (let firstCoord = 0; firstCoord < firstCoordLength; firstCoord++) {
      const mergedInStripe = Array(secondCoordLength).fill(false);

      for (
        let secondCoord = initialSecondCoord;
        secondCoord !== startOfStripe;
        secondCoord -= step
      ) {
        let merged = false;
        let position = secondCoord;

        let currentCellCoords = this.getCellCoords(
          horizontal,
          firstCoord,
          position,
        );
        let nextCellCoords = this.getCellCoords(
          horizontal,
          firstCoord,
          position + step,
        );

        while (
          position + step !== endOfStirpe &&
          (state[nextCellCoords.row][nextCellCoords.column] === 0 ||
            (state[nextCellCoords.row][nextCellCoords.column] ===
              state[currentCellCoords.row][currentCellCoords.column] &&
              !mergedInStripe[position + step] &&
              !merged))
        ) {
          if (state[nextCellCoords.row][nextCellCoords.column] > 0) {
            merged = true;
            score += state[nextCellCoords.row][nextCellCoords.column] * 2;
          }

          state[nextCellCoords.row][nextCellCoords.column] +=
            state[currentCellCoords.row][currentCellCoords.column];
          state[currentCellCoords.row][currentCellCoords.column] = 0;
          position += step;

          currentCellCoords = this.getCellCoords(
            horizontal,
            firstCoord,
            position,
          );

          nextCellCoords = this.getCellCoords(
            horizontal,
            firstCoord,
            position + step,
          );
        }

        if (merged) {
          mergedInStripe[position] = true;
        }
      }
    }

    return {
      state: state,
      score: score,
    };
  }
}

module.exports = Game;
