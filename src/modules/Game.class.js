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
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));
    this.board = this.initialState.map((row) => [...row]);
  }

  moveLeft() {
    const oldBoard = this.getState();

    this.board.forEach((row, i) => {
      const newRow = row.filter((cell) => cell !== 0);

      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] = newRow[j] * 2;
          this.score += newRow[j];
          newRow[j + 1] = 0;
          j++;
        }
      }

      this.board[i] = newRow.filter((cell) => cell !== 0);

      while (this.board[i].length < 4) {
        this.board[i].push(0);
      }
    });
    this.chechGameOver();

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }
  }

  moveRight() {
    const oldBoard = this.getState();

    this.board.forEach((row, i) => {
      const newRow = row.filter((cell) => cell !== 0);

      for (let j = newRow.length - 1; j > 0; j--) {
        if (newRow[j] === newRow[j - 1]) {
          newRow[j] = newRow[j] * 2;
          this.score += newRow[j];
          newRow[j - 1] = 0;
          j--;
        }
      }
      this.board[i] = newRow.filter((cell) => cell !== 0);

      while (this.board[i].length < 4) {
        this.board[i].unshift(0);
      }
    });
    this.chechGameOver();

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }
  }

  moveUp() {
    const oldBoard = this.getState();

    for (let i = 0; i < 4; i++) {
      const col = [];

      for (let j = 0; j < 4; j++) {
        col.push(this.board[j][i]);
      }

      let newCol = col.filter((cell) => cell !== 0);

      for (let j = 0; j < newCol.length - 1; j++) {
        if (newCol[j] === newCol[j + 1]) {
          newCol[j] = newCol[j] * 2;
          this.score += newCol[j];
          newCol[j + 1] = 0;
          j++;
        }
      }

      newCol = newCol.filter((cell) => cell !== 0);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = newCol[j];
      }
    }
    this.chechGameOver();

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }
  }

  moveDown() {
    const oldBoard = this.getState();

    for (let i = 0; i < 4; i++) {
      const col = [];

      for (let j = 0; j < 4; j++) {
        col.push(this.board[j][i]);
      }

      let newCol = col.filter((cell) => cell !== 0);

      for (let j = newCol.length - 1; j > 0; j--) {
        if (newCol[j] === newCol[j - 1]) {
          newCol[j] = newCol[j] * 2;
          this.score += newCol[j];
          newCol[j - 1] = 0;
          j--;
        }
      }

      newCol = newCol.filter((cell) => cell !== 0);

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = newCol[j];
      }
    }
    this.chechGameOver();

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
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
    this.score = 0;
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.status = 'playing';
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  boardsAreEqual(board1, board2) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  addRandomTile() {
    const mas = this.getRandomTile();
    const numberRandom = Math.floor(Math.random() * mas.length);
    const number = Math.random() < 0.9 ? 2 : 4;

    this.board[mas[numberRandom].i][mas[numberRandom].j] = number;
  }

  getRandomTile() {
    const masEmpty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          masEmpty.push({ i, j });
        }
      }
    }

    return masEmpty;
  }

  chechGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }

        if (this.board[i][j] === 0) {
          return;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }
}
module.exports = Game;
