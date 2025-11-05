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

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.size = 4;
    this.score = 0;
    this.status = 'start';
    this.initialState = initialState;
  }

  moveLeft() {
    const oldBoard = this.getState();

    for (let row = 0; row < this.board.length; row++) {
      const numbers = [];
      const merged = [];

      for (let col = 0; col < this.board[row].length; col++) {
        const value = this.board[row][col];

        if (value === 0) {
          continue;
        } else if (
          numbers.length > 0 &&
          numbers[numbers.length - 1] === value &&
          merged[merged.length - 1] !== true
        ) {
          numbers[numbers.length - 1] *= 2;
          this.score += numbers[numbers.length - 1];
          merged[merged.length - 1] = true;
        } else {
          numbers.push(value);
          merged.push(false);
        }
      }

      while (numbers.length < this.board.length) {
        numbers.push(0);
      }

      this.board[row] = numbers;
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomNumber();
      this.checkWin();
      this.checkLose();
    }
  }
  moveRight() {
    const oldBoard = this.getState();

    for (let row = 0; row < this.board.length; row++) {
      const numbers = [];
      const merged = [];

      for (let col = this.board[row].length - 1; col >= 0; col--) {
        const value = this.board[row][col];

        if (value === 0) {
          continue;
        } else if (
          numbers.length > 0 &&
          numbers[numbers.length - 1] === value &&
          merged[merged.length - 1] !== true
        ) {
          numbers[numbers.length - 1] *= 2;
          this.score += numbers[numbers.length - 1];
          merged[merged.length - 1] = true;
        } else {
          numbers.push(value);
          merged.push(false);
        }
      }

      while (numbers.length < this.board.length) {
        numbers.push(0);
      }

      numbers.reverse();

      this.board[row] = numbers;
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomNumber();
      this.checkWin();
      this.checkLose();
    }
  }

  moveUp() {
    const oldBoard = this.getState();

    for (let col = 0; col < this.board.length; col++) {
      const numbers = [];
      const merged = [];

      for (let row = 0; row < this.board.length; row++) {
        const value = this.board[row][col];

        if (value === 0) {
          continue;
        } else if (
          numbers.length > 0 &&
          numbers[numbers.length - 1] === value &&
          merged[merged.length - 1] !== true
        ) {
          numbers[numbers.length - 1] *= 2;
          this.score += numbers[numbers.length - 1];
          merged[merged.length - 1] = true;
        } else {
          numbers.push(value);
          merged.push(false);
        }
      }

      while (numbers.length < this.board.length) {
        numbers.push(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = numbers[row];
      }
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomNumber();
      this.checkWin();
      this.checkLose();
    }
  }
  moveDown() {
    const oldBoard = this.getState();

    for (let col = 0; col < this.board.length; col++) {
      const numbers = [];
      const merged = [];

      for (let row = this.board.length - 1; row >= 0; row--) {
        const value = this.board[row][col];

        if (value === 0) {
          continue;
        } else if (
          numbers.length > 0 &&
          numbers[numbers.length - 1] === value &&
          merged[merged.length - 1] !== true
        ) {
          numbers[numbers.length - 1] *= 2;
          this.score += numbers[numbers.length - 1];
          merged[merged.length - 1] = true;
        } else {
          numbers.push(value);
          merged.push(false);
        }
      }

      while (numbers.length < this.board.length) {
        numbers.push(0);
      }

      numbers.reverse();

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = numbers[row];
      }
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomNumber();
      this.checkWin();
      this.checkLose();
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = this.initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';

    this.addRandomNumber();
    this.addRandomNumber();
  }

  /**
   * Resets the game.
   */
  restart() {
    return this.start();
  }

  // Add your own methods here

  addRandomNumber() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r += 1) {
      for (let c = 0; c < this.size; c += 1) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cellCoords = emptyCells[randomIndex];

    this.board[cellCoords.r][cellCoords.c] = Math.random() < 0.9 ? 2 : 4;
  }

  boardsAreEqual(a, b) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (a[row][col] !== b[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  checkWin() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkLose() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = this.board[row][col];

        if (col + 1 < this.size && this.board[row][col + 1] === value) {
          return;
        }

        if (row + 1 < this.size && this.board[row + 1][col] === value) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}
