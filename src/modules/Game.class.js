/* eslint-disable function-paren-newline */
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
    if (initialState) {
      this.board = initialState;
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.score = 0;
    this.isStarted = false;
  }

  moveLeft() {
    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((cell) => cell !== 0);

      for (let cell = 0; cell < newRow.length - 1; cell++) {
        if (newRow[cell] === newRow[cell + 1]) {
          newRow[cell] = newRow[cell] + newRow[cell + 1];
          newRow[cell + 1] = 0;
          cell++;
          this.score += newRow[cell];
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[row] = newRow;
    }
  }
  moveRight() {
    for (let row = 0; row < 4; row++) {
      this.board[row] = this.board[row].reverse();

      this.moveLeft();

      this.board[row] = this.board[row].reverse();
    }
  }
  moveUp() {
    this.board = this.transpose(this.board);

    this.moveLeft();

    this.board = this.transpose(this.board);
  }
  moveDown() {
    this.board = this.transpose(this.board);

    this.moveRight();

    this.board = this.transpose(this.board);
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
    // when you started play
    if (!this.isStarted) {
      return 'idle';
    }

    // check for win
    if (this.board.some((row) => row.some((cell) => cell === 2048))) {
      return 'win';
    }

    // check for lose
    const emptyCells = this.board.some((row) => row.some((cell) => cell === 0));

    const canMerge = this.board.some((row, rowIndex) =>
      row.some((cell, cellINdex) => {
        const right =
          cellINdex < 3 && this.board[rowIndex][cellINdex + 1] === cell;
        const down =
          rowIndex < 3 && this.board[rowIndex + 1][cellINdex] === cell;

        return right || down;
      }),
    );

    if (!emptyCells && !canMerge) {
      return 'lose';
    }

    // for playing
    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';

    this.randomPlace();
    this.randomPlace();
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

    this.randomPlace();
    this.randomPlace();

    this.score = 0;

    this.status = 'playing';
  }

  // Add your own methods here

  transpose(matrix) {
    return matrix[0].map((_, index) => matrix.map((row) => row[index]));
  }

  randomPlace() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.board[row][column] === 0) {
          emptyCells.push([row][column]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomColumn] = emptyCells[randomIndex];

    this.board[randomRow][randomColumn] = Math.random() < 0.9 ? 2 : 4;
  }
}

module.exports = Game;
