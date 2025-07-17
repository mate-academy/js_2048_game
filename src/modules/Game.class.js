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
    console.log(initialState);
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();
  }
  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  moveLeft() {
    let moved = false;
    const newBoard = [];

    for (const row of this.board) {
      const { newRow, gainedScore, didMove } = this.processRowLeft(row);

      newBoard.push(newRow);

      if (didMove) {
        moved = true;
      }
      this.score += gainedScore;
    }

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
      this.updateGameStatus();
    }
  }
  processRowLeft(row) {
    const filtered = row.filter((x) => x !== 0); // remove zeros
    const newRow = [];
    let score = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        newRow.push(merged);
        score += merged;
        i++; // skip next element
      } else {
        newRow.push(filtered[i]);
      }
    }

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    const didMove = !row.every((val, idx) => val === newRow[idx]);

    return { newRow, gainedScore: score, didMove };
  }
  moveRight() {
    let moved = false;
    const newBoard = [];

    for (const row of this.board) {
      const reversed = this.reverseRow(row);
      const { newRow, gainedScore, didMove } = this.processRowLeft(reversed);
      const finalRow = this.reverseRow(newRow);

      newBoard.push(finalRow);

      if (didMove) {
        moved = true;
      }
      this.score += gainedScore;
    }

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
      this.updateGameStatus();
    }
  }
  moveUp() {
    let moved = false;
    const transposed = this.transpose(this.board);
    const newBoardT = [];

    for (const row of transposed) {
      const { newRow, gainedScore, didMove } = this.processRowLeft(row);

      newBoardT.push(newRow);

      if (didMove) {
        moved = true;
      }
      this.score += gainedScore;
    }

    if (moved) {
      this.board = this.transpose(newBoardT);
      this.addRandomTile();
      this.updateGameStatus();
    }
  }
  moveDown() {
    let moved = false;
    const transposed = this.transpose(this.board);
    const newBoardT = [];

    for (const row of transposed) {
      const reversed = this.reverseRow(row);
      const { newRow, gainedScore, didMove } = this.processRowLeft(reversed);
      const finalRow = this.reverseRow(newRow);

      newBoardT.push(finalRow);

      if (didMove) {
        moved = true;
      }
      this.score += gainedScore;
    }

    if (moved) {
      this.board = this.transpose(newBoardT);
      this.addRandomTile();
      this.updateGameStatus();
    }
  }
  reverseRow(row) {
    return row.slice().reverse();
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
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
    return this.cloneBoard(this.board);
  }
  updateGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.hasMovesAvailable()) {
      return;
    }

    this.status = 'lose';
  }
  hasMovesAvailable() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (val === 0) {
          return true;
        }

        if (c < this.size - 1 && val === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && val === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
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

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row: r, col: c } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
