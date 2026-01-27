'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

function copyBoard(board) {
  return JSON.parse(JSON.stringify(board));
}
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
    const emptyBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState ? copyBoard(initialState) : emptyBoard;
    this.board = copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = JSON.stringify(this.board);
    const newBoard = this.board.map((row) => this.processRow(row));

    this.board = newBoard;

    const isChanged = oldBoard !== JSON.stringify(newBoard);

    if (isChanged === true) {
      this.afterMove();
    }

    return isChanged;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = JSON.stringify(this.board);
    const newBoard = this.board.map((row) => {
      const reverse = [...row].reverse();
      const processed = this.processRow(reverse);

      return [...processed].reverse();
    });

    this.board = newBoard;

    const isChanged = oldBoard !== JSON.stringify(newBoard);

    if (isChanged === true) {
      this.afterMove();
    }

    return isChanged;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      const column = this.board.map((row) => row[i]);
      const processedColumn = this.processRow(column);

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = processedColumn[j];
      }
    }

    const isChanged = oldBoard !== JSON.stringify(this.board);

    if (isChanged === true) {
      this.afterMove();
    }

    return isChanged;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      const column = this.board.map((row) => row[i]);
      const reverseColumn = [...column].reverse();
      const processedColumn = this.processRow([...reverseColumn]).reverse();

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = processedColumn[j];
      }
    }

    const isChanged = oldBoard !== JSON.stringify(this.board);

    if (isChanged === true) {
      this.afterMove();
    }

    return isChanged;
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
    this.board = copyBoard(this.initialState);
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  processRow(row) {
    const numbers = row.filter((n) => n > 0);

    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const sum = numbers[i] + numbers[i + 1];

        numbers[i] = sum;
        numbers[i + 1] = 0;
        this.score += sum;
        i++;
      }
    }

    const result = numbers.filter((n) => n > 0);

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let boardRow = 0; boardRow < 4; boardRow++) {
      for (let column = 0; column < 4; column++) {
        if (this.board[boardRow][column] === 0) {
          emptyCells.push([boardRow, column]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] = emptyCells[randomIndex];

    if (Math.random() < 0.9) {
      this.board[row][col] = 2;
    } else {
      this.board[row][col] = 4;
    }
  }

  isGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.board[row][column] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        const current = this.board[row][column];

        if (column < 3 && current === this.board[row][column + 1]) {
          return false;
        }

        if (row < 3 && current === this.board[row + 1][column]) {
          return false;
        }
      }
    }

    return true;
  }

  afterMove() {
    this.addRandomTile();

    const win = this.board.some((row) => row.some((number) => number === 2048));

    if (win) {
      this.status = 'win';
    } else {
      if (this.isGameOver()) {
        this.status = 'lose';
      }
    }
  }
}

module.exports = Game;
