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
    // eslint-disable-next-line no-console
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.status = 'idle';

    // console.log('Game initialized:', this.board);
  }

  boardsAreEqual(board1, board2) {
    for (let i = 0; i < board1.length; i++) {
      for (let j = 0; j < board1[i].length; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    const copy = this.board.map((row) => [...row]);

    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];

      let filtered = row.filter((cell) => cell !== 0);

      for (let j = 0; j < filtered.length - 1; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] = filtered[j] * 2;
          filtered[j + 1] = 0;
          this.score += filtered[j];
        }
      }

      filtered = filtered.filter((cell) => cell !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }

      this.board[i] = filtered;
    }

    if (!this.boardsAreEqual(this.board, copy)) {
      this.addRandom();
    }
  }

  moveRight() {
    const copy = this.board.map((row) => [...row]);

    for (let i = 0; i < this.board.length; i++) {
      const notReversed = this.board[i];
      const row = [...notReversed].reverse();

      let filtered = row.filter((cell) => cell !== 0);

      for (let j = 0; j < filtered.length - 1; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] = filtered[j] * 2;
          filtered[j + 1] = 0;
          this.score += filtered[j];
        }
      }

      filtered = filtered.filter((cell) => cell !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }

      this.board[i] = filtered.reverse();
    }

    if (!this.boardsAreEqual(this.board, copy)) {
      this.addRandom();
    }
  }

  moveUp() {
    const copy = this.board.map((row) => [...row]);

    for (let colIndex = 0; colIndex < this.board[0].length; colIndex++) {
      const column = [];

      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
        column.push(this.board[rowIndex][colIndex]);
      }

      let filtered = column.filter((cell) => cell !== 0);

      for (let j = 0; j < filtered.length - 1; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] = filtered[j] * 2;
          filtered[j + 1] = 0;
          this.score += filtered[j];
        }
      }

      filtered = filtered.filter((cell) => cell !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }

      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
        this.board[rowIndex][colIndex] = filtered[rowIndex];
      }
    }

    if (!this.boardsAreEqual(this.board, copy)) {
      this.addRandom();
    }
  }

  moveDown() {
    const copy = this.board.map((row) => [...row]);

    for (let colIndex = 0; colIndex < this.board[0].length; colIndex++) {
      const column = [];

      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
        column.push(this.board[rowIndex][colIndex]);
      }

      const reversed = [...column].reverse();

      let filtered = reversed.filter((cell) => cell !== 0);

      for (let j = 0; j < filtered.length - 1; j++) {
        if (filtered[j] === filtered[j + 1]) {
          filtered[j] = filtered[j] * 2;
          filtered[j + 1] = 0;
          this.score += filtered[j];
        }
      }

      filtered = filtered.filter((cell) => cell !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }

      filtered = filtered.reverse();

      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
        this.board[rowIndex][colIndex] = filtered[rowIndex];
      }
    }

    if (!this.boardsAreEqual(this.board, copy)) {
      this.addRandom();
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
  addRandom = () => {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCellIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomCellIndex];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  };

  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.status = 'playing';

    this.addRandom();
    this.addRandom();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  updateStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    for (const row of this.board) {
      if (row.includes(0)) {
        this.status = 'playing';

        return;
      }
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (j > 0 && this.board[i][j] === this.board[i][j - 1]) {
          this.status = 'playing';

          return;
        }

        if (
          j < this.board[i].length - 1 &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          this.status = 'playing';

          return;
        }

        if (i > 0 && this.board[i][j] === this.board[i - 1][j]) {
          this.status = 'playing';

          return;
        }

        if (
          i < this.board.length - 1 &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }

  // Add your own methods here
}

module.exports = Game;
