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
    this.initialBoard = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = this.initialBoard.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);
    let scoreIncrease = 0;

    for (let row = 0; row < 4; row++) {
      const nonZeros = this.board[row].filter((val) => val !== 0);
      const merged = [];
      
      let i = 0;
      while (i < nonZeros.length) {
        if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
          const mergedValue = nonZeros[i] * 2;
          merged.push(mergedValue);
          scoreIncrease += mergedValue;
          i += 2; 
        } else {
          merged.push(nonZeros[i]);
          i += 1;
        }
      }
      
      while (merged.length < 4) {
        merged.push(0);
      }
      
      this.board[row] = merged;
    }

    const moved = this.boardChanged(previousBoard, this.board);

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);
    let scoreIncrease = 0;

    for (let row = 0; row < 4; row++) {
      const nonZeros = this.board[row].filter((val) => val !== 0);
      const merged = [];
      
      let i = nonZeros.length - 1;
      while (i >= 0) {
        if (i > 0 && nonZeros[i] === nonZeros[i - 1]) {
          const mergedValue = nonZeros[i] * 2;
          merged.unshift(mergedValue);
          scoreIncrease += mergedValue;
          i -= 2; 
        } else {
          merged.unshift(nonZeros[i]);
          i -= 1;
        }
      }
      
      while (merged.length < 4) {
        merged.unshift(0);
      }
      
      this.board[row] = merged;
    }

    const moved = this.boardChanged(previousBoard, this.board);

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);
    let scoreIncrease = 0;

    for (let col = 0; col < 4; col++) {
      // Extract column values and remove zeros
      const nonZeros = [];
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          nonZeros.push(this.board[row][col]);
        }
      }
      
      const merged = [];
      
      let i = 0;
      while (i < nonZeros.length) {
        if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
          const mergedValue = nonZeros[i] * 2;
          merged.push(mergedValue);
          scoreIncrease += mergedValue;
          i += 2; 
        } else {
          merged.push(nonZeros[i]);
          i += 1;
        }
      }
      
      while (merged.length < 4) {
        merged.push(0);
      }
      
      for (let row = 0; row < 4; row++) {
        this.board[row][col] = merged[row];
      }
    }

    const moved = this.boardChanged(previousBoard, this.board);

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);
    let scoreIncrease = 0;

    for (let col = 0; col < 4; col++) {
      const nonZeros = [];
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          nonZeros.push(this.board[row][col]);
        }
      }
      
      const merged = [];
      
      let i = nonZeros.length - 1;
      while (i >= 0) {
        if (i > 0 && nonZeros[i] === nonZeros[i - 1]) {
          const mergedValue = nonZeros[i] * 2;
          merged.unshift(mergedValue);
          scoreIncrease += mergedValue;
          i -= 2; 
        } else {
          merged.unshift(nonZeros[i]);
          i -= 1;
        }
      }
      
      while (merged.length < 4) {
        merged.unshift(0);
      }
      
      for (let row = 0; row < 4; row++) {
        this.board[row][col] = merged[row];
      }
    }

    const moved = this.boardChanged(previousBoard, this.board);

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
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
    return this.board.map((row) => [...row]);
  }

  /**
  @returns {string}
   */

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.initialBoard.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let outerRow = 0; outerRow < 4; outerRow++) {
      for (let outerCol = 0; outerCol < 4; outerCol++) {
        if (this.board[outerRow][outerCol] === 0) {
          emptyCells.push({ row: outerRow, col: outerCol });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  boardChanged(oldBoard, newBoard) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldBoard[row][col] !== newBoard[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';
          return;
        }
      }
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
      return;
    }

    this.status = 'playing';
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

if (typeof window !== 'undefined') {
  window.Game = Game;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
}