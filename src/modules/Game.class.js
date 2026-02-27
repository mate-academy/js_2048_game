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

    this.score = 0;
    this.status = 'idle'; // игра еще не начата
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      let row = this.board[r];

      row = row.filter((num) => num !== 0);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] = row[i] * 2;

          if (row[i] === 2048) {
            this.status = 'win';
          }

          this.score += row[i];
          row[i + 1] = 0;
        }
      }

      row = row.filter((num) => num !== 0);

      while (row.length < 4) {
        row.push(0);
      }
      this.board[r] = row;
    }

    const newBoard = JSON.stringify(this.board);

    if (newBoard !== oldBoard) {
      this.addRandomTile();
    }

    this.checkGameOver();
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
    this.transpose();
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
    this.status = 'playing';
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
    // eslint-disable-next-line no-console
    // console.log(this.board);
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      for (
        let cellIndex = 0;
        cellIndex < this.board[rowIndex].length;
        cellIndex++
      ) {
        if (this.board[rowIndex][cellIndex] === 0) {
          emptyCells.push({ r: rowIndex, c: cellIndex });
        }
      }
    }

    if (emptyCells.length !== 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { r, c } = emptyCells[randomIndex];
      const value = Math.random() < 0.9 ? 2 : 4;

      this.board[r][c] = value;
    }
  }

  transpose() {
    const size = 4;
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        newBoard[c][r] = this.board[r][c];
      }
    }

    this.board = newBoard;
  }

  checkGameOver() {
    const someZero = this.board.some((row) => row.includes(0));

    if (someZero) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return;
        }
      }
    }

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
