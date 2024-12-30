'use strict';

export default class Game {
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
    // Validate initial state if provided
    if (initialState) {
      if (
        !Array.isArray(initialState) ||
        initialState.length !== 4 ||
        !initialState.every((row) => Array.isArray(row) && row.length === 4)
      ) {
        throw new Error('Invalid initial state: must be 4x4 array');
      }
    }
    this.initialState = initialState;
    this.restart();
  }

  // Method to set the game status
  setStatus(newStatus) {
    this.gameStatus = newStatus;
  }

  // Method to get the game status
  getStatus() {
    return this.status;
  }

  // Method to get the current state of the board
  getState() {
    return this.board;
  }

  // Method to get the current score
  getScore() {
    return this.score;
  }

  // Add this helper method to check if the move changed the board
  hasChanged(oldState, newState) {
    return JSON.stringify(oldState) !== JSON.stringify(newState);
  }

  // Method to move tiles to the left
  moveLeft() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < 4; row++) {
      const cells = this.board[row].filter((cell) => cell !== 0);

      // Merge adjacent equal numbers
      for (let i = 0; i < cells.length - 1; i++) {
        if (cells[i] === cells[i + 1]) {
          cells[i] *= 2;
          scoreIncrease += cells[i]; // Add to score when merging
          cells.splice(i + 1, 1);
          moved = true;
          i--; // Check the next pair
        }
      }

      // Pad with zeros on the right
      while (cells.length < 4) {
        cells.push(0);
      }

      // Check if anything moved
      if (JSON.stringify(this.board[row]) !== JSON.stringify(cells)) {
        moved = true;
      }

      this.board[row] = cells;
    }

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.checkGameEnd();
    }

    return moved;
  }

  // Method to move tiles to the right
  moveRight() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < 4; row++) {
      const cells = this.board[row].filter((cell) => cell !== 0);

      // Merge adjacent equal numbers
      for (let i = cells.length - 1; i > 0; i--) {
        if (cells[i] === cells[i - 1]) {
          cells[i] *= 2;
          scoreIncrease += cells[i]; // Add to score when merging
          cells.splice(i - 1, 1);
          moved = true;
        }
      }

      // Pad with zeros on the left
      while (cells.length < 4) {
        cells.unshift(0);
      }

      // Check if anything moved
      if (JSON.stringify(this.board[row]) !== JSON.stringify(cells)) {
        moved = true;
      }

      this.board[row] = cells;
    }

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.checkGameEnd();
    }

    return moved;
  }

  // Method to move tiles up
  moveUp() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < 4; col++) {
      // Get column as array
      let cells = [];

      for (let row = 0; row < 4; row++) {
        cells.push(this.board[row][col]);
      }

      cells = cells.filter((cell) => cell !== 0);

      // Merge adjacent equal numbers
      for (let i = 0; i < cells.length - 1; i++) {
        if (cells[i] === cells[i + 1]) {
          cells[i] *= 2;
          scoreIncrease += cells[i]; // Add to score when merging
          cells.splice(i + 1, 1);
          moved = true;
          i--; // Check the next pair
        }
      }

      // Pad with zeros at the bottom
      while (cells.length < 4) {
        cells.push(0);
      }

      // Update the column
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== cells[row]) {
          moved = true;
          this.board[row][col] = cells[row];
        }
      }
    }

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.checkGameEnd();
    }

    return moved;
  }

  // Method to move tiles down
  moveDown() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < 4; col++) {
      // Get column as array
      let cells = [];

      for (let row = 0; row < 4; row++) {
        cells.push(this.board[row][col]);
      }

      cells = cells.filter((cell) => cell !== 0);

      // Merge adjacent equal numbers
      for (let i = cells.length - 1; i > 0; i--) {
        if (cells[i] === cells[i - 1]) {
          cells[i] *= 2;
          scoreIncrease += cells[i]; // Add to score when merging
          cells.splice(i - 1, 1);
          moved = true;
        }
      }

      // Pad with zeros at the top
      while (cells.length < 4) {
        cells.unshift(0);
      }

      // Update the column
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== cells[row]) {
          moved = true;
          this.board[row][col] = cells[row];
        }
      }
    }

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.checkGameEnd();
    }

    return moved;
  }

  start() {
    // Clear the board first
    this.board = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';

    // Always add exactly two tiles
    this.addRandomTile();
    this.addRandomTile();
  }

  // Helper method to add a random tile
  addRandomTile() {
    const emptyCells = [];

    // Find all empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    // Only proceed if there are empty cells
    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      // Always add a number (2 or 4)
      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // Add this method
  restart() {
    this.score = 0;
    this.status = 'idle';

    // Just reset the board, start() will handle initialization
    this.board = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
  }

  hasAvailableMoves() {
    // Check for possible horizontal merges
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    // Check for possible vertical merges
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameEnd() {
    // First check for 2048 tile (win condition)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    // Check for empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false; // Game can continue
        }
      }
    }

    // If no empty cells, check for possible merges
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return false; // Can still merge horizontally
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return false; // Can still merge vertically
        }
      }
    }

    // If we get here, no moves are possible
    this.status = 'lose';

    return true;
  }

  // Add protected method for board modifications
  #updateBoard(newBoard) {
    const oldState = JSON.stringify(this.board);

    this.board = newBoard;

    return oldState !== JSON.stringify(this.board);
  }
}
