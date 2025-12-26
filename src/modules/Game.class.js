/* eslint-disable function-paren-newline */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
    // eslint-disable-next-line no-console
    this.size = 4;

    this.state =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));

    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.state[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [x, y] = empty[Math.floor(Math.random() * empty.length)];

    this.state[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  checkStatus() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (
          this.state[i][j] === 0 ||
          this.state[i][j] === this.state[i][j + 1] ||
          (this.state[i + 1] && this.state[i][j] === this.state[i + 1][j])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  moveRowLeft(row) {
    const filtered = row.filter((num) => num !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    const result = filtered.filter((num) => num !== 0);

    while (result.length < this.size) {
      result.push(0);
    }

    return result;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);

    for (let i = 0; i < this.size; i++) {
      this.state[i] = this.moveRowLeft(this.state[i]);
    }

    if (JSON.stringify(this.state) !== oldState) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveRight() {
    const oldState = JSON.stringify(this.state);

    this.state = this.state.map((row) => {
      return this.moveRowLeft([...row].reverse()).reverse();
    });

    if (JSON.stringify(this.state) !== oldState) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  transpose() {
    return this.state[0].map((_, i) => this.state.map((row) => row[i]));
  }

  moveUp() {
    this.state = this.transpose();
    this.moveLeft();
    this.state = this.transpose();
  }

  moveDown() {
    this.state = this.transpose();
    this.moveRight();
    this.state = this.transpose();
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0),
    );

    this.score = 0;

    this.status = 'idle';
  }

  // Add your own methods here
}
