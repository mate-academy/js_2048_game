'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  score = 0;
  status = 'idle';
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
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
    if (initialState) {
      this.initialState = initialState.map((row) => [...row]);
      this.board = initialState;
    }
  }

  moveLeft() {
    if (this.status === 'idle') {
      return;
    }

    const newState = [];
    const currectScore = this.score;

    for (const row of this.board) {
      const newRow = row.filter((cell) => cell !== 0);

      for (let i = 1; i < newRow.length; i++) {
        if (newRow[i] === newRow[i - 1]) {
          const sum = newRow[i] + newRow[i - 1];

          this.score += sum;
          newRow.splice(i - 1, 2, sum);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      newState.push(newRow);
    }

    if (this.deepEqualBoards(newState, this.board) === true) {
      return;
    }

    this.board = newState;

    if (this.checkWin()) {
      this.status = 'win';
    }

    if (!this.checkAvailableMoves()) {
      this.status = 'lose';
    }

    if (
      currectScore === this.score &&
      this.getEmptyCells().length === 0 &&
      this.checkAvailableMoves() === false
    ) {
      this.status = 'lose';

      return;
    }

    this.setRandomNumberOnCell();
  }

  moveRight() {
    if (this.status === 'idle') {
      return;
    }

    const newState = [];
    const currectScore = this.score;

    for (const row of this.board) {
      const newRow = row.filter((cell) => cell !== 0);

      for (let i = newRow.length - 2; i >= 0; i--) {
        if (newRow[i] === newRow[i + 1]) {
          const sum = newRow[i] + newRow[i + 1];

          this.score += sum;
          newRow.splice(i, 2, sum);
          i--;
        }
      }

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      newState.push(newRow);
    }

    if (this.deepEqualBoards(newState, this.board) === true) {
      return;
    }

    this.board = newState;

    if (this.checkWin()) {
      this.status = 'win';
    }

    if (this.checkAvailableMoves() === false) {
      this.status = 'lose';
    }

    if (
      currectScore === this.score &&
      this.getEmptyCells().length === 0 &&
      this.checkAvailableMoves() === false
    ) {
      this.status = 'lose';

      return;
    }

    this.setRandomNumberOnCell();
  }

  moveUp() {
    if (this.status === 'idle') {
      return;
    }

    const currectScore = this.score;
    const columns = Array.from({ length: 4 }, () => []);
    const newState = Array.from({ length: 4 }, () => []);
    const newStateColumns = [];

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        columns[col].push(this.board[row][col]);
      }
    }

    for (const col of columns) {
      const newCol = col.filter((cell) => cell !== 0);

      for (let i = 1; i < newCol.length; i++) {
        if (newCol[i] === newCol[i - 1]) {
          const sum = newCol[i] + newCol[i - 1];

          this.score += sum;
          newCol.splice(i - 1, 2, sum);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      newStateColumns.push(newCol);
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newState[row].push(newStateColumns[col][row]);
      }
    }

    if (this.deepEqualBoards(newState, this.board) === true) {
      return;
    }

    this.board = newState;

    if (this.checkWin()) {
      this.status = 'win';
    }

    if (!this.checkAvailableMoves()) {
      this.status = 'lose';
    }

    if (
      currectScore === this.score &&
      this.getEmptyCells().length === 0 &&
      this.checkAvailableMoves() === false
    ) {
      this.status = 'lose';

      return;
    }

    this.setRandomNumberOnCell();
  }

  moveDown() {
    if (this.status === 'idle') {
      return;
    }

    const currectScore = this.score;
    const columns = Array.from({ length: 4 }, () => []);
    const newState = Array.from({ length: 4 }, () => []);
    const newStateColumns = [];

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        columns[col].push(this.board[row][col]);
      }
    }

    for (const col of columns) {
      const newCol = col.filter((cell) => cell !== 0);

      for (let i = newCol.length - 2; i >= 0; i--) {
        if (newCol[i] === newCol[i + 1]) {
          const sum = newCol[i] + newCol[i + 1];

          this.score += sum;
          newCol.splice(i, 2, sum);

          i--;
        }
      }

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      newStateColumns.push(newCol);
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newState[row].push(newStateColumns[col][row]);
      }
    }

    if (this.deepEqualBoards(newState, this.board) === true) {
      return;
    }

    this.board = newState;

    if (this.checkWin()) {
      this.status = 'win';
    }

    if (
      currectScore === this.score &&
      this.getEmptyCells().length === 0 &&
      this.checkAvailableMoves() === false
    ) {
      this.status = 'lose';

      return;
    }

    this.setRandomNumberOnCell();
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
    if (this.status !== 'playing') {
      this.setRandomNumberOnCell();
      this.status = 'playing';
    } else {
      this.board = this.initialState || [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      this.setRandomNumberOnCell();
      this.setRandomNumberOnCell();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;

    this.board = this.initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    if (this.initialState) {
      this.status = 'idle';

      return;
    }

    this.status = 'idle';
    this.setRandomNumberOnCell();
    this.status = 'playing';
  }

  setRandomNumberOnCell() {
    const emptyCells = this.getEmptyCells();

    if (this.status === 'idle' && emptyCells.length >= 2) {
      const indexEmptyCell1 = Math.floor(Math.random() * emptyCells.length);
      let indexEmptyCell2;

      do {
        indexEmptyCell2 = Math.floor(Math.random() * emptyCells.length);
      } while (indexEmptyCell1 === indexEmptyCell2);

      this.board[emptyCells[indexEmptyCell1].row][
        emptyCells[indexEmptyCell1].col
      ] = Math.random() <= 0.1 ? 4 : 2;

      this.board[emptyCells[indexEmptyCell2].row][
        emptyCells[indexEmptyCell2].col
      ] = Math.random() <= 0.1 ? 4 : 2;
    } else if (emptyCells.length >= 1) {
      const indexEmptyCell = Math.floor(Math.random() * emptyCells.length);

      this.board[emptyCells[indexEmptyCell].row][
        emptyCells[indexEmptyCell].col
      ] = Math.random() <= 0.1 ? 4 : 2;
    }
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  checkAvailableMoves() {
    let canMerge = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          canMerge = true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          canMerge = true;
        }
      }
    }

    return canMerge;
  }

  checkWin() {
    let gameWin = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          gameWin = true;
          this.status = 'win';
        }
      }
    }

    return gameWin;
  }

  deepEqualBoards(board1, board2) {
    return board1.every((row, rowIndex) =>
      // eslint-disable-next-line prettier/prettier
      row.every((cell, colIndex) => cell === board2[rowIndex][colIndex]));
  }
}

module.exports = Game;
