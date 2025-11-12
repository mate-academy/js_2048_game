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
   * @param {number[]} [initialState]
   * - The initial state of the board (16-element array).
   */
  constructor(initialState) {
    this.size = 4; // 4x4 board
    this.board = initialState || this._getEmptyBoard();
    this.score = 0;
    this.status = 'idle'; // Initial status should be 'idle'
  }

  /**
   * Creates a new 16-element array filled with zeros.
   * @returns {number[]}
   */
  _getEmptyBoard() {
    return new Array(this.size * this.size).fill(0);
  }

  /**
   * Finds the indices of all empty tiles (value 0).
   * @returns {number[]} Array of empty tile indices.
   */
  _getEmptyTiles() {
    return this.board
      .map((val, index) => (val === 0 ? index : -1))
      .filter((index) => index !== -1);
  }

  /**
   * Adds a new tile (2 or 4) to a random empty spot.
   */
  _addNewTile() {
    const emptyTiles = this._getEmptyTiles();

    if (emptyTiles.length === 0) {
      return;
    }

    const randomIndex =
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    // 90% chance for 2, 10% for 4
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[randomIndex] = newValue;
  }

  /**
   * Updates the game status (check for won, lost, or playing).
   */
  _updateStatus() {
    // 1. Check for 'won'
    if (this.board.includes(2048)) {
      this.status = 'won';

      return;
    }

    // 2. Check for 'playing' (if there are empty tiles)
    if (this._getEmptyTiles().length > 0) {
      this.status = 'playing';

      return;
    }

    // 3. Check for 'lost' (no empty tiles, and no possible moves)
    const isMovePossible = this._checkPossibleMoves();

    if (!isMovePossible) {
      this.status = 'lost';

      return;
    }

    this.status = 'playing';
  }

  /**
   * Checks if any horizontal or vertical merge is possible.
   * @returns {boolean} True if a move/merge is possible, false otherwise.
   */
  _checkPossibleMoves() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const index = r * this.size + c;
        const value = this.board[index];

        // Check horizontal neighbor
        if (c < this.size - 1) {
          const rightIndex = r * this.size + (c + 1);

          if (this.board[rightIndex] === value) {
            return true;
          }
        }

        // Check vertical neighbor
        if (r < this.size - 1) {
          const downIndex = (r + 1) * this.size + c;

          if (this.board[downIndex] === value) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Performs a single row/column shift and merge operation (always left-bound).
   * @param {number[]} line -
   *  An array representing a row or column (e.g., [2, 0, 2, 4]).
   * @returns {{newLine: number[], moved: boolean, scoreIncrease: number}}
   * The processed line and movement info.
   */
  _slideAndMerge(line) {
    let scoreIncrease = 0;
    const initialLineStr = JSON.stringify(line);

    // 1. Remove zeros (compact the line)
    let filteredLine = line.filter((val) => val !== 0);

    // 2. Merge adjacent identical tiles
    for (let i = 0; i < filteredLine.length - 1; i++) {
      // Corrected loop boundary and merge logic
      if (filteredLine[i] === filteredLine[i + 1]) {
        const mergedValue = filteredLine[i] * 2;

        scoreIncrease += mergedValue;
        filteredLine[i] = mergedValue;
        // Mark the merged tile to be removed in the next step
        filteredLine[i + 1] = 0;
      }
    }

    // 3. Re-compact the line after merging
    filteredLine = filteredLine.filter((val) => val !== 0);

    // 4. Pad with zeros to restore original length
    // Fix: Use .fill(0) to create a new array,
    // otherwise it creates "empty slots"
    const newLine = filteredLine.concat(
      new Array(line.length - filteredLine.length).fill(0),
    );

    const moved = initialLineStr !== JSON.stringify(newLine);

    return { newLine, moved, scoreIncrease };
  }

  /**
   * Handles the movement logic for a specific direction.
   * @param {'left'|'right'|'up'|'down'} direction
   * @returns {boolean} True if the board state changed, false otherwise.
   */
  _handleMove(direction) {
    let boardChanged = false;
    let totalScoreIncrease = 0;
    // Create a mutable copy of the board to construct the new state
    const newBoard = [...this.board];

    for (let i = 0; i < this.size; i++) {
      let line = [];

      // Extract the line (row or column) based on direction
      if (direction === 'left' || direction === 'right') {
        // Horizontal lines (rows)
        line = this.board.slice(i * this.size, i * this.size + this.size);
      } else {
        // Vertical lines (columns)
        for (let j = 0; j < this.size; j++) {
          line.push(this.board[j * this.size + i]);
        }
      }

      // Reverse the line for 'right' or 'down'
      // movements so merge/slide is always 'left'
      if (direction === 'right' || direction === 'down') {
        line.reverse();
      }

      // Process the line
      const { newLine, moved, scoreIncrease } = this._slideAndMerge(line);

      if (moved) {
        boardChanged = true;
      }
      totalScoreIncrease += scoreIncrease;

      // Reverse the line back if it was reversed initially
      if (direction === 'right' || direction === 'down') {
        newLine.reverse();
      }

      // Place the processed line back into the new board
      if (direction === 'left' || direction === 'right') {
        // Update the row in the newBoard copy
        for (let j = 0; j < this.size; j++) {
          newBoard[i * this.size + j] = newLine[j];
        }
      } else {
        // Update the column in the newBoard copy
        for (let j = 0; j < this.size; j++) {
          newBoard[j * this.size + i] = newLine[j];
        }
      }
    }

    if (!boardChanged) {
      return false;
    }

    this.board = newBoard;
    this.score += totalScoreIncrease;

    this._addNewTile();
    this._updateStatus();

    return true;
  }

  // --- Public Obligatory Methods ---

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    return this._handleMove('left');
  }
  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    return this._handleMove('right');
  }
  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    return this._handleMove('up');
  }
  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    return this._handleMove('down');
  }

  getScore() {
    return this.score;
  }

  getState() {
    // Return a copy to prevent external modification
    return [...this.board];
  }

  getStatus() {
    // Note: The prompt uses 'win' and 'lose',
    // while the class uses 'won' and 'lost'.
    // I'll stick to 'won'/'lost' in the class logic,
    // and map them in the UI if needed.
    return this.status;
  }

  start() {
    this.board = this._getEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this._addNewTile();
    this._addNewTile();

    this._updateStatus();
  }

  restart() {
    this.start();
  }
}

module.exports = Game;
