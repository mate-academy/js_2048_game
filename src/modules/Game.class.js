'use strict';

const MAX = 4;
const WIN_NUMBER = 2048;

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
    // eslint-disable-next-line no-console
    console.log(initialState);
    this.status = 'idle';
    this.score = 0;

    if (initialState) {
      this.board = structuredClone(initialState);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let flag = false;

    const merged = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let i = 0; i < MAX; i++) {
      for (let j = 1; j < MAX; j++) {
        if (this.board[i][j] !== 0) {
          let k = j;

          while (k > 0 && this.board[i][k - 1] === 0) {
            this.board[i][k - 1] = this.board[i][k];
            this.board[i][k] = 0;
            k--;
            flag = true;
          }

          if (
            k > 0 &&
            this.board[i][k] === this.board[i][k - 1] &&
            !merged[i][k - 1]
          ) {
            this.board[i][k - 1] = this.board[i][k] + this.board[i][k - 1];
            this.board[i][k] = 0;
            this.score += this.board[i][k - 1];
            merged[i][k - 1] = true;
            flag = true;
            this.isWin(this.board[i][k - 1]);
          }
        }
      }
    }

    if (flag) {
      this.generate();
    }

    this.isLose();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let flag = false;

    const merged = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let i = 0; i < MAX; i++) {
      for (let j = MAX - 2; j >= 0; j--) {
        if (this.board[i][j] !== 0) {
          let k = j;

          while (k < MAX - 1 && this.board[i][k + 1] === 0) {
            this.board[i][k + 1] = this.board[i][k];
            this.board[i][k] = 0;
            k++;
            flag = true;
          }

          if (
            k < MAX - 1 &&
            this.board[i][k] === this.board[i][k + 1] &&
            !merged[i][k + 1]
          ) {
            this.board[i][k + 1] = this.board[i][k] + this.board[i][k + 1];
            this.board[i][k] = 0;
            this.score += this.board[i][k + 1];
            merged[i][k + 1] = true;
            this.isWin(this.board[i][k + 1]);
            flag = true;
          }
        }
      }
    }

    if (flag) {
      this.generate();
    }

    this.isLose();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let flag = false;

    const merged = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let j = 0; j < MAX; j++) {
      for (let i = MAX - 2; i >= 0; i--) {
        if (this.board[i][j] !== 0) {
          let k = i;

          while (k < MAX - 1 && this.board[k + 1][j] === 0) {
            this.board[k + 1][j] = this.board[k][j];
            this.board[k][j] = 0;
            k++;
            flag = true;
          }

          if (
            k < MAX - 1 &&
            this.board[k][j] === this.board[k + 1][j] &&
            !merged[k + 1][j]
          ) {
            this.board[k + 1][j] = this.board[k][j] + this.board[k + 1][j];
            this.board[k][j] = 0;
            this.score += this.board[k + 1][j];
            merged[k + 1][j] = true;
            this.isWin(this.board[k + 1][j]);
            flag = true;
          }
        }
      }
    }

    if (flag) {
      this.generate();
    }

    this.isLose();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let flag = false;

    const merged = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let j = 0; j < MAX; j++) {
      for (let i = 1; i < MAX; i++) {
        if (this.board[i][j] !== 0) {
          let k = i;

          while (k > 0 && this.board[k - 1][j] === 0) {
            this.board[k - 1][j] = this.board[k][j];
            this.board[k][j] = 0;
            k--;
            flag = true;
          }

          if (
            k > 0 &&
            this.board[k][j] === this.board[k - 1][j] &&
            !merged[k - 1][j]
          ) {
            this.board[k - 1][j] = this.board[k][j] + this.board[k - 1][j];
            this.board[k][j] = 0;
            this.score += this.board[k - 1][j];
            merged[k - 1][j] = true;
            this.isWin(this.board[k - 1][j]);
            flag = true;
          }
        }
      }
    }

    if (flag) {
      this.generate();
    }

    this.isLose();
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
    return this.board;
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

    if (this.board.every((el) => el.every((e) => e === 0))) {
      this.generate();
      this.generate();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'playing';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.generate();
    this.generate();
  }

  generate() {
    const empty = [];

    for (let i = 0; i < MAX; i++) {
      for (let j = 0; j < MAX; j++) {
        if (this.board[i][j] === 0) {
          empty.push({ i, j });
        }
      }
    }

    if (empty.length !== 0) {
      const { i, j } = empty[Math.floor(Math.random() * empty.length)];

      this.board[i][j] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  isLose() {
    for (let i = 0; i < MAX; i++) {
      for (let j = 0; j < MAX; j++) {
        if (this.board[i][j] === 0) {
          return;
        }

        if (j < MAX - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return;
        }

        if (i < MAX - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }

  isWin(num) {
    if (num === WIN_NUMBER) {
      this.status = 'win';
    }
  }
}

module.exports = Game;
