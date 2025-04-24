'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  status = 'idle';

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
  constructor(initialState = this.#getEmptyArray()) {
    this.state = initialState;
  }

  moveLeft() {
    this.#makeHorizontalMove(this.#getEndingZerosOperationCallback());
  }

  moveRight() {
    this.#makeHorizontalMove(this.#getStartingZerosOperationCallback());
  }

  moveUp() {
    this.#makeVerticalMove(this.#getEndingZerosOperationCallback());
  }

  moveDown() {
    this.#makeVerticalMove(this.#getStartingZerosOperationCallback());
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.state.flat().reduce((a, b) => a + b, 0);
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
    this.status = 'playing';
    this.#addNewNumberToField();
    this.#addNewNumberToField();
    this.#updateGameField();

    const button = document.querySelector('.start');

    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';

    document.querySelector('.message-start').classList.add('hidden');
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.#updateGameField();

    const button = document.querySelector('.restart');

    button.classList.remove('restart');
    button.classList.add('start');
    button.innerText = 'Start';

    document.querySelector('.message-start').classList.remove('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
  }

  over() {
    this.status = 'lose';

    document.querySelector('.message-lose').classList.remove('hidden');
  }

  win() {
    this.status = 'win';

    document.querySelector('.message-win').classList.remove('hidden');
  }

  waitFor2048(state) {
    return new Promise((resolve) => {
      if (state.some((row) => row.includes(2048))) {
        resolve();
      }
    });
  }

  existsAvailableMove() {
    const { state } = this;

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        const current = state[i][j];

        if (
          current === 0 ||
          (i > 0 && state[i - 1][j] === current) ||
          (i < state.length - 1 && state[i + 1][j] === current) ||
          (j > 0 && state[i][j - 1] === current) ||
          (j < state[i].length - 1 && state[i][j + 1] === current)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  #makeHorizontalMove(operationCallback) {
    const initialState = structuredClone(this.state);

    this.state = this.state.map(operationCallback);

    this.#addNewNumberToFieldIfStateChanged(initialState, this.state);
    this.#updateGameField();
  }

  #makeVerticalMove(operationCallback) {
    const initialState = structuredClone(this.state);
    const transposedMatrix = this.#getTransposedState(this.state);

    this.state = this.#getTransposedState(
      transposedMatrix.map(operationCallback),
    );

    this.#addNewNumberToFieldIfStateChanged(initialState, this.state);
    this.#updateGameField();
  }

  #getTransposedState(state) {
    return state.map((_, colIndex) => state.map((row) => row[colIndex]));
  }

  #getEndingZerosOperationCallback() {
    const sortCallback = (a, b) => (a === 0 ? 1 : b === 0 ? -1 : 0);

    return (rowArray) => {
      return rowArray.sort(sortCallback).map((item, index, array) => {
        if (index < array.length - 1 && item === array[index + 1]) {
          array[index + 1] = 0;
          array.sort(sortCallback);

          return item * 2;
        }

        return item;
      });
    };
  }

  #getStartingZerosOperationCallback() {
    const sortCallback = (a, b) => (a === 0 ? -1 : b === 0 ? 1 : 0);

    return (rowArray) => {
      rowArray.sort(sortCallback);

      for (let i = rowArray.length - 1; i > 0; i--) {
        if (rowArray[i] === rowArray[i - 1]) {
          rowArray[i] *= 2;
          rowArray[i - 1] = 0;
          rowArray.sort(sortCallback);
        }
      }

      return rowArray;
    };
  }

  #getEmptyArray() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  #addNewNumberToFieldIfStateChanged(initialState, currentState) {
    if (JSON.stringify(initialState) !== JSON.stringify(currentState)) {
      this.#addNewNumberToField();
    }
  }

  #addNewNumberToField() {
    const arr = this.state;
    const emptyCells = [];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      arr[randomCell.row][randomCell.col] = this.#getRandomTwoOrFour();
    }
  }

  #getRandomTwoOrFour() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  #updateGameField() {
    const table = document.querySelector('.game-field');

    this.state.forEach((rowArray, i) => {
      rowArray.forEach((value, j) => {
        const cell = table.rows[i].cells[j];

        cell.textContent = value === 0 ? '' : `${value}`;
        this.#updateCellStyle(cell, value);
      });
    });
  }

  #updateCellStyle(cell, value) {
    cell.classList.forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  }
}

module.exports = Game;
