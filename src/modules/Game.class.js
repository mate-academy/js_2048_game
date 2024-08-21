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
    this.boardSize = 4;
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
    // eslint-disable-next-line no-console
    // console.log(initialState);
  }

  createEmptyBoard() {
    const board = [];

    for (let i = 0; i < this.boardSize; i++) {
      board.push(new Array(this.boardSize).fill(0));
    }

    return board;
  }

  // createEmptyBoard() {
  //   return Array.from({ length: this.boardSize }, () =>
  //     Array(this.boardSize).fill(0));
  // }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < this.boardSize; row++) {
      const newRow = this.compressRow(this.board[row]);

      if (this.board[row].toString() !== newRow.toString()) {
        moved = true;
        this.board[row] = newRow;
      }
    }

    if (moved) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      } else if (this.isWin()) {
        this.status = 'win';
      }
    }
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
    this.moveRight();
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
    if (this.status === 'idle') {
      this.score = 0;
      this.status = 'playing';
      this.board = this.createEmptyBoard();
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle'; // Возвращаем статус в начальное состояние
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.start(); // Перезапуск игры
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { x, y } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  compressRow(row) {
    let newRow = row.filter((num) => num !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }
    newRow = newRow.filter((num) => num !== 0);

    while (newRow.length < this.boardSize) {
      newRow.push(0);
    }

    return newRow;
  }

  transpose() {
    const transposed = this.createEmptyBoard();

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        transposed[i][j] = this.board[j][i];
      }
    }
    this.board = transposed;
  }

  isWin() {
    return this.board.flat().includes(2048);
  }

  isGameOver() {
    if (this.board.flat().includes(0)) {
      return false;
    }

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize - 1; j++) {
        if (
          this.board[i][j] === this.board[i][j + 1] ||
          this.board[j][i] === this.board[j + 1][i]
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
