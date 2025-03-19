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
  constructor(initialState = null) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    if (this.getStatus() === 'playing') {
      let moved = false;

      for (let row = 0; row < this.board.length; row++) {
        let newRow = this.board[row].filter((tile) => tile !== 0);

        for (let col = 0; col < newRow.length - 1; col++) {
          if (newRow[col] !== 0 && newRow[col] === newRow[col + 1]) {
            newRow[col] *= 2;
            newRow[col + 1] = 0;
            this.score += newRow[col];
            moved = true;
          }
        }
        newRow = newRow.filter((tile) => tile !== 0);

        while (newRow.length < this.board[row].length) {
          newRow.push(0);
        }

        if (this.board[row].toString() !== newRow.toString()) {
          moved = true;
        }
        this.board[row] = newRow;
      }

      if (moved) {
        this.createRandomTile();
        this.checkGameStatus();
      }

      return moved;
    }
  }

  moveRight() {
    if (this.getStatus() === 'playing') {
      this.board = this.board.map((row) => row.reverse());
      this.moveLeft();
      this.board = this.board.map((row) => row.reverse());
    }
  }
  moveUp() {
    if (this.getStatus() === 'playing') {
      this.transposeBoard();
      this.moveLeft();
      this.transposeBoard();
    }
  }
  moveDown() {
    if (this.getStatus() === 'playing') {
      this.transposeBoard();
      this.moveRight();
      this.transposeBoard();
    }
  }

  transposeBoard() {
    this.board = this.board[0].map((_, colIndex) =>
      // eslint-disable-next-line prettier/prettier
      this.board.map((row) => row[colIndex]));

    return this.board;
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

  initGame() {
    this.board = this.createEmptyBoard();
    this.createRandomTile();
    this.createRandomTile();
    this.status = 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.initGame();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  randomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  generateCellValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  createRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    this.board.forEach((row, rowIndex) => {
      // eslint-disable-next-line no-shadow
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, cellIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = this.randomNumber(emptyCells.length - 1);
    const { rowIndex, cellIndex } = emptyCells[randomIndex];

    const newBoard = this.board.map((row) => row.slice());

    newBoard[rowIndex][cellIndex] = this.generateCellValue();
    this.board = newBoard;
  }

  checkGameStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    for (const row of this.board) {
      if (row.includes(0)) {
        return;
      }
    }

    if (!this.canMakeMove()) {
      this.status = 'lose';
    }
  }

  canMakeMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        if (
          (this.board[row][col] === this.board[row][col + 1] &&
            this.board[row][col] !== 0) ||
          (this.board[row][col] !== 0 && this.hasMergeableTilesInRow(row))
        ) {
          return true;
        }
      }
    }

    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size - 1; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  hasMergeableTilesInRow(row) {
    const filteredRow = this.board[row].filter((value) => value !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        return true;
      }
    }

    return false;
  }

  hasMergeableTilesInColumn(col) {
    const filteredCol = this.board.map((row) =>
      // eslint-disable-next-line prettier/prettier
      row[col].filter((val) => val !== 0));

    for (let i = 0; i < filteredCol.length - 1; i++) {
      if (filteredCol[i] === filteredCol[i + 1]) {
        return true;
      }
    }

    return false;
  }
}

module.exports = Game;
