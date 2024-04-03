'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static get defaultSize() {
    return 4;
  }

  static get defaultInitialState() {
    return new Array(Game.defaultSize)
      .fill(null)
      .map((el) => new Array(Game.defaultSize).fill(0));
  }
  #status = 'idle';
  #score = 0;
  #isForCheck = false;
  #state;
  #initialState;
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
  constructor(initialState = Game.defaultInitialState, isForCheak = false) {
    this.#initialState = initialState.map((row) => [...row]);
    this.#applyInitialState();
    this.#isForCheck = isForCheak;
  }

  moveLeft() {
    let isStateChanged = false;

    if (this.#status !== 'playing' && !this.#isForCheck) {
      return isStateChanged;
    }

    this.#state.forEach((row) => {
      const mergedCellIndexes = new Set();
      const emptyIndexes = [];

      for (let i = 0; i < row.length; i++) {
        if (row[i] === 0) {
          emptyIndexes.push(i);
          continue;
        }

        let cellIndex = i;

        if (emptyIndexes.length) {
          cellIndex = emptyIndexes.shift();
          emptyIndexes.push(i);

          row[cellIndex] = row[i];
          row[i] = 0;
          isStateChanged = true;
        }

        const previousCellIndex = cellIndex - 1;

        if (
          previousCellIndex >= 0 &&
          row[previousCellIndex] === row[cellIndex] &&
          !mergedCellIndexes.has(previousCellIndex)
        ) {
          mergedCellIndexes.add(previousCellIndex);
          row[previousCellIndex] *= 2;
          row[cellIndex] = 0;
          emptyIndexes.unshift(cellIndex);
          this.#score += row[previousCellIndex];
          isStateChanged = true;

          if (row[previousCellIndex] >= 2048) {
            this.#status = 'win';

            return true;
          }
        }
      }
    });

    if (isStateChanged) {
      this.#addNumber();
    }

    if (!this.#isForCheck && !this.#isMovePossible()) {
      this.#status = 'lose';
    }

    return isStateChanged;
  }

  moveRight() {
    this.#reverse();

    const result = this.moveLeft();

    this.#reverse();

    return result;
  }

  moveUp() {
    this.#rotate();

    const result = this.moveLeft();

    this.#rotate();

    return result;
  }

  moveDown() {
    this.#rotate();

    const result = this.moveRight();

    this.#rotate();

    return result;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#state.map((row) => [...row]);
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#addNumber();
    this.#addNumber();
    this.#status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#applyInitialState();
    this.#score = 0;
    this.#status = 'idle';
  }

  // Add your own methods here

  #applyInitialState() {
    this.#state = this.#initialState.map((row) => [...row]);
  }

  #isMovePossible() {
    const gameCopy = new Game(this.getState(), true);

    return (
      gameCopy.moveLeft() ||
      gameCopy.moveRight() ||
      gameCopy.moveUp() ||
      gameCopy.moveDown()
    );
  }

  #addNumber() {
    const number = Math.random() > 0.1 ? 2 : 4;
    const emptyFields = this.#findEmptyFields();

    if (!emptyFields.length) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyFields.length);

    const { x, y } = emptyFields[randomIndex];

    this.#state[y][x] = number;

    return true;
  }

  #findEmptyFields() {
    const result = [];

    this.#state.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 0) {
          result.push({ x, y });
        }
      });
    });

    return result;
  }

  #reverse() {
    this.#state.forEach((row) => row.reverse());
  }

  #rotate() {
    this.#state = this.#state.map((row, i) => {
      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        newRow.push(this.#state[j][i]);
      }

      return newRow;
    });
  }
}

module.exports = Game;
