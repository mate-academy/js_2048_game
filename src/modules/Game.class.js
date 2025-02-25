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
  constructor(initialState) {
    this.state =
      initialState ||
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
  }

  moveLeft(state = this.state) {
    const newState = this.state.map((row) => {
      let newRow = row.filter((num) => num !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      return newRow;
    });

    if (JSON.stringify(newState) !== JSON.stringify(this.state)) {
      this.state = newState;
      this.render();
      this.addRandomTile();
    }

    return newState;
  }

  moveRight(state = this.state) {
    const newState = this.state.map((row) => {
      let newRow = row.filter((num) => num !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          newRow[i - 1] = 0;
          i--;
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < row.length) {
        newRow.unshift(0);
      }

      return newRow;
    });

    if (JSON.stringify(newState) !== JSON.stringify(this.state)) {
      this.state = newState;
      this.render();
      this.addRandomTile();
    }

    return newState;
  }

  moveUp() {
    const state = this.state;
    const transposedState = transpose(state).map((row) => {
      let newRow = row.filter((num) => num !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          newRow[i - 1] = 0;
          i--;
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      return newRow;
    });
    const newState = transpose(transposedState);

    if (JSON.stringify(newState) !== JSON.stringify(this.state)) {
      this.state = newState;
      this.render();
      this.addRandomTile();
    }

    return newState;
  }

  moveDown() {
    const state = this.state;
    const transposedState = transpose(state).map((row) => {
      let newRow = row.filter((num) => num !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          newRow[i - 1] = 0;
          i--;
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < row.length) {
        newRow.unshift(0);
      }

      return newRow;
    });
    const newState = transpose(transposedState);

    if (JSON.stringify(newState) !== JSON.stringify(this.state)) {
      this.state = newState;
      this.render();
      this.addRandomTile();
    }

    return newState;
  }
  /**
   * @returns {number}
   */
  getScore() {
    const state = this.state;
    let sum = 0;

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state[row].length; col++) {
        sum += state[row][col];
      }
    }

    return sum;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const fieldRows = [...document.querySelectorAll('.field-row')];
    const state = [];

    for (let i = 0; i < fieldRows.length; i++) {
      const fieldCellsOfcurrentRow = [...fieldRows[i].children];

      state[i] = [];

      for (let j = 0; j < fieldCellsOfcurrentRow.length; j++) {
        state[i].push(Number(fieldCellsOfcurrentRow[j].textContent) || 0);
      }
    }

    return state;
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
    if (this.getScore() >= 2048) {
      return 'win';
    }

    if (this.canMove()) {
      return 'playing';
    }

    return 'lose';
  }

  canMove() {
    const state = this.state;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (state[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = state[row][col];

        if (
          (row < 3 && current === state[row + 1][col]) ||
          (col < 3 && current === state[row][col + 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.isGameStarted) {
      return;
    }
    this.isGameStarted = true;

    const state = this.state;

    for (let i = 0; i < 2; i++) {
      const cell = this.getRandomEmptyCell();

      if (!cell) {
        return;
      }

      const { row, col } = cell;

      state[row][col] = this.generateRandomNumber();
    }

    this.render();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.isGameStarted = false;

    this.state = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    // this.addRandomTile();
    // this.addRandomTile();
    this.render();

    return this.state;
  }

  getRandomEmptyCell() {
    const state = this.state;
    const emptyCells = [];

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state[row].length; col++) {
        if (state[row][col] === 0) {
          emptyCells.push({ row, col }); // save coords of empty cells
        }
      }
    }

    if (emptyCells.length === 0) {
      return null; // If there is no empty cells
    }

    // random cell
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  generateRandomNumber() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  render() {
    const fieldRows = [...document.querySelectorAll('.field-row')];

    for (let row = 0; row < this.state.length; row++) {
      const currentRow = fieldRows[row];

      if (!currentRow) {
        continue;
      }

      const cellsOfCurrentRow = currentRow.children;

      for (let col = 0; col < this.state[row].length; col++) {
        if (!cellsOfCurrentRow[col]) {
          continue;
        }

        cellsOfCurrentRow[col].textContent =
          this.state[row][col] === 0 ? '' : this.state[row][col];
        cellsOfCurrentRow[col].className = 'field-cell';

        if (this.state[row][col] !== 0) {
          cellsOfCurrentRow[col].classList.add(
            `field-cell--${this.state[row][col]}`,
          );
        }
      }
    }

    const gameScore = document.querySelector('.game-score');

    if (gameScore) {
      gameScore.textContent = this.getScore();
    }
  }

  addRandomTile() {
    const state = this.state;
    const cell = this.getRandomEmptyCell();

    if (!cell) {
      return;
    }

    state[cell.row][cell.col] = this.generateRandomNumber();
    this.render();
  }
}

function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

// export default Game;

module.exports = Game;
