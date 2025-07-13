'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  status = 'idle';
  rows = 4;
  columns = 4;

  /**
   * Creates a new game instance.
   *
   * @param {number[][]} board
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

  constructor(board) {
    // eslint-disable-next-line no-console
    console.log(board);
  }

  moveLeft() {
    let row;

    for (let r = 0; r < this.rows; r++) {
      row = this.board[r];
      row = this.move(row);
      this.board[r] = row;
    }
  }
  moveRight() {
    let row;

    for (let r = 0; r < this.rows; r++) {
      row = this.board[r];
      row.reverse();
      row = this.move(row);
      row.reverse();
      this.board[r] = row;
    }
  }
  moveUp() {
    for (let c = 0; c < this.columns; c++) {
      const column = [];

      for (let r = 0; r < this.rows; r++) {
        column.push(this.board[r][c]);
      }

      const newColumn = this.move(column);

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = newColumn[r];
      }
    }
  }
  moveDown() {
    for (let c = 0; c < this.columns; c++) {
      const column = [];

      for (let r = 0; r < this.rows; r++) {
        column.push(this.board[r][c]);
      }

      column.reverse();

      const newColumn = this.move(column);

      newColumn.reverse();

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = newColumn[r];
      }
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
  start() {
    this.generateRandom();
    this.generateRandom();
    this.status = 'playing';
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
    this.start();
  }

  move(inputRow) {
    let row = inputRow;

    row = this.filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
        i++;
      }
    }

    row = this.filterZero(row);

    while (row.length < this.columns) {
      row.push(0);
    }

    return row;
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  generateRandom() {
    const options = [
      { value: 2, probability: 0.9 },
      { value: 4, probability: 0.1 },
    ];

    const randomValue = Math.random();
    let cumulativeProbability = 0;
    let value = 0;

    // take a random value
    for (const option of options) {
      cumulativeProbability += option.probability;

      if (randomValue <= cumulativeProbability) {
        value = option.value;
        break;
      }
    }

    // replace random 0 with this value
    while (true) {
      const randomRow = Math.floor(Math.random() * this.board.length);
      const randomCol = Math.floor(
        Math.random() * this.board[randomRow].length,
      );

      if (this.board[randomRow][randomCol] === 0) {
        this.board[randomRow][randomCol] = value;
        break;
      }
    }
  }

  isAvailableMove() {
    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board.length; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (
          c < this.board.length - 1 &&
          this.board[r][c] === this.board[r][c + 1]
        ) {
          return true;
        }

        if (
          r < this.board.length - 1 &&
          this.board[r][c] === this.board[r + 1][c]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  isWin() {
    return this.board.some((row) => row.some((value) => value === 2048));
  }
}

module.exports = Game;
