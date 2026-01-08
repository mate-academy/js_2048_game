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
    this.score = 0;
    this.status = 'idle';
    this.board = JSON.parse(JSON.stringify(initialState));

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  _processRow(row) {
    if (this.status !== 'playing') {
      return;
    }

    const filterArray = [];

    for (let i = 0; i < row.length; i++) {
      if (row[i] !== 0) {
        filterArray.push(row[i]);
      }
    }

    const mergeArray = [];

    for (let i = 0; i < filterArray.length; i++) {
      if (filterArray.length === 0) {
        break;
      }

      if (i < filterArray.length - 1 && filterArray[i] === filterArray[i + 1]) {
        const doubled = filterArray[i] * 2;

        mergeArray.push(doubled);
        i = i + 1;
        this.score += doubled;
      } else {
        mergeArray.push(filterArray[i]);
      }
    }

    while (mergeArray.length < 4) {
      mergeArray.push(0);
    }

    return mergeArray;
  }

  _transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  _spawn() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, column: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const newNumber = Math.random() > 0.9 ? 4 : 2;

    this.board[randomCell.row][randomCell.column] = newNumber;
  }

  moveLeft() {
    const initialBoardString = JSON.stringify(this.board);

    this.board = this.board.map((array) => {
      return this._processRow(array);
    });

    const endBoardString = JSON.stringify(this.board);

    if (initialBoardString !== endBoardString) {
      this._spawn();
    }
  }
  moveRight() {
    const initialBoardString = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const reversedRow = [...row].reverse();

      return [...this._processRow(reversedRow)].reverse();
    });

    const endBoardString = JSON.stringify(this.board);

    if (initialBoardString !== endBoardString) {
      this._spawn();
    }
  }
  moveUp() {
    const initialBoardString = JSON.stringify(this.board);

    this.board = this._transpose(this.board);

    this.board = this.board.map((array) => {
      return this._processRow(array);
    });
    this.board = this._transpose(this.board);

    const endBoardString = JSON.stringify(this.board);

    if (initialBoardString !== endBoardString) {
      this._spawn();
    }
  }
  moveDown() {
    const initialBoardString = JSON.stringify(this.board);

    this.board = this._transpose(this.board);

    this.board = this.board.map((row) => {
      const reversedRow = [...row].reverse();

      return [...this._processRow(reversedRow)].reverse();
    });
    this.board = this._transpose(this.board);

    const endBoardString = JSON.stringify(this.board);

    if (initialBoardString !== endBoardString) {
      this._spawn();
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

    const hasWin = this.board.find((row) => {
      return row.find((cell) => cell === 2048);
    });

    if (hasWin) {
      this.status = 'win';

      return 'win';
    }

    const hasEmptyCell = this.board.some((row) => row.includes(0));

    if (hasEmptyCell) {
      this.status = 'playing';

      return 'playing';
    }

    for (let r = 0; r < this.board.length; r++) {
      const row = this.board[r];

      for (let c = 0; c < row.length; c++) {
        const cell = row[c];

        if (c < row.length - 1 && cell === row[c + 1]) {
          this.status = 'playing';

          return 'playing';
        }

        if (r < this.board.length - 1 && cell === this.board[r + 1][c]) {
          this.status = 'playing';

          return 'playing';
        }
      }
    }
    this.status = 'lose';

    return 'lose';
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this._spawn();
    this._spawn();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
