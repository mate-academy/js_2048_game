'use strict';

const Status = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
};

const BOARD_SIZE = 4;
const WINNING_TILE = 2048;
const NEW_TILE_TWO_PROBABILITY = 0.9;

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
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Game.createEmptyBoard();

    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Status.IDLE;
  }

  static createEmptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  }

  static slideAndMergeRow(row) {
    const values = row.filter((cell) => cell !== 0);
    const newRow = [];
    let gained = 0;

    for (let i = 0; i < values.length; i++) {
      const current = values[i];
      const next = values[i + 1];

      if (current === next) {
        const mergedValue = current * 2;

        newRow.push(mergedValue);
        gained += mergedValue;
        i++;
      } else {
        newRow.push(current);
      }
    }

    while (newRow.length < BOARD_SIZE) {
      newRow.push(0);
    }

    return { row: newRow, gained };
  }

  static transpose(board) {
    const result = [];

    for (let col = 0; col < BOARD_SIZE; col++) {
      result.push(board.map((row) => row[col]));
    }

    return result;
  }

  static boardsAreEqual(board1, board2) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board1[row][col] !== board2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  static hasTile(board, value) {
    return board.some((row) => row.includes(value));
  }

  moveLeft() {
    this.move({ transpose: false, reverse: false });
  }
  moveRight() {
    this.move({ transpose: false, reverse: true });
  }
  moveUp() {
    this.move({ transpose: true, reverse: false });
  }
  moveDown() {
    this.move({ transpose: true, reverse: true });
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
    if (this.status !== Status.IDLE) {
      return;
    }

    this.status = Status.PLAYING;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Status.IDLE;
  }

  move({ transpose, reverse }) {
    if (this.status === Status.IDLE) {
      return;
    }

    let working = this.board.map((row) => [...row]);

    if (transpose) {
      working = Game.transpose(working);
    }

    if (reverse) {
      working = working.map((row) => [...row].reverse());
    }

    let scoreGained = 0;

    const merged = working.map((row) => {
      const { row: newRow, gained } = Game.slideAndMergeRow(row);

      scoreGained += gained;

      return newRow;
    });

    let result = merged;

    if (reverse) {
      result = result.map((row) => [...row].reverse());
    }

    if (transpose) {
      result = Game.transpose(result);
    }

    if (!Game.boardsAreEqual(this.board, result)) {
      this.board = result;
      this.score += scoreGained;

      if (Game.hasTile(this.board, WINNING_TILE)) {
        this.status = Status.WIN;
      }

      this.addRandomTile();

      if (this.status === Status.PLAYING && !this.hasMovesAvailable()) {
        this.status = Status.LOSE;
      }
    }
  }

  getEmpytCells() {
    const cells = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.board[row][col] === 0) {
          cells.push([row, col]);
        }
      }
    }

    return cells;
  }

  addRandomTile() {
    const emptyCells = this.getEmpytCells();

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < NEW_TILE_TWO_PROBABILITY ? 2 : 4;
  }

  hasMovesAvailable() {
    if (this.getEmpytCells().length > 0) {
      return true;
    }

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const value = this.board[row][col];
        const right = this.board[row][col + 1];
        const down = this.board[row + 1] ? this.board[row + 1][col] : undefined;

        if (right !== undefined && right === value) {
          return true;
        }

        if (down !== undefined && down === value) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
