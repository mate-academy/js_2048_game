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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState.map((row) => [...row]);
    // eslint-disable-next-line no-console
    console.log(this.board);
  }

  moveLeft() {
    for (let line = 0; line < this.board.length; line++) {
      let noZero = this.board[line].filter((a) => a !== 0);

      for (let i = 0; i < noZero.length - 1; i++) {
        if (noZero[i] === noZero[i + 1]) {
          noZero[i] *= 2;
          noZero[i + 1] = 0;
        }
      }

      noZero = noZero.filter((a) => a !== 0);

      while (noZero.length < this.board[line].length) {
        noZero.push(0);
      }

      this.board[line] = noZero;
    }
    // eslint-disable-next-line no-console
    this.addTie();
  }
  moveRight() {
    for (let line = 0; line < this.board.length; line++) {
      let noZero = this.board[line].filter((a) => a !== 0);

      for (let i = noZero.length - 1; i >= 0; i--) {
        if (noZero[i] === noZero[i - 1]) {
          noZero[i] *= 2;
          noZero[i - 1] = 0;
        }
      }

      noZero = noZero.filter((a) => a !== 0);

      while (noZero.length < this.board[line].length) {
        noZero.unshift(0);
      }

      this.board[line] = noZero;
    }
    // eslint-disable-next-line no-console
    console.log(this.board);
    this.addTie();
  }
  moveUp() {
    for (let element = 0; element < 4; element++) {
      const switchDer = [];

      for (let line = 0; line < 4; line++) {
        switchDer.push(this.board[line][element]);
      }

      let noZero = switchDer.filter((a) => a !== 0);

      for (let i = 0; i < noZero.length - 1; i++) {
        if (noZero[i] === noZero[i + 1]) {
          noZero[i] *= 2;
          noZero[i + 1] = 0;
        }
      }

      noZero = noZero.filter((a) => a !== 0);

      while (noZero.length < 4) {
        noZero.push(0);
      }

      for (let changer = 0; changer < 4; changer++) {
        this.board[changer][element] = noZero[changer];
      }
    }
    // eslint-disable-next-line no-console
    console.log(this.board);
    this.addTie();
  }
  moveDown() {
    for (let element = 0; element < 4; element++) {
      const switchDer = [];

      for (let line = 0; line < 4; line++) {
        switchDer.push(this.board[line][element]);
      }

      let noZero = switchDer.filter((a) => a !== 0);

      for (let i = noZero.length - 1; i > 0; i--) {
        if (noZero[i] === noZero[i - 1]) {
          noZero[i] *= 2;
          noZero[i - 1] = 0;
          i--;
        }
      }

      noZero = noZero.filter((a) => a !== 0);

      while (noZero.length < 4) {
        noZero.unshift(0);
      }

      for (let changer = 0; changer < 4; changer++) {
        this.board[changer][element] = noZero[changer];
      }
    }
    this.addTie();
  }
  // eslint-disable-next-line no-console

  /**
   * @returns {number}
   */
  getScore() {
    const scorebase = this.board.flat(Infinity);
    let score = 0;

    for (let i = 0; i < scorebase.length; i++) {
      score += scorebase[i];
    }

    return score * 1;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
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
    if (this.getScore() === 0) {
      return 'idle';
    }

    if (this.isOver()) {
      return 'lose';
    }

    if (this.board.flat().includes(2048)) {
      return 'win';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.addTie();
    this.addTie();

    // eslint-disable-next-line no-console
    console.log(this.board);
  }

  /**
   * Resets the game.
   */
  restart() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = 0;
      }
    }

    // eslint-disable-next-line no-console
    console.log(this.board);
  }

  // Add your own methods here

  addTie() {
    const empty = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length > 0) {
      const [x, y] = empty[Math.floor(Math.random() * empty.length)];

      this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  isOver() {
    const size = this.board.length;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = this.board[r][c];

        if (val === 0) {
          return false;
        }

        if (c < size - 1 && val === this.board[r][c + 1]) {
          return false;
        }

        if (r < size - 1 && val === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
