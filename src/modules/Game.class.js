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
    const newBoard = this.board.map((row) => {
      // Get non-zero numbers
      const numbers = row.filter((cell) => cell !== 0);
      const originalLength = numbers.length;

      // Merge adjacent equal numbers
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] *= 2;
          this.score += numbers[i];
          numbers.splice(i + 1, 1);
          moved = true;
        }
      }

      // Fill with zeros
      const newRow = [...numbers];

      while (newRow.length < 4) {
        newRow.push(0);
      }

      // Check if the row changed
      if (
        originalLength !== numbers.length ||
        JSON.stringify(row) !== JSON.stringify(newRow)
      ) {
        moved = true;
      }

      return newRow;
    });

    if (moved) {
      this.board = newBoard;
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
    const newBoard = this.board.map((row) => {
      // Get non-zero numbers and reverse
      const numbers = row.filter((cell) => cell !== 0);
      const originalLength = numbers.length;

      numbers.reverse();

      // Merge adjacent equal numbers
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] *= 2;
          this.score += numbers[i];
          numbers.splice(i + 1, 1);
          moved = true;
        }
      }

      // Fill with zeros and reverse back
      const newRow = Array(4 - numbers.length).fill(0);

      newRow.push(...numbers.reverse());

      // Check if the row changed
      if (
        originalLength !== numbers.length ||
        JSON.stringify(row) !== JSON.stringify(newRow)
      ) {
        moved = true;
      }

      return newRow;
    });

    if (moved) {
      this.board = newBoard;
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
    const newBoard = Array(4)
      .fill()
      .map(() => Array(4).fill(0));

    // Process each column
    for (let col = 0; col < 4; col++) {
      // Get non-zero numbers
      const numbers = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          numbers.push(this.board[row][col]);
        }
      }

      const originalLength = numbers.length;

      // Merge adjacent equal numbers
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] *= 2;
          this.score += numbers[i];
          numbers.splice(i + 1, 1);
          moved = true;
        }
      }

      // Fill the column from top
      for (let row = 0; row < numbers.length; row++) {
        newBoard[row][col] = numbers[row];
      }

      // Check if the column changed
      if (
        originalLength !== numbers.length ||
        JSON.stringify(this.board.map((r) => r[col])) !==
          JSON.stringify(newBoard.map((r) => r[col]))
      ) {
        moved = true;
      }
    }

    if (moved) {
      this.board = newBoard;
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
    const newBoard = Array(4)
      .fill()
      .map(() => Array(4).fill(0));

    // Process each column
    for (let col = 0; col < 4; col++) {
      // Get non-zero numbers
      const numbers = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          numbers.push(this.board[row][col]);
        }
      }

      const originalLength = numbers.length;

      numbers.reverse();

      // Merge adjacent equal numbers
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] *= 2;
          this.score += numbers[i];
          numbers.splice(i + 1, 1);
          moved = true;
        }
      }

      // Fill the column from bottom
      numbers.reverse();

      for (let i = 0; i < numbers.length; i++) {
        newBoard[4 - numbers.length + i][col] = numbers[i];
      }

      // Check if the column changed
      if (
        originalLength !== numbers.length ||
        JSON.stringify(this.board.map((r) => r[col])) !==
          JSON.stringify(newBoard.map((r) => r[col]))
      ) {
        moved = true;
      }
    }

    if (moved) {
      this.board = newBoard;
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
