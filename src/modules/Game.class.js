'use strict';

/**
 * This class represents the game.
 * Complete implementation of 2048 game logic.
 */
// eslint-disable-next-line no-unused-vars
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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.board = initialState || this.createEmptyBoard();

    if (initialState) {
      this.status = 'playing';
    }
  }

  /**
   * Creates an empty 4x4 board
   * @returns {number[][]}
   */
  createEmptyBoard() {
    return Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
  }

  /**
   * Adds a new tile (2 or 4) to a random empty position
   */
  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      // 10% chance for 4, 90% chance for 2

      this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  /**
   * Moves and merges a row to the left
   * @param {number[]} row
   * @returns {object} { newRow, scoreIncrease, moved }
   */
  moveRowLeft(row) {
    const newRow = [...row];
    let scoreIncrease = 0;
    let moved = false;

    // Remove zeros (slide left)
    const filteredRow = newRow.filter((cell) => cell !== 0);

    // Merge adjacent equal cells
    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        scoreIncrease += filteredRow[i];
        filteredRow[i + 1] = 0;
      }
    }

    // Remove zeros again after merging
    const mergedRow = filteredRow.filter(function (cell) {
      return cell !== 0;
    });

    // Fill with zeros to maintain row length
    while (mergedRow.length < this.size) {
      mergedRow.push(0);
    }

    // Check if row changed
    for (let i = 0; i < this.size; i++) {
      if (row[i] !== mergedRow[i]) {
        moved = true;
        break;
      }
    }

    return { newRow: mergedRow, scoreIncrease, moved };
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let totalScoreIncrease = 0;
    let boardChanged = false;
    const newBoard = [];

    for (let row = 0; row < this.size; row++) {
      const result = this.moveRowLeft(this.board[row]);

      newBoard.push(result.newRow);
      totalScoreIncrease += result.scoreIncrease;

      if (result.moved) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.board = newBoard;
      this.score += totalScoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let totalScoreIncrease = 0;
    let boardChanged = false;
    const newBoard = [];

    for (let row = 0; row < this.size; row++) {
      const reversedRow = [...this.board[row]].reverse();
      const result = this.moveRowLeft(reversedRow);

      newBoard.push(result.newRow.reverse());
      totalScoreIncrease += result.scoreIncrease;

      if (result.moved) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.board = newBoard;
      this.score += totalScoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let totalScoreIncrease = 0;
    let boardChanged = false;

    // Transpose, move left, transpose back
    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      const result = this.moveRowLeft(column);

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = result.newRow[row];
      }

      totalScoreIncrease += result.scoreIncrease;

      if (result.moved) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.score += totalScoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let totalScoreIncrease = 0;
    let boardChanged = false;

    // Transpose, move right, transpose back
    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      const reversedColumn = column.reverse();
      const result = this.moveRowLeft(reversedColumn);
      const finalColumn = result.newRow.reverse();

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = finalColumn[row];
      }

      totalScoreIncrease += result.scoreIncrease;

      if (result.moved) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.score += totalScoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  /**
   * Updates the game status based on current board state
   */
  updateStatus() {
    // Check for win condition (2048 tile)
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // Check for game over
    if (!this.canMove()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  /**
   * Checks if any moves are possible
   * @returns {boolean}
   */
  canMove() {
    // Check for empty cells
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    // Check for possible merges
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.board[row][col];

        // Check right neighbor
        if (col < this.size - 1 && this.board[row][col + 1] === current) {
          return true;
        }

        // Check bottom neighbor
        if (row < this.size - 1 && this.board[row + 1][col] === current) {
          return true;
        }
      }
    }

    return false;
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
    return this.board.map((row) => [...row]);
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

    // Add two initial tiles
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }
}

// Para uso no browser, a classe Game fica disponível globalmente
// Para testes Node.js, descomente a linha abaixo:
// module.exports = Game;
