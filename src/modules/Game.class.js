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
  constructor(initialState = null) {
    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.initialState = this.board.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);
    let moveScore = 0;

    for (let row = 0; row < 4; row++) {
      const currentRow = this.board[row];
      const filteredRow = currentRow.filter((number) => number !== 0);
      const merged = [];

      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          const mergedValue = filteredRow[i] * 2;

          merged.push(mergedValue);
          moveScore += mergedValue;
          i++;
        } else {
          merged.push(filteredRow[i]);
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      this.board[row] = merged;
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.score += moveScore;
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const reversedBoard = this.board.map((row) => [...row].reverse());

    this.board = reversedBoard;
    this.moveLeft();

    this.board = this.board.map((row) => [...row].reverse());
  }

  moveUp() {
    this.board = this.board.map((_, i) => this.board.map((r) => r[i]));

    this.moveLeft();

    this.board = this.board.map((_, i) => this.board.map((r) => r[i]));
  }

  moveDown() {
    this.board = this.board.map((_, i) => this.board.map((r) => r[i]));

    this.board = this.board.map((row) => [...row].reverse());

    this.moveLeft();

    this.board = this.board.map((row) => [...row].reverse());

    this.board = this.board.map((_, i) => this.board.map((r) => r[i]));
  }

  start() {
    this.status = 'playing';
    this.score = 0;

    this.board = this.initialState.map((row) => [...row]);
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const randomCell = emptyCells[randomIndex];

    const cellValue = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.row][randomCell.col] = cellValue;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);

    this.score = 0;

    this.status = 'idle';
  }

  checkWin() {
    const hasWon = this.board.some((row) => row.some((cell) => cell === 2048));

    if (hasWon) {
      this.status = 'win';
    }
  }

  checkLose() {
    const isFull = this.board.every((row) => row.every((cell) => cell !== 0));

    const hasHorizontalMove = this.board.some((row) => {
      return row.some((cell, col) => cell === row[col + 1]);
    });

    const hasVerticalMove = this.board.some((row, rowIndex) => {
      return row.some((cell, col) => cell === this.board[rowIndex + 1]?.[col]);
    });

    if (isFull && !hasHorizontalMove && !hasVerticalMove) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
