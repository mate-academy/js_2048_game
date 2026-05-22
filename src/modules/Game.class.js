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
    this.initialState = initialState.map((row) => [...row]);

    this.board = initialState.map((row) => [...row]);

    this.score = 0;

    this.gameStatus = 'idle';
  }

  moveLeft() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const oldBoard = structuredClone(this.board);

    this.board = this.board.map((row) => this.moveRowLeft(row));

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.gameStatus = 'win';
    }

    if (this.checkLose()) {
      this.gameStatus = 'lose';
    }
  }

  moveRight() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const oldBoard = structuredClone(this.board);

    this.board = this.board.map((row) => {
      const reversed = [...row].reverse();
      const moved = this.moveRowLeft(reversed);

      return moved.reverse();
    });

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.gameStatus = 'win';
    }

    if (this.checkLose()) {
      this.gameStatus = 'lose';
    }
  }

  moveUp() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const oldBoard = structuredClone(this.board);

    const transposed = this.transpose(this.board);

    const moved = transposed.map((row) => this.moveRowLeft(row));

    this.board = this.transpose(moved);

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.gameStatus = 'win';
    }

    if (this.checkLose()) {
      this.gameStatus = 'lose';
    }
  }

  moveDown() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const oldBoard = structuredClone(this.board);

    const transposed = this.transpose(this.board);

    const moved = transposed.map((row) => {
      const reversed = [...row].reverse();
      const movedRow = this.moveRowLeft(reversed);

      return movedRow.reverse();
    });

    this.board = this.transpose(moved);

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      this.gameStatus = 'win';
    }

    if (this.checkLose()) {
      this.gameStatus = 'lose';
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
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.gameStatus !== 'idle') {
      return;
    }

    this.gameStatus = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);

    this.score = 0;

    this.gameStatus = 'idle';

    this.start();
  }

  // Add your own methods here

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const randomCell = emptyCells[randomIndex];

    this.board[randomCell.row][randomCell.col] = Math.random() < 0.1 ? 4 : 2;
  }

  moveRowLeft(row) {
    // 1. we remove zeros
    const filteredRow = row.filter((cell) => cell !== 0);

    // 2. merge identical numbers
    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;

        this.score += filteredRow[i];

        filteredRow[i + 1] = 0;
      }
    }

    // 3. remove zeros after merge
    const mergedRow = filteredRow.filter((cell) => cell !== 0);

    // 4. add zeros on the right
    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  boardsAreEqual(board1, board2) {
    return board1.every((row, rowIndex) => {
      return row.every((cell, colIndex) => {
        return cell === board2[rowIndex][colIndex];
      });
    });
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  checkWin() {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  }

  hasEmptyCells() {
    return this.board.some((row) => row.some((cell) => cell === 0));
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (
          this.board[row][col + 1] === current ||
          this.board[row + 1]?.[col] === current
        ) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    if (this.hasEmptyCells()) {
      return false;
    }

    if (this.canMove()) {
      return false;
    }

    return true;
  }
}

module.exports = Game;
