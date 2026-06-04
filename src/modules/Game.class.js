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
    this.initialState = initialState;
  }

  #state = [];
  #status = 'idle';
  #score = 0;

  moveLeft() {
    return this.move('left');
  }
  moveRight() {
    return this.move('right');
  }
  moveUp() {
    return this.move('up');
  }
  moveDown() {
    return this.move('down');
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
    return this.#state;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial #state);
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
    this.#status = 'playing';

    if (this.initialState) {
      this.#state = this.initialState;
    } else {
      this.#state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.addRandomNumber();
      this.addRandomNumber();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#score = 0;
    this.#status = 'idle';
    this.start();
  }

  // Helpers

  getNewNumber() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  getRandomPosition() {
    const emptyCells = [];

    for (let i = 0; i < this.#state.length; i++) {
      for (let j = 0; j < this.#state[i].length; j++) {
        if (this.#state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    const position = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    return position; // row, col
  }

  addRandomNumber() {
    const [row, col] = this.getRandomPosition();

    this.#state[row][col] = this.getNewNumber();
  }

  canBeMoved(direction) {
    return this.#state.some((row, r) => {
      return row.some((cell, c) => {
        if (direction === 'left') {
          const hasSpace = cell !== 0 && row[c - 1] === 0;
          const canMerge = cell !== 0 && row[c - 1] === cell;

          return c > 0 && (hasSpace || canMerge);
        }

        if (direction === 'right') {
          const hasSpace = cell !== 0 && row[c + 1] === 0;
          const canMerge = cell !== 0 && row[c + 1] === cell;

          return c < 3 && (hasSpace || canMerge);
        }

        if (direction === 'up') {
          if (r === 0) {
            return false;
          }

          const hasSpace = cell !== 0 && this.#state[r - 1][c] === 0;
          const canMerge = cell !== 0 && this.#state[r - 1][c] === cell;

          return r > 0 && (hasSpace || canMerge);
        }

        if (direction === 'down') {
          if (r === 3) {
            return false;
          }

          const hasSpace = cell !== 0 && this.#state[r + 1][c] === 0;
          const canMerge = cell !== 0 && this.#state[r + 1][c] === cell;

          return r < 3 && (hasSpace || canMerge);
        }
      });
    });
  }

  noMovesAvailable() {
    const hasAvailableMove = ['up', 'right', 'down', 'left']
      .map((direction) => this.canBeMoved(direction))
      .includes(true);

    return !hasAvailableMove;
  }

  checkWin() {
    if (this.#state.flat().includes(2048)) {
      this.#status = 'win';
    }
  }

  moveLine(line, direction) {
    switch (direction) {
      case 'right': {
        const numbers = line.filter((n) => n !== 0);

        for (let i = numbers.length - 1; i > 0; i--) {
          if (numbers[i] === numbers[i - 1]) {
            numbers[i] *= 2;
            this.#score += numbers[i];
            numbers[i - 1] = 0;
            i--;
          }
        }

        const merged = numbers.filter((n) => n !== 0);

        while (merged.length < line.length) {
          merged.unshift(0);
        }

        return merged;
      }

      case 'left': {
        const numbers = line.filter((n) => n !== 0);

        for (let i = 0; i < numbers.length - 1; i++) {
          if (numbers[i] === numbers[i + 1]) {
            numbers[i] *= 2;
            this.#score += numbers[i];
            numbers[i + 1] = 0;
            i++;
          }
        }

        const merged = numbers.filter((n) => n !== 0);

        while (merged.length < line.length) {
          merged.push(0);
        }

        return merged;
      }

      case 'up':
        return this.moveLine(line, 'left');

      case 'down':
        return this.moveLine(line, 'right');

      default:
        return line;
    }
  }

  move(direction) {
    if (!this.canBeMoved(direction)) {
      return false;
    }

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < 4; r++) {
        const row = this.#state[r];

        this.#state[r] = this.moveLine(row, direction);
      }
    } else {
      for (let c = 0; c < 4; c++) {
        const column = this.getColumn(c);
        const moved = this.moveLine(column, direction);

        this.setColumn(c, moved);
      }
    }

    this.checkWin();
    this.addRandomNumber();

    if (this.noMovesAvailable()) {
      this.#status = 'lose';
    }

    return true;
  }

  getColumn(c) {
    return this.#state.map((row) => row[c]);
  }

  setColumn(c, column) {
    this.#state.forEach((row, r) => {
      row[c] = column[r];
    });
  }
}

export default Game;
