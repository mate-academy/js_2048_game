/* eslint-disable no-console */
/* eslint-disable function-paren-newline */
'use strict';

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
    // eslint-disable-next-line no-console
    this.state = 'idle';
    this.score = 0;
    this.initialState = initialState;
  }

  moveLeft() {
    if (this.state !== 'idle') {
      const moveAllNonZeroToTheLeft = this.initialState.map((row) =>
        mergeToTheLeft(row),
      );

      this.state = loseWinState(moveAllNonZeroToTheLeft);

      this.score += calculateScore(this.initialState, moveAllNonZeroToTheLeft);

      const newCellAdded = addNewCellRandomCell(moveAllNonZeroToTheLeft, 1);

      this.initialState = newCellAdded;

      return this.initialState;
    }
  }
  moveRight() {
    if (this.state !== 'idle') {
      const moveAllNonZeroToTheRight = this.initialState.map((row) =>
        mergeToTheRight(row),
      );

      this.state = loseWinState(moveAllNonZeroToTheRight);

      this.score += calculateScore(this.initialState, moveAllNonZeroToTheRight);

      const newCellAdded = addNewCellRandomCell(moveAllNonZeroToTheRight, 1);

      this.initialState = newCellAdded;

      return this.initialState;
    }
  }
  moveUp() {
    if (this.state !== 'idle') {
      const moveAllNonZeroToTheUp = mergeUp(this.initialState);

      this.state = loseWinState(moveAllNonZeroToTheUp);

      this.score += calculateScore(this.initialState, moveAllNonZeroToTheUp);

      const newCellAdded = addNewCellRandomCell(moveAllNonZeroToTheUp, 1);

      this.initialState = newCellAdded;

      return this.initialState;
    }
  }
  moveDown() {
    if (this.state !== 'idle') {
      const moveAllNonZeroToTheDown = mergeDown(this.initialState);

      this.score += calculateScore(this.initialState, moveAllNonZeroToTheDown);
      this.state = loseWinState(moveAllNonZeroToTheDown);

      const newCellAdded = addNewCellRandomCell(moveAllNonZeroToTheDown, 1);

      this.initialState = newCellAdded;

      return this.initialState;
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
    return this.initialState;
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
    return this.state;
  }

  /**
   * Starts the game.
   */
  start() {
    const allInitialDateIsZero = this.initialState
      .flat()
      .every((value) => value === 0);

    const returnToInitialArray = allInitialDateIsZero
      ? addNewCellRandomCell(this.initialState, 2)
      : addNewCellRandomCell(this.initialState, 1);

    this.initialState = returnToInitialArray;
    this.score = 0;
    this.state = 'playing';


    return this.initialState;

  }

  /**
   * Resets the game.
   */
  restart() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.state = 'idle';

    return this.initialState;
  }

  // Add your own methods here
}

function addNewCellRandomCell(initialState, qntOfRandomCellsToAdd) {
  const flatGameInARow = initialState.flat();
  const availableIndices = flatGameInARow
    .map((value, i) => (value === 0 ? i : null))
    .filter((value) => value !== null);

  if (availableIndices.length === 0) {
    return initialState;
  }

  for (let i = 0; i < qntOfRandomCellsToAdd; i++) {
    if (availableIndices.length === 0) {
      break;
    }

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const indexToAdd = availableIndices.splice(randomIndex, 1)[0];
    const randomValue = Math.random() < 0.9 ? 2 : 4;

    flatGameInARow[indexToAdd] = randomValue;
  }

  const returnToInitialArray = [];

  while (flatGameInARow.length) {
    returnToInitialArray.push(flatGameInARow.splice(0, 4));
  }

  return returnToInitialArray;
}

function mergeToTheLeft(result) {
  for (let i = 0; i < result.length - 1; i++) {
    if (result[i] === result[i + 1] && result[i] !== 0) {
      result[i] *= 2;
      result[i + 1] = 0;
    }
  }

  const filtered = result.filter((num) => num !== 0);

  while (filtered.length < result.length) {
    filtered.push(0);
  }

  return filtered;
}

function mergeToTheRight(result) {
  let nonZeroValues = result.filter((value) => value !== 0);

  for (let i = nonZeroValues.length - 1; i > 0; i--) {
    if (nonZeroValues[i] === nonZeroValues[i - 1]) {
      nonZeroValues[i] *= 2;
      nonZeroValues[i - 1] = 0;
    }
  }
  // Remove zeros again after merging
  nonZeroValues = nonZeroValues.filter((value) => value !== 0);

  // Add zeros to the left to maintain the row length
  while (nonZeroValues.length < result.length) {
    nonZeroValues.unshift(0);
  }

  return nonZeroValues;
}

function mergeDown(initialState) {
  const result = initialState.map((col) => [...col]);

  for (let col = 0; col < result[0].length; col++) {
    const column = result.map((row) => row[col]);

    for (let i = column.length - 1; i > 0; i--) {
      if (column[i] === column[i - 1] && column[i] !== 0) {
        column[i] *= 2;
        column[i - 1] = 0;
      }
    }

    const filtered = column.filter((num) => num !== 0);

    while (filtered.length < column.length) {
      filtered.unshift(0);
    }

    for (let i = 0; i < result.length; i++) {
      result[i][col] = filtered[i];
    }
  }

  return result;
}

function mergeUp(initialState) {
  const result = initialState.map((col) => [...col]);

  for (let col = 0; col < result[0].length; col++) {
    const column = result.map((row) => row[col]);

    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1] && column[i] !== 0) {
        column[i] *= 2;
        column[i + 1] = 0;
      }
    }

    const filtered = column.filter((num) => num !== 0);

    while (filtered.length < column.length) {
      filtered.push(0);
    }

    for (let i = 0; i < result.length; i++) {
      result[i][col] = filtered[i];
    }
  }

  return result;
}

function checkIfWin(initialState) {
  for (let i = 0; i < initialState.length; i++) {
    for (let j = 0; j < initialState[i].length; j++) {
      if (initialState[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function checkIfLose(initialState) {
  for (let i = 0; i < initialState.length; i++) {
    for (let j = 0; j < initialState[i].length; j++) {
      if (initialState[i][j] === 0) {
        return false;
      }
    }
  }

  return true;
}

function loseWinState(initialState) {
  const lose = checkIfLose(initialState);
  const win = checkIfWin(initialState);

  if (lose) {
    return 'lose';
  }

  if (win) {
    return 'win';
  }

  return 'playing';
}

function calculateScore(initialState, finalState) {
  let score = 0;

  for (let i = 0; i < initialState.length; i++) {
    for (let j = 0; j < initialState[i].length; j++) {
      if (finalState[i][j] > initialState[i][j]) {
        score += finalState[i][j];
      }
    }
  }

  return score;
}

module.exports = Game;
