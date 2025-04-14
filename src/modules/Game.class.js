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
    this.board =
      initialState ||
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    this.score = 0; // Pontuação inicial
    this.status = 'idle'; // Status inicial do jogo
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    const newBoard = this.board.map((row) => this.mergeRow(row));

    if (this.hasChanged(newBoard)) {
      this.board = newBoard;
      this.spawnNumber();
      this.checkGameState();
    }
  }

  moveRight() {
    const newBoard = this.board.map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.mergeRow(row.reverse()).reverse());

    if (this.hasChanged(newBoard)) {
      this.board = newBoard;
      this.spawnNumber();
      this.checkGameState();
    }
  }

  moveUp() {
    const newBoard = this.transpose(this.board).map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.mergeRow(row));

    if (this.hasChanged(newBoard)) {
      this.board = this.transpose(newBoard);
      this.spawnNumber();
      this.checkGameState();
    }
  }

  moveDown() {
    const newBoard = this.transpose(this.board).map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.mergeRow(row.reverse()).reverse());

    if (this.hasChanged(newBoard)) {
      this.board = this.transpose(newBoard);
      this.spawnNumber();
      this.checkGameState();
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
    this.board = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.spawnNumber();
    this.spawnNumber();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle'; // Status inicial do jogo
  }

  // Add your own methods here
  spawnNumber() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  mergeRow(row) {
    const filteredRow = row.filter((val) => val !== 0);
    const mergedRow = [];
    let skip = false;

    for (let i = 0; i < filteredRow.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (i < filteredRow.length - 1 && filteredRow[i] === filteredRow[i + 1]) {
        mergedRow.push(filteredRow[i] * 2);
        this.score += filteredRow[i] * 2;
        skip = true;
      } else {
        mergedRow.push(filteredRow[i]);
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  // Transpose the board
  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  // Check if has changed
  hasChanged(newBoard) {
    return JSON.stringify(this.board) !== JSON.stringify(newBoard);
  }

  // Win or Lose
  checkGameState() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  // Check if any move is possible
  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
