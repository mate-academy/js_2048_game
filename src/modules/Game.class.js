'use strict';

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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0; // Initial game score
    this.isStarted = false; // Flag indicating if the game has started
    this.wonTheGame = false; // Flag indicating if 2048 has been reached
    this.prevBoardState = JSON.stringify(this.board); // Store initial board state as a string
  }

  moveLeft() {
    // Save the previous board state for comparison after the move
    this.prevBoardState = JSON.stringify(this.board);

     // Process each row to shift tiles left
    this.board = this.board.map((row) => this.processRow(row));

    // Check if the board changed after the move
    const boardChanged = JSON.stringify(this.board) !== this.prevBoardState;

    // If the board changed, add a new random tile
    if (boardChanged) {
      this.addRandomTile();
    }
  }

  moveRight() {
    this.prevBoardState = JSON.stringify(this.board);

    // Shift right: process rows with reverse enabled
    this.board = this.board.map((row) => this.processRow(row, true));

    const boardChanged = JSON.stringify(this.board) !== this.prevBoardState;

    if (boardChanged) {
      this.addRandomTile();
    }
  }

  moveUp() {
    this.prevBoardState = JSON.stringify(this.board);
    // Transpose the board so moving up becomes like moving left
    this.transposeBoard();

    this.board = this.board.map((row) => this.processRow(row));

    this.transposeBoard(); // Restore the board to its original orientation

    const boardChanged = JSON.stringify(this.board) !== this.prevBoardState;

    if (boardChanged) {
      this.addRandomTile();
    }
  }

  moveDown() {
    this.prevBoardState = JSON.stringify(this.board);

    this.transposeBoard();

    this.board = this.board.map((row) => this.processRow(row, true));

    this.transposeBoard();

    const boardChanged = JSON.stringify(this.board) !== this.prevBoardState;

    if (boardChanged) {
      this.addRandomTile();
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
    if (this.wonTheGame) {
      return 'win'; // Player reached 2048
    }

    if (!this.isStarted) {
      return 'idle'; // Game hasn’t started yet
    }

    if (!this.hasMoves()) {
      return 'lose'; // No moves are possible, game over
    }

    return 'playing'; // Game is ongoing
  }

  /**
   * Starts the game.
   */
  start() {
    if (!this.isStarted) {
      // Add two initial tiles and start the game
      this.addRandomTile();
      this.addRandomTile();
      this.isStarted = true;
      this.prevBoardState = JSON.stringify(this.board);
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0; // Reset the score

    // Reset the board to its initial empty state
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.isStarted = false;
    this.wonTheGame = false;
    this.start(); // Restart the game
  }

  // Transpose the board: swap rows and columns
  transposeBoard() {
    this.board = this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );
  }

  // Process a row: shift and merge tiles
  processRow(row, reverse = false) {
    let currentRow = row;

    // Reverse the row if shifting right or down
    if (reverse) {
      currentRow.reverse();
    }

    // Remove zeros to simplify merging
    currentRow = row.filter((num) => num !== 0);

    // Merge identical adjacent tiles
    for (let i = 0; i < currentRow.length - 1; i++) {
      const currentNumber = currentRow[i];
      const nextNumber = currentRow[i + 1];

      if (currentNumber === nextNumber) {
        const nextNumberIndex = i + 1;

        currentRow[i] *= 2; // Double the value on merge

        currentRow.splice(nextNumberIndex, 1); // Remove the merged tile

        // Update the score with the merged value
        this.score += currentNumber * 2;

        // Check if the game is won (reached 2048)
        if (currentRow[i] === 2048) {
          this.wonTheGame = true;
        }
      }
    }

    // Add zeros to make it length 4 if necessary
    const zerosToAdd = new Array(4 - currentRow.length).fill(0);
    currentRow = currentRow.concat(zerosToAdd);

    // Reverse back if needed
    return reverse ? currentRow.reverse() : currentRow;
  }

  // Add a random tile (2 or 4) to an empty cell
  addRandomTile() {
    const emptyCells = [];

    // Collect all empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    // If no empty cells are available, do nothing
    if (emptyCells.length === 0) {
      return undefined;
    }

    // Pick a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row: randomRow, col: randomCol } = emptyCells[randomIndex];

    // 90% chance of 2, 10% chance of 4
    this.board[randomRow][randomCol] = Math.random() <= 0.1 ? 4 : 2;
  }

  // Check if there are any possible moves left
  hasMoves() {
    const allCells = this.board.flat();

    // If there’s at least one zero, moves are possible
    if (allCells.includes(0)) {
      return true;
    }

    // Check for possible horizontal merges
    const canMergeHorizontally = this.board.some((row) =>
      row.some((cell, i) => i < 3 && cell !== 0 && cell === row[i + 1]),
    );

    if (canMergeHorizontally) {
      return true;
    }

     // Check for possible vertical merges
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          this.board[row][col] === this.board[row + 1][col] &&
          this.board[row][col] !== 0
        ) {
          return true;
        }
      }
    }

    return false; // No moves available
  }
}

module.exports = Game;
