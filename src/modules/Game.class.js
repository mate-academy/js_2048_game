// 'use strict';

const INITIAL_SCORE = 0;
const INITIAL_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const STATUS_IDLE = 'idle';
const STATUS_PLAYING = 'playing';
const STATUS_WIN = 'win';
const STATUS_LOSE = 'lose';

const FOUR_PROBABILITY = 0.1;

function cloneState(state) {
  return state.map((arr) => [...arr]);
}

function normalize(value) {
  if (value > 0) {
    return 1;
  }

  if (value < 0) {
    return -1;
  }

  return 0;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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

  constructor(initialState = INITIAL_STATE) {
    this.initialState = cloneState(initialState);

    this.state = initialState;
    this.score = INITIAL_SCORE;
    this.status = STATUS_IDLE;
  }

  #checkGameBoard() {
    let hasAvailableMoves = false;

    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] === 2048) {
          this.status = STATUS_WIN;

          return;
        }

        if (
          (this.state[row + 1] &&
            this.state[row][column] === this.state[row + 1][column]) ||
          (this.state[row][column + 1] &&
            this.state[row][column] === this.state[row][column + 1])
        ) {
          hasAvailableMoves = true;
        }
      }
    }

    if (!hasAvailableMoves) {
      this.status = STATUS_LOSE;
    }
  }

  #getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        const cellValue = this.state[row][column];

        if (cellValue === 0) {
          emptyCells.push([row, column]);
        }
      }
    }

    return emptyCells;
  }

  #randomSpawn() {
    const emptyCells = this.#getEmptyCells();

    const randomEmptyCell = emptyCells[getRandomInt(emptyCells.length)];

    this.state[randomEmptyCell[0]][randomEmptyCell[1]] =
      Math.random() <= FOUR_PROBABILITY ? 4 : 2;
  }

  #moveColumnWithOffset(offset) {
    const columnStart = offset > 0 ? 0 : this.state.length - 1;
    const columnStep = normalize(offset);

    for (let row = 0; row < this.state.length; row++) {
      const currentRow = this.state[row];

      for (
        let column = columnStart;
        column < currentRow.length && column >= 0;
        column += columnStep
      ) {
        const shouldNotAdd = new Array(currentRow[column].length).fill(false);
        const nextColumnStart = offset > 0 ? column + 1 : column - 1;

        for (
          let column2 = nextColumnStart;
          column2 < currentRow.length && column2 >= 0;
          column2 += columnStep
        ) {
          if (currentRow[column] === 0 && currentRow[column2] !== 0) {
            currentRow[column] = currentRow[column2];
            currentRow[column2] = 0;

            continue;
          }

          if (
            currentRow[column] !== 0 &&
            currentRow[column] === currentRow[column2] &&
            !shouldNotAdd[row]
          ) {
            currentRow[column] += currentRow[column2];
            shouldNotAdd[row] = true;
            this.score += currentRow[column];

            currentRow[column2] = 0;
          }

          if (
            currentRow[column] !== 0 &&
            currentRow[column2] !== 0 &&
            currentRow[column] !== currentRow[column2]
          ) {
            shouldNotAdd[row] = true;
          }
        }
      }
    }
  }

  #moveRowWithOffset(offset) {
    const rowStart = offset > 0 ? 0 : this.state.length - 1;
    const rowStep = normalize(offset);

    for (
      let row = rowStart;
      row < this.state.length && row >= 0;
      row += rowStep
    ) {
      const shouldNotAdd = new Array(this.state[row].length).fill(false);
      const currentRow = this.state[row];

      const nextRowStart = offset > 0 ? row + 1 : row - 1;

      for (
        let row2 = nextRowStart;
        row2 < this.state.length && row2 >= 0;
        row2 += rowStep
      ) {
        const nextRow = this.state[row2];

        for (let column = 0; column < currentRow.length; column++) {
          if (currentRow[column] === 0 && nextRow[column] !== 0) {
            currentRow[column] = nextRow[column];
            nextRow[column] = 0;

            continue;
          }

          if (
            currentRow[column] !== 0 &&
            currentRow[column] === nextRow[column] &&
            !shouldNotAdd[column]
          ) {
            currentRow[column] += nextRow[column];
            shouldNotAdd[column] = true;

            this.score += currentRow[column];

            nextRow[column] = 0;
            continue;
          }

          if (
            currentRow[column] !== 0 &&
            nextRow[column] !== 0 &&
            currentRow[column] !== nextRow[column]
          ) {
            shouldNotAdd[column] = true;
          }
        }
      }
    }
  }

  #moveWithOffset(offsetColumn, offsetRow = 0) {
    if (this.status !== 'playing' && this.status !== 'idle') {
      return;
    }

    const lastState = this.state.toString();

    if (offsetRow) {
      this.#moveRowWithOffset(offsetRow);
    } else {
      this.#moveColumnWithOffset(offsetColumn);
    }

    this.#checkGameBoard();

    if (lastState === this.state.toString()) {
      return;
    }

    this.#randomSpawn();
  }

  moveLeft() {
    this.#moveWithOffset(1);
  }
  moveRight() {
    this.#moveWithOffset(-1);
  }
  moveUp() {
    this.#moveWithOffset(0, 1);
  }
  moveDown() {
    this.#moveWithOffset(0, -1);
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
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = STATUS_PLAYING;
    this.state = cloneState(this.initialState);
    this.score = INITIAL_SCORE;

    this.#randomSpawn();
    this.#randomSpawn();
  }

  // Add your own methods here
}

module.exports = Game;
