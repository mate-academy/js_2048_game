'use strict';

class Game {
  #boardSize = 4;
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
    this.#initialize(initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let isMoveMade = false;

    // shift everything left until no empty cells left
    for (let i = 0; i < this.#boardSize; i++) {
      const currentRow = this.state[i];

      for (let j = 1; j < this.#boardSize; j++) {
        if (currentRow[j] === 0) {
          continue;
        }

        let current = j;

        while (currentRow[current - 1] === 0) {
          currentRow[current - 1] = currentRow[current];
          currentRow[current] = 0;

          current = current - 1;
          isMoveMade = true;
        }
      }
    }

    let scoreToAdd = 0;

    // merge two equal neighbouring cells into a doubled value cell
    for (let i = 0; i < this.#boardSize; i++) {
      const currentRow = this.state[i];

      for (let j = 0; j < this.#boardSize - 1; j++) {
        // if the last non-empty cell in a row is reached
        // no reason to go further through the row
        if (currentRow[j] === 0) {
          break;
        }

        if (currentRow[j] !== currentRow[j + 1]) {
          continue;
        }

        // merge two cells
        currentRow[j] += currentRow[j + 1];
        scoreToAdd += currentRow[j];

        if (currentRow[j] === 2048) {
          this.status = 'win';
        }

        let current = j;

        // shift all cells left by one
        while (currentRow[current] !== 0 && current < this.#boardSize - 2) {
          current = current + 1;
          currentRow[current] = currentRow[current + 1];
        }

        if (current >= this.#boardSize - 2) {
          currentRow[this.#boardSize - 1] = 0;
        }
        isMoveMade = true;
      }
    }

    if (isMoveMade) {
      this.score += scoreToAdd;
      this.#addRandomNumber();
    }

    if (!this.#hasMovesLeft()) {
      this.status = 'lose';
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let isMoveMade = false;

    // shift everything right until no empty cells left
    for (let i = 0; i < this.#boardSize; i++) {
      const currentRow = this.state[i];

      for (let j = this.#boardSize - 2; j >= 0; j--) {
        if (currentRow[j] === 0) {
          continue;
        }

        let current = j;

        while (currentRow[current + 1] === 0) {
          currentRow[current + 1] = currentRow[current];
          currentRow[current] = 0;

          current = current + 1;
          isMoveMade = true;
        }
      }
    }

    let scoreToAdd = 0;

    // merge two equal neighbouring cells into a doubled value cell
    for (let i = 0; i < this.#boardSize; i++) {
      const currentRow = this.state[i];

      for (let j = this.#boardSize - 1; j > 0; j--) {
        // if the last non-empty cell in a row is reached
        // no reason to go further through the row
        if (currentRow[j] === 0) {
          break;
        }

        if (currentRow[j] !== currentRow[j - 1]) {
          continue;
        }

        // merge two cells
        currentRow[j] += currentRow[j - 1];
        scoreToAdd += currentRow[j];

        if (currentRow[j] === 2048) {
          this.status = 'win';
        }

        let current = j;

        // shift all cells right by one
        while (currentRow[current] !== 0 && current > 1) {
          current = current - 1;
          currentRow[current] = currentRow[current - 1];
        }

        if (current <= 1) {
          currentRow[0] = 0;
        }
        isMoveMade = true;
      }
    }

    if (isMoveMade) {
      this.score += scoreToAdd;
      this.#addRandomNumber();
    }

    if (!this.#hasMovesLeft()) {
      this.status = 'lose';
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let isMoveMade = false;

    // shift everything up until no empty cells left
    for (let i = 1; i < this.#boardSize; i++) {
      for (let j = 0; j < this.#boardSize; j++) {
        let prevRow = this.state[i - 1];
        let currentRow = this.state[i];

        if (currentRow[j] === 0) {
          continue;
        }

        let rowIndex = i;

        while (prevRow[j] === 0) {
          prevRow[j] = currentRow[j];
          currentRow[j] = 0;

          if (--rowIndex <= 0) {
            break;
          }
          prevRow = this.state[rowIndex - 1];
          currentRow = this.state[rowIndex];
          isMoveMade = true;
        }
      }
    }

    let scoreToAdd = 0;

    // merge two equal neighbouring cells into a doubled value cell
    for (let i = 0; i < this.#boardSize - 1; i++) {
      for (let j = 0; j < this.#boardSize; j++) {
        const currentRow = this.state[i];
        const nextRow = this.state[i + 1];

        if (currentRow[j] === 0 || currentRow[j] !== nextRow[j]) {
          continue;
        }

        // merge two cells
        currentRow[j] += nextRow[j];
        scoreToAdd += currentRow[j];

        if (currentRow[j] === 2048) {
          this.status = 'win';
        }

        let rowIndex = i;

        // shift all cells up by one
        while (
          this.state[rowIndex][j] !== 0 &&
          rowIndex < this.#boardSize - 2
        ) {
          rowIndex++;
          this.state[rowIndex][j] = this.state[rowIndex + 1][j];
        }

        if (rowIndex >= this.#boardSize - 2) {
          this.state[this.#boardSize - 1][j] = 0;
        }
        isMoveMade = true;
      }
    }

    if (isMoveMade) {
      this.score += scoreToAdd;
      this.#addRandomNumber();
    }

    if (!this.#hasMovesLeft()) {
      this.status = 'lose';
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let isMoveMade = false;

    // shift everything down until no empty cells left
    for (let i = this.#boardSize - 2; i >= 0; i--) {
      for (let j = 0; j < this.#boardSize; j++) {
        let nextRow = this.state[i + 1];
        let currentRow = this.state[i];

        if (currentRow[j] === 0) {
          continue;
        }

        let rowIndex = i;

        while (nextRow[j] === 0) {
          nextRow[j] = currentRow[j];
          currentRow[j] = 0;

          if (++rowIndex >= this.#boardSize - 1) {
            break;
          }
          nextRow = this.state[rowIndex + 1];
          currentRow = this.state[rowIndex];
          isMoveMade = true;
        }
      }
    }

    let scoreToAdd = 0;

    // merge two equal neighbouring cells into a doubled value cell
    for (let i = this.#boardSize - 1; i > 0; i--) {
      for (let j = 0; j < this.#boardSize; j++) {
        const currentRow = this.state[i];
        const prevRow = this.state[i - 1];

        if (currentRow[j] === 0 || currentRow[j] !== prevRow[j]) {
          continue;
        }

        // merge two cells
        currentRow[j] += prevRow[j];
        scoreToAdd += currentRow[j];

        if (currentRow[j] === 2048) {
          this.status = 'win';
        }

        let rowIndex = i;

        // shift all cells down by one
        while (this.state[rowIndex][j] !== 0 && rowIndex > 1) {
          rowIndex--;
          this.state[rowIndex][j] = this.state[rowIndex - 1][j];
        }

        if (rowIndex <= 1) {
          this.state[0][j] = 0;
        }
        isMoveMade = true;
      }
    }

    if (isMoveMade) {
      this.score += scoreToAdd;
      this.#addRandomNumber();
    }

    if (!this.#hasMovesLeft()) {
      this.status = 'lose';
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
    return this.state.map((row) => [...row]);
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

  getBoardSize() {
    return this.#boardSize;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.#addRandomNumber();
    this.#addRandomNumber();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    if (this.status === 'idle') {
      return;
    }
    this.#initialize();
    this.start();
  }

  // adds either 2 or 4 to a random empty cell
  #addRandomNumber() {
    const emptyCells = [];

    for (let i = 0; i < this.#boardSize; i++) {
      for (let j = 0; j < this.#boardSize; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const newCellIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[newCellIndex[0]][newCellIndex[1]] = numToAdd();

    // randomly returns either 2 (90%) or 4 (10%)
    function numToAdd() {
      return Math.random() < 0.1 ? 4 : 2;
    }
  }

  // if initialState format is correct - this.state = initialState
  // if not - this.state = array #boardSize x #boardSize filled with 0
  #initialize(initialState) {
    this.score = 0;
    this.status = 'idle';
    this.state = [];

    if (this.#isStateCorrect(initialState)) {
      this.state = initialState;
    } else {
      this.state.length = this.#boardSize;

      this.state = Array.from(
        {
          length: this.#boardSize,
        },
        () => new Array(this.#boardSize).fill(0),
      );
    }
  }

  // check for the right state format
  // (boardSize x boardSize array filled with 2^n or 0)
  #isStateCorrect(state) {
    if (!state || state.length !== this.#boardSize) {
      return false;
    }

    for (let i = 0; i < this.#boardSize; i++) {
      if (!state[i] || state[i].length !== this.#boardSize) {
        return false;
      }

      for (let j = 0; j < this.#boardSize; j++) {
        const cell = state[i][j];

        if (!isPowerOfTwo(cell)) {
          return false;
        }
      }
    }

    return true;

    // check if the num is either 2^n or 0
    function isPowerOfTwo(num) {
      return Number.isInteger(num) && (num & (num - 1)) === 0;
    }
  }

  #hasMovesLeft() {
    for (let row = 0; row < this.#boardSize; row++) {
      for (let col = 0; col < this.#boardSize; col++) {
        const cell = this.state[row][col];

        if (cell === 0) {
          return true;
        }

        if (row + 1 < this.#boardSize && cell === this.state[row + 1][col]) {
          return true;
        }

        if (col + 1 < this.#boardSize && cell === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
