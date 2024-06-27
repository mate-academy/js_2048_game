'use strict';

const { gameStatus } = require('../utils/const');

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * this.tiles = [
   *  {prev:{row:0, col:2}, current:{row:2, col:2}}
   * ];
   */
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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.status = gameStatus.idle;
    this.score = 0;
    this.tiles = [];
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    let boardIsChanged = false;
    const deltas = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 },
    };

    const { row: rowDelta, col: colDelta } = deltas[direction];
    const startRow = rowDelta > 0 ? this.board.length - 1 : 0;
    const startCol = colDelta > 0 ? this.board[0].length - 1 : 0;
    const rowStep = rowDelta > 0 ? -1 : 1;
    const colStep = colDelta > 0 ? -1 : 1;

    // Move tiles
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[0].length; col++) {
        const currentRow = Math.abs(startRow + row * rowStep);
        const currentCol = Math.abs(startCol + col * colStep);

        if (this.board[currentRow][currentCol] !== 0) {
          let targetRow = currentRow;
          let targetCol = currentCol;

          while (
            targetRow + rowDelta >= 0 &&
            targetRow + rowDelta < this.board.length &&
            targetCol + colDelta >= 0 &&
            targetCol + colDelta < this.board[0].length &&
            this.board[targetRow + rowDelta][targetCol + colDelta] === 0
          ) {
            targetRow += rowDelta;
            targetCol += colDelta;
          }

          if (targetRow !== currentRow || targetCol !== currentCol) {
            this.tiles.push({
              prev: { row: currentRow, col: currentCol },
              current: { row: targetRow, col: targetCol },
              value: this.board[currentRow][currentCol],
              type: 'move',
            });

            this.board[targetRow][targetCol] =
              this.board[currentRow][currentCol];
            this.board[currentRow][currentCol] = 0;
            boardIsChanged = true;
          }
        }
      }
    }

    // Merge tiles
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[0].length; col++) {
        const currentRow = Math.abs(startRow + row * rowStep);
        const currentCol = Math.abs(startCol + col * colStep);

        const nextRow = currentRow + rowDelta;
        const nextCol = currentCol + colDelta;

        if (
          nextRow >= 0 &&
          nextRow < this.board.length &&
          nextCol >= 0 &&
          nextCol < this.board[0].length &&
          this.board[currentRow][currentCol] !== 0 &&
          this.board[currentRow][currentCol] === this.board[nextRow][nextCol]
        ) {
          const newPlate = this.board[currentRow][currentCol] * 2;

          this.score += newPlate;

          this.tiles.push({
            prev: { row: nextRow, col: nextCol },
            current: { row: currentRow, col: currentCol },
            value: newPlate,
            type: 'merge',
          });

          this.board[currentRow][currentCol] = newPlate;
          this.board[nextRow][nextCol] = 0;
          boardIsChanged = true;
        }
      }
    }

    // Move tiles again after merging
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[0].length; col++) {
        const currentRow = Math.abs(startRow + row * rowStep);
        const currentCol = Math.abs(startCol + col * colStep);

        if (this.board[currentRow][currentCol] !== 0) {
          let targetRow = currentRow;
          let targetCol = currentCol;

          while (
            targetRow + rowDelta >= 0 &&
            targetRow + rowDelta < this.board.length &&
            targetCol + colDelta >= 0 &&
            targetCol + colDelta < this.board[0].length &&
            this.board[targetRow + rowDelta][targetCol + colDelta] === 0
          ) {
            targetRow += rowDelta;
            targetCol += colDelta;
          }

          if (targetRow !== currentRow || targetCol !== currentCol) {
            this.tiles.push({
              prev: { row: currentRow, col: currentCol },
              current: { row: targetRow, col: targetCol },
              value: this.board[currentRow][currentCol],
              type: 'move',
            });

            this.board[targetRow][targetCol] =
              this.board[currentRow][currentCol];
            this.board[currentRow][currentCol] = 0;
            boardIsChanged = true;
          }
        }
      }
    }

    if (boardIsChanged) {
      this.generateNumberInRandomCell();
    }

    this.canMove();
  }

  getTiles() {
    return this.tiles;
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
    this.status = gameStatus.playing;
    this.generateNumberInRandomCell();
    this.generateNumberInRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.tiles = [];
    this.status = gameStatus.idle;
    this.score = 0;
  }

  canMove() {
    const emptyCells = this.findEmptyCells();

    if (!emptyCells.length) {
      this.status = gameStatus.lose;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomNumber() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  generateNumberInRandomCell() {
    const emptyCells = this.findEmptyCells();

    if (emptyCells.length !== 0) {
      const randomIndex = this.getRandomInt(0, emptyCells.length - 1);
      const { row, col } = emptyCells[randomIndex];
      const number = this.getRandomNumber();

      this.board[row][col] = number;

      this.tiles.push({
        prev: { row, col },
        current: { row, col },
        value: this.board[row][col],
        type: 'new',
      });
    } else {
      this.status = gameStatus.lose;
    }
  }

  findEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    return emptyCells;
  }
}

module.exports = Game;
