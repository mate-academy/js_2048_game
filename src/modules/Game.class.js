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
   * [0, 0, 0, 0],
   * [0, 0, 0, 0],
   * [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    const defaultBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialSnapshot = JSON.stringify(initialState || defaultBoard);
    this.board = JSON.parse(this.initialSnapshot);

    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const deskBefore = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      const row = this.board[i];
      const filteredRow = row.filter((num) => num !== 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] = filteredRow[j] * 2;
          this.score += filteredRow[j];

          if (filteredRow[j] === 2048) {
            this.status = 'win';
          }
          filteredRow.splice(j + 1, 1);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      this.board[i] = filteredRow;
    }

    const deskAfter = JSON.stringify(this.board);

    if (deskBefore !== deskAfter) {
      this.addRandomTile();
    }

    if (this.possibleMove() === false && this.status !== 'win') {
      this.status = 'lose';
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const deskBefore = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      const row = [...this.board[i]];

      row.reverse();

      const filteredRow = row.filter((num) => num !== 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] = filteredRow[j] * 2;
          this.score += filteredRow[j];

          if (filteredRow[j] === 2048) {
            this.status = 'win';
          }
          filteredRow.splice(j + 1, 1);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      this.board[i] = filteredRow.reverse();
    }

    const deskAfter = JSON.stringify(this.board);

    if (deskBefore !== deskAfter) {
      this.addRandomTile();
    }

    if (this.possibleMove() === false && this.status !== 'win') {
      this.status = 'lose';
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const deskBefore = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      const column = [
        this.board[0][i],
        this.board[1][i],
        this.board[2][i],
        this.board[3][i],
      ];

      const filteredRow = column.filter((num) => num !== 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] = filteredRow[j] * 2;
          this.score += filteredRow[j];

          if (filteredRow[j] === 2048) {
            this.status = 'win';
          }
          filteredRow.splice(j + 1, 1);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = filteredRow[j];
      }
    }

    const deskAfter = JSON.stringify(this.board);

    if (deskBefore !== deskAfter) {
      this.addRandomTile();
    }

    if (this.possibleMove() === false && this.status !== 'win') {
      this.status = 'lose';
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const deskBefore = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      const column = [
        this.board[0][i],
        this.board[1][i],
        this.board[2][i],
        this.board[3][i],
      ];

      column.reverse();

      const filteredRow = column.filter((num) => num !== 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] = filteredRow[j] * 2;
          this.score += filteredRow[j];

          if (filteredRow[j] === 2048) {
            this.status = 'win';
          }
          filteredRow.splice(j + 1, 1);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      filteredRow.reverse();

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = filteredRow[j];
      }
    }

    const deskAfter = JSON.stringify(this.board);

    if (deskBefore !== deskAfter) {
      this.addRandomTile();
    }

    if (this.possibleMove() === false && this.status !== 'win') {
      this.status = 'lose';
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

  possibleMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      const row = this.board[i];

      for (let j = 0; j < 3; j++) {
        if (row[j] === row[j + 1]) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      const column = [
        this.board[0][i],
        this.board[1][i],
        this.board[2][i],
        this.board[3][i],
      ];

      for (let j = 0; j < 3; j++) {
        if (column[j] === column[j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, column: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const newNumber = Math.random() < 0.9 ? 2 : 4;
    const randomCell = emptyCells[randomIndex];

    this.board[randomCell.row][randomCell.column] = newNumber;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.board = JSON.parse(this.initialSnapshot);
  }
}

module.exports = Game;
