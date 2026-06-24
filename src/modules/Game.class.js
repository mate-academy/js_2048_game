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
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : null;

    this.board = this.initialState
      ? this.initialState.map((row) => [...row])
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const originalBoard = this.board.map((row) => [...row]);
    const scoreRef = { value: 0 };
    const newBoard = this.board.map((row) => this.slideLeft(row, scoreRef));

    if (!this.boardsEqual(originalBoard, newBoard)) {
      this.board = newBoard;
      this.score += scoreRef.value;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const originalBoard = this.board.map((row) => [...row]);
    const scoreRef = { value: 0 };
    const newBoard = this.board.map((row) => {
      const reversedRow = [...row].reverse();
      const slidRow = this.slideLeft(reversedRow, scoreRef);

      return slidRow.reverse();
    });

    if (!this.boardsEqual(originalBoard, newBoard)) {
      this.board = newBoard;
      this.score += scoreRef.value;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const originalBoard = this.board.map((row) => [...row]);
    const scoreRef = { value: 0 };
    const transposed = this.transpose(this.board);
    const slid = transposed.map((row) => this.slideLeft(row, scoreRef));
    const newBoard = this.transpose(slid);

    if (!this.boardsEqual(originalBoard, newBoard)) {
      this.board = newBoard;
      this.score += scoreRef.value;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const originalBoard = this.board.map((row) => [...row]);
    const scoreRef = { value: 0 };
    const transposed = this.transpose(this.board);
    const rev = transposed.map((row) => [...row].reverse());
    const slid = rev.map((row) => this.slideLeft(row, scoreRef));
    const restored = slid.map((row) => row.reverse());
    const newBoard = this.transpose(restored);

    if (!this.boardsEqual(originalBoard, newBoard)) {
      this.board = newBoard;
      this.score += scoreRef.value;
      this.addRandomTile();
      this.checkGameStatus();
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
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.checkGameStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState
      ? this.initialState.map((row) => [...row])
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  // Add helper methods here
  addRandomTile() {
    const emptyCells = [];

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      for (let colIdx = 0; colIdx < 4; colIdx++) {
        if (this.board[rowIdx][colIdx] === 0) {
          emptyCells.push({ r: rowIdx, c: colIdx });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  slideLeft(row, scoreRef) {
    const nonZeros = row.filter((val) => val !== 0);
    const nextRow = [];
    let scoreGain = 0;

    for (let i = 0; i < nonZeros.length; i++) {
      if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
        const mergedVal = nonZeros[i] * 2;

        nextRow.push(mergedVal);
        scoreGain += mergedVal;
        i++;
      } else {
        nextRow.push(nonZeros[i]);
      }
    }

    while (nextRow.length < 4) {
      nextRow.push(0);
    }

    scoreRef.value += scoreGain;

    return nextRow;
  }

  transpose(matrix) {
    const size = matrix.length;
    const result = Array.from({ length: size }, () => Array(size).fill(0));

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        result[c][r] = matrix[r][c];
      }
    }

    return result;
  }

  boardsEqual(boardA, boardB) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (boardA[r][c] !== boardB[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  checkGameStatus() {
    // 1. Check for win: 2048 tile
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // 2. Check for empty cells
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          this.status = 'playing';

          return;
        }
      }
    }

    // 3. Check for adjacent equal values horizontally
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          this.status = 'playing';

          return;
        }
      }
    }

    // 4. Check for adjacent equal values vertically
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          this.status = 'playing';

          return;
        }
      }
    }

    // If no moves are possible
    this.status = 'lose';
  }
}

module.exports = Game;
