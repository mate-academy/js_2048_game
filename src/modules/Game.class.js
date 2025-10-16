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
     [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */

  score = 0;
  gameStatus;

  constructor(initialState, score = 0, gameStatus = 'idle') {
    if (initialState) {
      this.board = initialState;
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = score;
    this.gameStatus = gameStatus;
  }

  moveLeft() {
    for (let y = 0; y < 4; y++) {
      const notNull = [];

      for (let x = 0; x < 4; x++) {
        if (this.board[y][x] !== 0) {
          notNull.push(this.board[y][x]);
          this.board[y][x] = 0;
        }
      }

      for (let x = 0; x < notNull.length; x++) {
        this.board[y][x] = notNull[x];
      }

      for (let x = 0; x < 3; x++) {
        if (this.board[y][x] === this.board[y][x + 1]) {
          this.board[y][x] *= 2;
          this.board[y][x + 1] = 0;
          this.score += this.board[y][x];
        }
      }
    }

    for (let y = 0; y < 4; y++) {
      const notNull = [];

      for (let x = 0; x < 4; x++) {
        if (this.board[y][x] !== 0) {
          notNull.push(this.board[y][x]);
          this.board[y][x] = 0;
        }
      }

      for (let x = 0; x < notNull.length; x++) {
        this.board[y][x] = notNull[x];
      }
    }
  }

  moveRight() {
    for (let y = 0; y < 4; y++) {
      let notNull = [];

      for (let x = 3; x >= 0; x--) {
        if (this.board[y][x] !== 0) {
          notNull.push(this.board[y][x]);
          this.board[y][x] = 0;
        }
      }

      for (let i = 0; i < notNull.length; i++) {
        this.board[y][3 - i] = notNull[i];
      }

      for (let x = 3; x > 0; x--) {
        if (this.board[y][x] === this.board[y][x - 1]) {
          this.board[y][x] *= 2;
          this.board[y][x - 1] = 0;
          this.score += this.board[y][x];
        }
      }
      notNull = [];

      for (let x = 3; x >= 0; x--) {
        if (this.board[y][x] !== 0) {
          notNull.push(this.board[y][x]);
          this.board[y][x] = 0;
        }
      }

      for (let i = 0; i < notNull.length; i++) {
        this.board[y][3 - i] = notNull[i];
      }
    }
  }

  moveUp() {
    for (let x = 0; x < 4; x++) {
      let notNull = [];

      for (let y = 0; y < 4; y++) {
        if (this.board[y][x] !== 0) {
          notNull.push(this.board[y][x]);
          this.board[y][x] = 0;
        }
      }

      for (let i = 0; i < notNull.length; i++) {
        this.board[i][x] = notNull[i];
      }

      for (let y = 0; y < 3; y++) {
        if (this.board[y][x] === this.board[y + 1][x]) {
          this.board[y][x] *= 2;
          this.board[y + 1][x] = 0;
          this.score += this.board[y][x];
        }
      }

      notNull = [];

      for (let y = 0; y < 4; y++) {
        if (this.board[y][x] !== 0) {
          notNull.push(this.board[y][x]);
          this.board[y][x] = 0;
        }
      }

      for (let i = 0; i < notNull.length; i++) {
        this.board[i][x] = notNull[i];
      }
    }
  }

  moveDown() {
    for (let x = 0; x < 4; x++) {
      let notNull = [];

      for (let y = 3; y >= 0; y--) {
        if (this.board[y][x] !== 0) {
          notNull.push(this.board[y][x]);
          this.board[y][x] = 0;
        }
      }

      for (let i = 0; i < notNull.length; i++) {
        this.board[3 - i][x] = notNull[i];
      }

      for (let y = 3; y > 0; y--) {
        if (this.board[y][x] === this.board[y - 1][x]) {
          this.board[y][x] *= 2;
          this.board[y - 1][x] = 0;
          this.score += this.board[y][x];
        }
      }

      notNull = [];

      for (let y = 3; y >= 0; y--) {
        if (this.board[y][x] !== 0) {
          notNull.push(this.board[y][x]);
          this.board[y][x] = 0;
        }
      }

      for (let i = 0; i < notNull.length; i++) {
        this.board[3 - i][x] = notNull[i];
      }
    }
  }

  getScore() {}

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.gameStatus = 'playing';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.spawnCell();
    this.spawnCell();
  }

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here

  spawnCell() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [y, x] = emptyCells[randomIndex];

    let newValue;

    if (Math.random() < 0.9) {
      newValue = 2;
    } else {
      newValue = 4;
    }
    this.board[y][x] = newValue;

    return true;
  }

  checkWin() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.board[y][x] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.board[y][x] === 0) {
          return false;
        }
      }
    }

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (x < 3 && this.board[y][x] === this.board[y][x + 1]) {
          return false;
        }

        if (y < 3 && this.board[y][x] === this.board[y + 1][x]) {
          return false;
        }
      }
    }

    return true;
  }
}
module.exports = Game;
