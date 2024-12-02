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
    console.log(initialState);

    // Ініціалізуємо гральну дошку
    this.defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = initialState || JSON.parse(JSON.stringify(this.defaultState));
    this.score = 0; // Початкови рахунок
    this.status = 'idle'; // Початковий статус гри
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  moveLeft() {
    let changeBoard = false;

    for (let i = 0; i < 4; i++) {
      let newRow = this.board[i].filter((value) => value !== 0);

      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow[j + 1] = 0;
          changeBoard = true;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (!this.arraysEqual(this.board[i], newRow)) {
        changeBoard = true;
      }

      this.board[i] = newRow;
    }

    if (this.status === 'playing' && changeBoard) {
      this.addRandomTile();
    }
  }
  moveRight() {
    let changeBoard = false;

    for (let i = 0; i < 4; i++) {
      let newRow = this.board[i]
        .slice()
        .reverse()
        .filter((value) => value !== 0);

      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow[j + 1] = 0;
          changeBoard = true;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      newRow.reverse();

      if (!this.arraysEqual(this.board[i], newRow)) {
        changeBoard = true;
      }

      this.board[i] = newRow;
    }

    if (this.status === 'playing' && changeBoard) {
      this.addRandomTile();
    }
  }
  moveUp() {
    let changeBoard = false;

    for (let col = 0; col < 4; col++) {
      let newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol[i + 1] = 0;
          changeBoard = true;
        }
      }

      newCol = newCol.filter((value) => value !== 0);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      if (
        !this.arraysEqual(
          this.board.map((row) => row[col]),
          newCol,
        )
      ) {
        changeBoard = true;
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[row];
      }
    }

    if (this.status === 'playing' && changeBoard) {
      this.addRandomTile();
    }
  }

  moveDown() {
    let changeBoard = false;

    for (let col = 0; col < 4; col++) {
      let newCol = [];

      newCol.reverse();

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol[i + 1] = 0;
          changeBoard = true;
        }
      }
      newCol = newCol.filter((value) => value !== 0);
      newCol.reverse();

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[3 - row];
      }
    }

    if (this.status === 'playing' && changeBoard) {
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
    if (this.status === 'idle') {
      return 'idle';
    }

    if (this.checkWin()) {
      return 'win';
    }

    if (this.checkLose()) {
      return 'lose';
    }

    return 'playing';
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (j < 3 && this.board[i][j] === this.board[i][j + 1]) ||
          (i < 3 && this.board[i][j] === this.board[i + 1][j])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = JSON.parse(JSON.stringify(this.defaultState));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    return this.start();
  }

  // Add your own methods here
}

module.exports = Game;
