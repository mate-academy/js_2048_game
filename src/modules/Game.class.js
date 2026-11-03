/* eslint-disable prettier/prettier */
/* eslint-disable function-paren-newline */
/* eslint-disable comma-dangle */
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
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);

    this.board = this.board.map((row) => this.mergeRow(row));

    const hasChanged = this.board.some((row, rowIndex) =>
      row.some((cell, colIndex) => cell !== oldBoard[rowIndex][colIndex]),);

    if (hasChanged) {
      this.checkWin();

      if (this.status === 'playing') {
        this.addRandomTile();
      }
    }

    if (this.status === 'playing') {
      this.checkLose();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);

    this.board = this.board.map((row) => {
      const reversedRow = [...row].reverse();

      const mergedRow = this.mergeRow(reversedRow);

      return mergedRow.reverse();
    });

    const hasChanged = this.board.some((row, rowIndex) =>
      row.some((cell, colIndex) => cell !== oldBoard[rowIndex][colIndex]),
    );

    if (hasChanged) {
      this.checkWin();

      if (this.status === 'playing') {
        this.addRandomTile();
      }
    }

    if (this.status === 'playing') {
      this.checkLose();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = this.board.map((row) => row[col]);

      const mergedColumn = this.mergeRow(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = mergedColumn[row];
      }
    }

    const hasChanged = this.board.some((row, rowIndex) =>
      row.some((cell, colIndex) => cell !== oldBoard[rowIndex][colIndex]),
    );

    if (hasChanged) {
      this.checkWin();

      if (this.status === 'playing') {
        this.addRandomTile();
      }
    }

    if (this.status === 'playing') {
      this.checkLose();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = this.board.map((row) => row[col]);

      const reversedColumn = column.reverse();
      const mergedColumn = this.mergeRow(reversedColumn).reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = mergedColumn[row];
      }
    }

    const hasChanged = this.board.some((row, rowIndex) =>
      row.some((cell, colIndex) => cell !== oldBoard[rowIndex][colIndex]));

    if (hasChanged) {
      this.checkWin();

      if (this.status === 'playing') {
        this.addRandomTile();
      }
    }

    if (this.status === 'playing') {
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    if (this.board.flat().every((cell) => cell === 0)) {
      this.addRandomTile();
      this.addRandomTile();
    }

    this.checkWin();

    if (this.status === 'playing') {
      this.checkLose();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let row = 0; row < 4; row++) {
      // eslint-disable-next-line no-shadow
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [row, col] = emptyCells[randomIndex];

    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = value;
  }

  mergeRow(row) {
    const filteredRow = row.filter((cell) => cell !== 0);
    const mergedRow = [];

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        const mergedValue = filteredRow[i] * 2;

        mergedRow.push(mergedValue);
        this.score += mergedValue;

        i++;
      } else {
        mergedRow.push(filteredRow[i]);
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  checkWin() {
    const has2048 = this.board.some((row) => row.some((cell) => cell === 2048));

    if (has2048) {
      this.status = 'win';
    }
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const currentCell = this.board[row][col];

        if (currentCell === 0) {
          return;
        }

        if (col < 3 && currentCell === this.board[row][col + 1]) {
          return;
        }

        if (row < 3 && currentCell === this.board[row + 1][col]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
