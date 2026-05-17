'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

const MAX_FIELDS = 4;
const WIN_SCORE = 2048;

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
   * initial state
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
    console.log(initialState);

    if (
      Array.isArray(initialState) &&
      initialState.length === MAX_FIELDS &&
      initialState.every((e) => e.length === MAX_FIELDS)
    ) {
      this.initialState = initialState;
      this.score = 0;
      this.status = 'idle';
    }
  }

  moveLeft() {
    if (this.getStatus() !== 'lose') {
      const previousState = JSON.stringify(this.initialState);
      const { result, score } = Game.#shiftLeft(this.initialState);

      this.score += score;
      this.initialState = result;

      if (previousState !== JSON.stringify(this.initialState)) {
        this.#crateField();
      }
      this.#changeFinalStatus();
    }
  }

  moveRight() {
    if (this.getStatus() !== 'lose') {
      const previousState = JSON.stringify(this.initialState);
      const tempMatrix = Game.#reverse(this.initialState);

      const { result, score } = Game.#shiftLeft(tempMatrix);

      this.score += score;
      this.initialState = Game.#reverse(result);

      if (previousState !== JSON.stringify(this.initialState)) {
        this.#crateField();
      }
      this.#changeFinalStatus();
    }
  }

  moveDown() {
    if (this.getStatus() !== 'lose') {
      const previousState = JSON.stringify(this.initialState);
      let tempMatrix = Game.#transposition(this.initialState);

      tempMatrix = Game.#reverse(tempMatrix);

      const { result, score } = Game.#shiftLeft(tempMatrix);

      this.score += score;
      tempMatrix = Game.#reverse(result);

      this.initialState = Game.#transposition(tempMatrix);

      if (previousState !== JSON.stringify(this.initialState)) {
        this.#crateField();
      }
      this.#changeFinalStatus();
    }
  }

  moveUp() {
    if (this.getStatus() !== 'lose') {
      const previousState = JSON.stringify(this.initialState);
      const tempMatrix = Game.#transposition(this.initialState);

      const { result, score } = Game.#shiftLeft(tempMatrix);

      this.score += score;
      this.initialState = Game.#transposition(result);

      if (previousState !== JSON.stringify(this.initialState)) {
        this.#crateField();
      }
      this.#changeFinalStatus();
    }
  }

  static #shiftLeft(matrix) {
    let score = 0;
    const result = structuredClone(matrix);

    for (let i = 0; i < result.length; i++) {
      let row = result[i].filter((e) => e !== 0);

      for (let m = 0, n = m + 1; n < row.length; n++, m++) {
        if (row[m] === row[n]) {
          row[m] *= 2;
          score += row[m];
          row[n] = 0;
        }
      }

      row = row.filter((e) => e !== 0);

      while (result[i].length !== row.length) {
        row.push(0);
      }

      result[i] = row;
    }

    return { result, score };
  }

  static #transposition(result) {
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result[i].length; j++) {
        [result[i][j], result[j][i]] = [result[j][i], result[i][j]];
      }
    }

    return result;
  }

  static #reverse(matrix) {
    return matrix.map((r) => [...r].reverse());
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    this.#crateField();
    this.#crateField();
  }

  #crateField() {
    const emptyCells = [];

    for (let i = 0; i < this.initialState.length; i++) {
      for (let j = 0; j < this.initialState[i].length; j++) {
        if (this.initialState[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { x, y } = emptyCells[randomIndex];

    this.initialState[x][y] = Math.random() > 0.9 ? 4 : 2;
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
    this.status = 'playing';

    this.#crateField();
    this.#crateField();
  }

  #changeFinalStatus() {
    const hasWon = this.initialState.some((e) => e.includes(WIN_SCORE));

    if (hasWon) {
      this.status = 'win';

      return;
    }

    if (this.#isLose()) {
      this.status = 'lose';
    }
  }

  #isLose() {
    for (let i = 0; i < this.initialState.length; i++) {
      for (let j = 0; j < this.initialState[i].length; j++) {
        if (this.initialState[i][j] === 0) {
          return false;
        }

        if (
          j < this.initialState[i].length - 1 &&
          this.initialState[i][j] === this.initialState[i][j + 1]
        ) {
          return false;
        }

        if (
          i < this.initialState.length - 1 &&
          this.initialState[i][j] === this.initialState[i + 1][j]
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
