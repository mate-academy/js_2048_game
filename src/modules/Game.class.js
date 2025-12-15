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
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = this.board.map((row) => this.moveAndMergeRow(row));
    const boardChanged = this.isBoardChanged(this.board, newBoard);

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomCell();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = this.board.map((row) => {
      const reversed = [...row].reverse();

      return this.moveAndMergeRow(reversed).reverse();
    });
    const boardChanged = this.isBoardChanged(this.board, newBoard);

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomCell();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const newTransposed = transposed.map((col) => this.moveAndMergeRow(col));
    const newBoard = this.transpose(newTransposed);
    const boardChanged = this.isBoardChanged(this.board, newBoard);

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomCell();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const newTransposed = transposed.map((col) => {
      const reversed = [...col].reverse();

      return this.moveAndMergeRow(reversed).reverse();
    });
    const newBoard = this.transpose(newTransposed);
    const boardChanged = this.isBoardChanged(this.board, newBoard);

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomCell();
      this.updateStatus();
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
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  moveAndMergeRow(row) {
    // Remove zeros
    const filtered = row.filter((cell) => cell !== 0);
    const merged = [];
    let i = 0;

    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        merged.push(mergedValue);
        this.score += mergedValue;
        i += 2;
      } else {
        merged.push(filtered[i]);
        i += 1;
      }
    }

    // Fill with zeros
    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  transpose(board) {
    const result = [];

    for (let col = 0; col < 4; col++) {
      result[col] = [];

      for (let row = 0; row < 4; row++) {
        result[col].push(board[row][col]);
      }
    }

    return result;
  }

  isBoardChanged(oldBoard, newBoard) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (oldBoard[i][j] !== newBoard[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomCell() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      const value = Math.random() < 0.9 ? 2 : 4;

      this.board[row][col] = value;
    }
  }

  updateStatus() {
    // Check for win
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // Check if there are any moves available
    if (this.hasAvailableMoves()) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }
      }
    }

    // Check for horizontal merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    // Check for vertical merges
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;

// Support for CommonJS (Jest tests)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
}
