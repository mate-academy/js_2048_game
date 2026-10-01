'use strict';

/**
 * Core game engine for 2048 (Model in MVC architecture).
 */
class Game {
  // =========================================================================
  // 1. INITIALIZATION & GETTERS
  // =========================================================================

  constructor(initialState) {
    this.board = initialState ?? this._createEmptyBoard();
    this.score = 0;
    this.status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  } // =========================================================================
  // 2. GAME CONTROL
  // =========================================================================
  /**
   * Resets game state and spawns 2 starting tiles.
   */

  restart() {
    this.score = 0;
    this.board = this._createEmptyBoard();
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  start() {
    this.restart();
  } // =========================================================================
  // 3. CORE MOVEMENT MECHANICS
  // =========================================================================

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoardState = JSON.stringify(this.board);
    const movedBoard = this.board.map((row) => this.slideRow(row));

    if (prevBoardState !== JSON.stringify(movedBoard)) {
      this.board = movedBoard;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoardState = JSON.stringify(this.board);
    const movedBoard = this.board.map((row) => {
      return this.slideRow([...row].reverse()).reverse();
    });

    if (prevBoardState !== JSON.stringify(movedBoard)) {
      this.board = movedBoard;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoardState = JSON.stringify(this.board);
    const transposed = this.transpose(this.board);
    const movedTransposed = transposed.map((row) => this.slideRow(row));
    const newBoard = this.transpose(movedTransposed);

    if (prevBoardState !== JSON.stringify(newBoard)) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoardState = JSON.stringify(this.board);
    const transposed = this.transpose(this.board);
    const movedTransposed = transposed.map((row) => {
      return this.slideRow([...row].reverse()).reverse();
    });
    const newBoard = this.transpose(movedTransposed);

    if (prevBoardState !== JSON.stringify(newBoard)) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkGameStatus();
    }
  } // =========================================================================
  // 4. UTILITIES & GAME RULES
  // =========================================================================
  /**
   * Slides a single row left and merges matching adjacent tiles.
   */

  slideRow(row) {
    let cleanRow = row.filter((num) => num !== 0);

    for (let i = 0; i < cleanRow.length - 1; i++) {
      if (cleanRow[i] === cleanRow[i + 1]) {
        cleanRow[i] *= 2;
        this.score += cleanRow[i];
        cleanRow[i + 1] = 0;
        i++;
      }
    }

    cleanRow = cleanRow.filter((num) => num !== 0);

    while (cleanRow.length < row.length) {
      cleanRow.push(0);
    }

    return cleanRow;
  } /**
   * Transposes a matrix (swaps rows and columns).
   */

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  } /**
   * Spawns a 2 (90% chance) or 4 (10% chance) in a random empty cell.
   */

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [r, c] = emptyCells[randomIndex];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  } /**
   * Evaluates win (2048 reached) or lose (no valid moves left) conditions.
   */

  checkGameStatus() {
    // 1. Win condition check
    const has2048 = this.board.some((row) => row.includes(2048));

    if (has2048) {
      this.status = 'win';

      return;
    } // 2. Available moves check

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        const current = this.board[r][c]; // Empty tile exists

        if (current === 0) {
          return;
        } // Matching neighbor on the right

        if (c < 3 && current === this.board[r][c + 1]) {
          return;
        } // Matching neighbor below

        if (r < 3 && current === this.board[r + 1][c]) {
          return;
        }
      }
    } // No moves or empty cells remaining

    this.status = 'lose';
  } /**
   * Helper to generate a default 4x4 matrix.
   */

  _createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }
}

module.exports = Game;
