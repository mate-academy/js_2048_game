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

  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.isStarted = false;
    this.wonTheGame = false;
    this.prevBoardState = JSON.stringify(this.board)
  }

  moveLeft() {
    this.prevBoardState = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.processRow(row));

    const boardChanged = JSON.stringify(this.board) !== this.prevBoardState;

    if (boardChanged) {
      this.addRandomTile();
    }
  }

  moveRight() {
    this.prevBoardState = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.processRow(row, true));

    const boardChanged = JSON.stringify(this.board) !== this.prevBoardState;

    if (boardChanged) {
      this.addRandomTile();
    }
  }

  moveUp() {
    this.prevBoardState = JSON.stringify(this.board);

    this.transposeBoard();

    this.board = this.board.map((row) => this.processRow(row));

    this.transposeBoard();

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
      return 'win';
    }

    if (!this.isStarted) {
      return 'idle';
    }

    // To decrease number of hasMoves() method calling
    if (JSON.stringify(this.board) !== this.prevBoardState) {
      return 'playing';
    }

    if (!this.hasMoves()) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    if (!this.isStarted) {
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
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.isStarted = false;
    this.wonTheGame = false;
    this.start();
  }

  transposeBoard() {
    this.board = this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );
  }

  processRow(row, reverse = false) {
    let currentRow = row.filter((num) => num !== 0);

    for (let i = 0; i < currentRow.length - 1; i++) {
      const currentNumber = currentRow[i];
      const nextNumber = currentRow[i + 1];

      if (currentNumber === nextNumber) {
        const nextNumberIndex = i + 1;

        currentRow[i] *= 2;

        currentRow.splice(nextNumberIndex, 1);

        // Score updating
        this.score += currentNumber * 2;

        // If won the game
        if (currentRow[i] === 2048) {
          this.wonTheGame = true;
        }
      }
    }

    const zerosToAdd = new Array(4 - currentRow.length).fill(0);

    currentRow = currentRow.concat(zerosToAdd);

    return reverse ? currentRow.reverse() : currentRow;
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

    if (emptyCells.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const { row: randomRow, col: randomCol } = emptyCells[randomIndex];

    this.board[randomRow][randomCol] = Math.random() <= 0.1 ? 4 : 2;
  }

  hasMoves() {
    const allCells = this.board.flat();

    // Zeros check
    if (allCells.includes(0)) {
      return true;
    }

    const canMergeHorizontally = this.board.some((row) =>
      row.some((cell, i) => i < 3 && cell !== 0 && cell === row[i + 1]),
    );

    if (canMergeHorizontally) {
      return true;
    }

    // Can merge vertically
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

    return false;
  }
}

module.exports = Game;
