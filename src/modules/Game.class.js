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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.status = 'idle';
    this.board = initialState.map((row) => [...row]);
    this.initialState = initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = this.board.map((row) => this.slideRowLeft(row));

    if (!this.isBoardChanged(newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = this.board.map((row) => {
      const revRow = [...row].reverse();

      const reversedRow = this.slideRowLeft(revRow);

      return reversedRow.reverse();
    });

    if (!this.isBoardChanged(newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const moved = transposed.map((row) => this.slideRowLeft(row));
    const newBoard = this.transpose(moved);

    if (!this.isBoardChanged(newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const moved = transposed.map((row) => {
      const reverRow = [...row].reverse();

      const slidRow = this.slideRowLeft(reverRow);

      return slidRow.reverse();
    });

    const newBoard = this.transpose(moved);

    if (!this.isBoardChanged(newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.board = this.initialState.map((row) => [...row]);
  }

  // Add your own methods here
  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const [row, col] = randomCell;

    if (Math.random() >= 0.1) {
      this.board[row][col] = 2;
    } else {
      this.board[row][col] = 4;
    }
  }

  slideRowLeft(row) {
    const tiles = row.filter((cell) => cell !== 0);
    const merged = [];

    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] === tiles[i + 1]) {
        merged.push(tiles[i] + tiles[i + 1]);
        this.score += tiles[i] + tiles[i + 1];
        i++;
      } else {
        merged.push(tiles[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  isBoardChanged(newBoard) {
    return newBoard.some((row, indexRow) => {
      const oldRow = this.board[indexRow];

      return row.some((cel, indexCol) => cel !== oldRow[indexCol]);
    });
  }

  transpose(board) {
    const resultBoard = [];

    for (let col = 0; col < 4; col++) {
      const newRow = [];

      for (let row = 0; row < 4; row++) {
        newRow.push(board[row][col]);
      }

      resultBoard.push(newRow);
    }

    return resultBoard;
  }

  updateStatus() {
    const allCells = this.board.flat();
    const isWinGame = allCells.includes(2048);

    if (isWinGame) {
      this.status = 'win';

      return;
    }

    if (!allCells.includes(0) && !this.canMerge()) {
      this.status = 'lose';
    }
  }

  canMerge() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
