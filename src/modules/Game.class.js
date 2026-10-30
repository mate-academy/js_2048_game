'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

export class Game {
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

    this.state = initialState.map((row) => [...row]) || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
  }

  moveLeft() {
    for (let i = 0; i < this.state.length; i++) {
      const numbers = this.state[i].filter((number) => number !== 0);

      for (let j = 0; j < numbers.length - 1; j++) {
        if (numbers[j] === numbers[j + 1]) {
          numbers[j] *= 2;
          this.score += numbers[j];
          numbers.splice(j + 1, 1);
        }
      }

      while (numbers.length < 4) {
        numbers.push(0);
      }

      this.state[i] = numbers;
    }
  }
  moveRight() {
    for (let i = 0; i < this.state.length; i++) {
      const numbers = this.state[i].filter((number) => number !== 0);

      for (let j = numbers.length - 1; j > 0; j--) {
        if (numbers[j] === numbers[j - 1]) {
          numbers[j] *= 2;
          this.score += numbers[j];
          numbers.splice(j - 1, 1);
        }
      }

      while (numbers.length < 4) {
        numbers.unshift(0);
      }

      this.state[i] = numbers;
    }
  }
  moveUp() {
    for (let j = 0; j < this.state.length; j++) {
      const column = [];

      for (let i = 0; i < this.state[j].length; i++) {
        column.push(this.state[i][j]);
      }

      const numbers = column.filter((number) => number !== 0);

      for (let a = 0; a < numbers.length - 1; a++) {
        if (numbers[a] === numbers[a + 1]) {
          numbers[a] *= 2;
          this.score += numbers[a];
          numbers.splice(a + 1, 1);
        }
      }

      while (numbers.length < 4) {
        numbers.push(0);
      }

      for (let i = 0; i < this.state[j].length; i++) {
        this.state[i][j] = numbers[i];
      }
    }
  }
  moveDown() {
    for (let j = 0; j < this.state.length; j++) {
      const column = [];

      for (let i = 0; i < this.state[j].length; i++) {
        column.unshift(this.state[i][j]);
      }

      const numbers = column.filter((number) => number !== 0);

      for (let a = 0; a < numbers.length - 1; a++) {
        if (numbers[a] === numbers[a + 1]) {
          numbers[a] *= 2;
          this.score += numbers[a];
          numbers.splice(a + 1, 1);
        }
      }

      while (numbers.length < 4) {
        numbers.push(0);
      }

      for (let i = 0; i < this.state[j].length; i++) {
        this.state[3 - i][j] = numbers[i];
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
    return this.state.map((row) => [...row]);
  }

  spawnTile() {
    const empty = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
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
    let allEmpty = true;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] !== 0) {
          allEmpty = false;
        }
      }
    }

    if (allEmpty) {
      return 'idle';
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          return 'win';
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        const current = this.state[i][j];

        if (current === 0) {
          return 'playing';
        }

        if (j < 3 && current === this.state[i][j + 1]) {
          return 'playing';
        }

        if (i < 3 && current === this.state[i + 1][j]) {
          return 'playing';
        }
      }
    }

    return 'lose';
  }

  /**
   * Starts the game.
   */
  clear() {
    this.score = 0;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        this.state[i][j] = 0;
      }
    }
  }

  start() {
    this.clear();

    this.spawnTile();
    this.spawnTile();
    this.getStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.clear();
  }

  // Add your own methods here
}

module.exports = Game;
