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

  static Status = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Game.createEmptyBoard();

    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.Status.IDLE;
  }

  static createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  moveLeft() {
    this.move((board) => this.transformLeft(board));
  }

  moveRight() {
    this.move((board) => this.transformRight(board));
  }

  moveUp() {
    const moveLeft = (board) =>
      this.transpose(this.transformLeft(this.transpose(board)));

    this.move(moveLeft);
  }

  moveDown() {
    const moveDown = (board) =>
      this.transpose(this.transformRight(this.transpose(board)));

    this.move(moveDown);
  }

  move(transformFn) {
    if (this.status !== Game.Status.PLAYING) {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);
    const newBoard = transformFn(this.board);
    const hasChanged = !this.boardsEqual(prevBoard, newBoard);

    if (hasChanged) {
      this.board = newBoard;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  transformLeft(board) {
    return board.map((row) => this.mergeRow(row));
  }

  transformRight(board) {
    return board.map((row) => this.mergeRow([...row].reverse()).reverse());
  }

  mergeRow(row) {
    const filtered = row.filter((cell) => cell !== 0);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        merged.push(mergedValue);
        this.score += mergedValue;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  boardsEqual(a, b) {
    return a.every((row, i) => row.every((cell, j) => cell === b[i][j]));
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[i][j] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    const hasWon = this.board.some((row) => row.includes(2048));

    if (hasWon) {
      this.status = Game.Status.WIN;

      return;
    }

    if (!this.canMove()) {
      this.status = Game.Status.LOSE;
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
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
    if (this.status !== Game.Status.IDLE) {
      return;
    }

    this.status = Game.Status.PLAYING;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.Status.IDLE;
  }

  // Add your own methods here
}

export default Game;
