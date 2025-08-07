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
    this.size = 4; // Default board size
    this.score = 0;
    this.status = 'idle'; // Game status: 'idle', 'playing', 'win', 'lose'

    this.board = initialState || this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return; // Cannot move if the game is not in progress
    }

    const oldBoard = JSON.stringify(this.board);
    const newBoard = [];

    for (const row of this.board) {
      let newRow = this.compressRow(row);

      newRow = this.mergeRow(newRow);
      newRow = this.compressRow(newRow);
      newBoard.push(newRow);
    }

    const boardChanged = JSON.stringify(newBoard) !== oldBoard;

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose'; // No moves left, game over
      }
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return; // Cannot move if the game is not in progress
    }

    const oldBoard = JSON.stringify(this.board);
    const newBoard = [];

    for (const row of this.board) {
      let reversedRow = [...row].reverse();

      reversedRow = this.compressRow(reversedRow);
      reversedRow = this.mergeRow(reversedRow);
      reversedRow = this.compressRow(reversedRow);
      newBoard.push(reversedRow.reverse());
    }

    const boardChanged = JSON.stringify(newBoard) !== oldBoard;

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose'; // No moves left, game over
      }
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);
    const newBoard = this.createEmptyBoard();

    for (let col = 0; col < this.size; col++) {
      let column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      column = this.compressRow(column);
      column = this.mergeRow(column);
      column = this.compressRow(column);

      for (let row = 0; row < this.size; row++) {
        newBoard[row][col] = column[row];
      }
    }

    const boardChanged = JSON.stringify(newBoard) !== oldBoard;

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      }
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return; // Cannot move if the game is not in progress
    }

    const oldBoard = JSON.stringify(this.board);
    const newBoard = this.createEmptyBoard();

    for (let col = 0; col < this.size; col++) {
      let column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      column.reverse();
      column = this.compressRow(column);
      column = this.mergeRow(column);
      column = this.compressRow(column);
      column.reverse();

      for (let row = 0; row < this.size; row++) {
        newBoard[row][col] = column[row];
      }
    }

    const boardChanged = JSON.stringify(newBoard) !== oldBoard;

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose'; // No moves left, game over
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return; // no empty cells
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4; // 90% for 2, 10% for 4
  }

  compressRow(row) {
    const nonZero = row.filter((value) => value !== 0);
    const zeros = Array(this.size - nonZero.length).fill(0);

    return nonZero.concat(zeros);
  }

  mergeRow(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];

        if (row[i] === 2048) {
          this.status = 'win'; // Player has won the game
        }
      }
    }

    return row;
  }

  isGameOver() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return false; // There are still empty cells
        }

        if (
          col < this.size - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return false; // Horizontal merge possible
        }

        if (
          row < this.size - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return false; // Vertical merge possible
        }
      }
    }

    return true; // No moves left, game over
  }
}

export default Game;
