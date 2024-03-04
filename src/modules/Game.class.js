'use strict';

const statuses = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

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
    this.initialState = initialState;
    this.state = [...initialState.map((row) => [...row])];
    this.score = 0;
    this.status = statuses.idle;
  }

  moveLeft() {
    const localState = [...this.state];

    if (!this.validateState(localState)) {
      return;
    }

    const newState = localState.map((row) => this.move(row));

    this.updateState(newState);
    this.afterAction();
  }

  moveRight() {
    const localState = [...this.state.map((row) => [...row].reverse())];

    if (!this.validateState(localState)) {
      return;
    }

    const newState = localState.map((row) => this.move(row).reverse());

    this.updateState(newState);
    this.afterAction();
  }

  moveUp() {
    const rotated90 = this.rotateClockwise(this.state);

    if (!this.validateState(rotated90)) {
      return;
    }

    const newState = [...rotated90.map((row) => this.move([...row]))];
    const rotatedBack = this.rotateCounterClockwise(newState);

    this.updateState(rotatedBack);
    this.afterAction();
  }

  moveDown() {
    const rotated90 = this.rotateClockwise(this.state);
    const rotatedLocalState = [...rotated90.map((row) => [...row].reverse())];

    if (!this.validateState(rotatedLocalState)) {
      return;
    }

    const newState = rotatedLocalState.map((row) =>
      this.move([...row]).reverse(),
    );
    const rotatedBack = this.rotateCounterClockwise(newState);

    this.updateState(rotatedBack);
    this.afterAction();
  }

  move(vector) {
    const cells = [...vector].filter((c) => c !== 0);
    const newRow = [];

    let i = 0;

    while (i <= cells.length) {
      const current = cells[i];
      const next = cells[i + 1];
      const isPair = current !== undefined && current === next;

      if (isPair) {
        newRow.push(current * 2);
        this.score += current * 2;
        i += 2;
      } else {
        newRow.push(current);
        i += 1;
      }
    }

    return vector.map((_item, index) => newRow[index] || 0);
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
    this.status = statuses.playing;
    this.afterAction(2);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.resetState();
    this.status = statuses.idle;
    this.score = 0;
  }

  resetState() {
    this.state = [...this.initialState.map((row) => [...row])];
  }

  updateState(state) {
    this.state = state;
  }

  // Add your own methods here
  createTile() {
    // const empty = this.getEmptyTilesIndexes();
    // const y = Math.round(Math.random() * empty.length);
    // const x = Math.round(Math.random() * empty[y].length);
    // const value = Math.random() > 0.9 ? 4 : 2;

    // console.log(empty, x, y, value);

    // this.state[y][empty[y][x]] = value;

    const emptyCells = this.getEmpty();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [row, col] = emptyCells[randomIndex];

    const value = Math.random() > 0.9 ? 4 : 2;

    this.state[row][col] = value;
  }

  getEmpty() {
    // return this.getState().map((row) =>
    //   row
    //     .map((cell, index) => (cell === 0 ? index : null))
    //     .filter((cell) => cell !== null),
    // );
    const matrix = this.getState();
    const emptyCells = [];

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  rotateClockwise(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const resultMatrix = [];

    for (let col = 0; col < cols; col++) {
      resultMatrix.push(new Array(rows).fill(''));
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        resultMatrix[cols - 1 - col][row] = matrix[row][col];
      }
    }

    return resultMatrix;
  }

  rotateCounterClockwise(transformedMatrix) {
    const rows = transformedMatrix.length;
    const cols = transformedMatrix[0].length;
    const originalMatrix = [];

    for (let col = 0; col < cols; col++) {
      originalMatrix.push(new Array(rows).fill(''));
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        originalMatrix[row][cols - 1 - col] = transformedMatrix[col][row];
      }
    }

    return originalMatrix;
  }

  afterAction(newCellsCount = 1) {
    const state = this.getState();

    for (let i = 0; i < newCellsCount; i++) {
      this.createTile();
    }

    if (this.isWin(state)) {
      this.status = statuses.win;

      return;
    }

    if (this.isLose(state)) {
      this.status = statuses.lose;
    }
  }

  validateState(localState) {
    if (this.status !== statuses.playing) {
      return;
    }

    const canMerge = localState.some((row) => {
      const withoutEmpty = row.filter((cell) => cell);

      const hasMergeableCells = withoutEmpty.map((cell, index) => {
        const current = cell;
        const next = row[index + 1];

        return current === next;
      });

      return hasMergeableCells.includes(true);
    });

    const hasEmptyTiles = localState.some((row) => {
      const firstEmpty = row.findIndex((cell) => cell === 0);
      const rest = row.slice(firstEmpty);
      const hasEmpty = rest.findIndex((cell) => cell !== 0) > 0;

      return hasEmpty;
    });

    return canMerge || hasEmptyTiles;
  }

  isWin(state) {
    return state.flat().includes(2048);
  }

  isLose(state) {
    const rotated90 = this.rotateClockwise(state);

    return [state, rotated90].every(
      (localState) => this.validateState(localState) === false,
    );
  }
}

module.exports = Game;
