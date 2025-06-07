'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
  /**
   * Creates a new game instance.
   *
   *
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
    this.board = initialState
      ? initialState.map((row) => row.slice())
      : this.createEmptyBoard();
    this.score = 0;
    this.isStarted = false;
    // console.log(initialState);
  }

  createEmptyBoard() {
    return Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
  }

  compressRow(row) {
    const nonZeroTiles = row.filter((num) => num !== 0);
    const mergeRow = [];
    let score = 0;

    for (let i = 0; i < nonZeroTiles.length; i++) {
      if (nonZeroTiles[i] === nonZeroTiles[i + 1]) {
        const merged = nonZeroTiles[i] * 2;

        mergeRow.push(merged);
        score += merged;
        i++;
      } else {
        mergeRow.push(nonZeroTiles[i]);
      }
    }

    while (mergeRow.length < 4) {
      mergeRow.push(0);
    }

    return {
      row: mergeRow,
      score,
    };
  }

  moveLeft() {
    let moved = false;
    const newBoard = [];

    for (let i = 0; i < 4; i++) {
      const result = this.compressRow(this.board[i]);

      if (JSON.stringify(result.row) !== JSON.stringify(this.board[i])) {
        moved = true;
      }
      newBoard.push(result.row);
      this.score += result.score;
    }

    this.board = newBoard;

    return moved;
  }

  moveRight() {
    let moved = false;
    const newBoard = [];

    for (let i = 0; i < 4; i++) {
      const originalRow = this.board[i];
      const reverseRow = this.board[i].slice().reverse();
      const { row, score } = this.compressRow(reverseRow);
      const restored = row.reverse();

      if (JSON.stringify(restored) !== JSON.stringify(originalRow)) {
        moved = true;
      }

      newBoard.push(restored);
      this.score += score;
    }

    this.board = newBoard;

    return moved;
  }

  moveUp() {
    let moved = false;
    const newBoard = this.createEmptyBoard();

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const { row: newColumn, score } = this.compressRow(column);

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newColumn[row]) {
          moved = true;
        }
        newBoard[row][col] = newColumn[row];
      }

      this.score += score;
    }

    this.board = newBoard;

    return moved;
  }

  moveDown() {
    let moved = false;
    const newBoard = this.createEmptyBoard();

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const reversed = column.reverse();
      const { row: newColumn, score } = this.compressRow(reversed);
      const restored = newColumn.reverse();

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== restored[row]) {
          moved = true;
        }
        newBoard[row][col] = restored[row];
      }

      this.score += score;
    }
    this.board = newBoard;

    return moved;
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
    return this.board.map((row) => row.slice());
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
    if (!this.isStarted) {
      return 'idle';
    }

    const board = this.board;

    for (const row of board) {
      if (row.includes(2048)) {
        return 'win';
      }
    }

    for (const row of board) {
      if (row.includes(0)) {
        return 'playing';
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board[i][j];

        if (
          (j < 3 && current === board[i][j + 1]) ||
          (i < 3 && current === board[i + 1][j])
        ) {
          return 'playing';
        }
      }
    }

    return 'lose';
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
    this.isStarted = true;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here

  addRandomTile() {
    const emptyCell = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCell.push({ i: row, j: col });
        }
      }
    }

    if (emptyCell.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCell.length);
    const { i, j } = emptyCell[randomIndex];

    this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
}
