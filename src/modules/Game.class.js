'use strict';

const BOARD_SIZE = 4;
const WINNING_VALUE = 2048;
const FOUR_PROBABILITY = 0.1;

const STATUS = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

const DIRECTION = {
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down',
};

/**
 * Creates a new board filled with zeros.
 *
 * @returns {number[][]}
 */
function createEmptyBoard() {
  const board = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    board.push(new Array(BOARD_SIZE).fill(0));
  }

  return board;
}

/**
 * Makes a deep copy of the board.
 *
 * @param {number[][]} board
 * @returns {number[][]}
 */
function copyBoard(board) {
  return board.map((row) => [...row]);
}

/**
 * Moves all the non-zero values of the line to its beginning and merges
 * every pair of equal neighbours. A merged cell is never merged twice
 * during the same move.
 *
 * @param {number[]} line
 * @returns {{ cells: number[], score: number }}
 */
function slideLine(line) {
  const cells = line.filter((value) => value !== 0);
  let score = 0;

  for (let i = 0; i < cells.length - 1; i++) {
    if (cells[i] === cells[i + 1]) {
      cells[i] *= 2;
      score += cells[i];
      cells.splice(i + 1, 1);
    }
  }

  while (cells.length < BOARD_SIZE) {
    cells.push(0);
  }

  return { cells, score };
}

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
      ? copyBoard(initialState)
      : createEmptyBoard();

    this.board = copyBoard(this.initialState);
    this.score = 0;
    this.status = STATUS.idle;
  }

  moveLeft() {
    this.move(DIRECTION.left);
  }

  moveRight() {
    this.move(DIRECTION.right);
  }

  moveUp() {
    this.move(DIRECTION.up);
  }

  moveDown() {
    this.move(DIRECTION.down);
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
    return copyBoard(this.board);
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
    if (this.status !== STATUS.idle) {
      return;
    }

    this.addRandomCell();
    this.addRandomCell();
    this.status = STATUS.playing;
  }

  /**
   * Resets the game to the initial state.
   */
  restart() {
    this.board = copyBoard(this.initialState);
    this.score = 0;
    this.status = STATUS.idle;
  }

  // Add your own methods here

  /**
   * Returns the coordinates of the cell that takes the `position` place
   * in the `index` line of the given direction. The 0 position is always
   * the cell the values are moved to, so every direction can reuse
   * the very same `slideLine` helper.
   *
   * @param {string} direction
   * @param {number} index - the index of the row (or of the column)
   * @param {number} position - the place in the line, 0 is the closest
   * to the edge the values are moved to
   * @returns {number[]} a [row, column] pair
   */
  static getCoords(direction, index, position) {
    const last = BOARD_SIZE - 1;

    switch (direction) {
      case DIRECTION.left:
        return [index, position];

      case DIRECTION.right:
        return [index, last - position];

      case DIRECTION.up:
        return [position, index];

      default:
        return [last - position, index];
    }
  }

  /**
   * Moves and merges all the cells in the given direction.
   * The move is applied only if it changes the board.
   *
   * @param {string} direction
   */
  move(direction) {
    if (this.status !== STATUS.playing) {
      return;
    }

    const stateBefore = copyBoard(this.board);
    let gainedScore = 0;

    for (let index = 0; index < BOARD_SIZE; index++) {
      const line = [];

      for (let position = 0; position < BOARD_SIZE; position++) {
        const [row, col] = Game.getCoords(direction, index, position);

        line.push(this.board[row][col]);
      }

      const { cells, score } = slideLine(line);

      gainedScore += score;

      for (let position = 0; position < BOARD_SIZE; position++) {
        const [row, col] = Game.getCoords(direction, index, position);

        this.board[row][col] = cells[position];
      }
    }

    if (this.isSameAs(stateBefore)) {
      return;
    }

    this.score += gainedScore;
    this.addRandomCell();
    this.updateStatus();
  }

  /**
   * @param {number[][]} state
   * @returns {boolean}
   */
  isSameAs(state) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.board[row][col] !== state[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Puts 2 (90% chance) or 4 (10% chance) into a random empty cell.
   */
  addRandomCell() {
    const emptyCells = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [cellRow, cellCol] = emptyCells[randomIndex];

    this.board[cellRow][cellCol] = Math.random() < FOUR_PROBABILITY ? 4 : 2;
  }

  /**
   * @returns {boolean} true if at least one move is still possible
   */
  canMove() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const value = this.board[row][col];

        if (value === 0) {
          return true;
        }

        if (col + 1 < BOARD_SIZE && value === this.board[row][col + 1]) {
          return true;
        }

        if (row + 1 < BOARD_SIZE && value === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Switches the status to `win` or `lose` when the game is over.
   */
  updateStatus() {
    const isWin = this.board.some((row) => row.includes(WINNING_VALUE));

    if (isWin) {
      this.status = STATUS.win;

      return;
    }

    if (!this.canMove()) {
      this.status = STATUS.lose;
    }
  }
}

module.exports = Game;
