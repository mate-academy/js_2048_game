'use strict';

const {
  CELL_VALUES,
  FOUR_PROBABILITY,
  STATUS,
  WINNING_VALUE,
} = require('./config');
const Board = require('./Board');
const { move } = require('./moves');

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
  constructor(initialState = Board.create()) {
    this.initialState = Board.copy(initialState);
    this.state = Board.copy(initialState);
    this.score = 0;
    this.status = STATUS.idle;
  }

  moveLeft() {
    this.makeMove('left');
  }

  moveRight() {
    this.makeMove('right');
  }

  moveUp() {
    this.makeMove('up');
  }

  moveDown() {
    this.makeMove('down');
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
    return Board.copy(this.state);
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
    this.status = STATUS.playing;

    this.addRandomCell();
    this.addRandomCell();
    this.updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = Board.copy(this.initialState);
    this.score = 0;
    this.status = STATUS.idle;
  }

  makeMove(direction) {
    if (this.status !== STATUS.playing) {
      return;
    }

    const previousState = this.state;
    const result = move(this.state, direction);

    this.state = result.board;

    if (Board.equals(previousState, this.state)) {
      return;
    }

    this.score += result.gained;
    this.addRandomCell();
    this.updateStatus();
  }

  addRandomCell() {
    const cells = Board.emptyCells(this.state);

    if (cells.length === 0) {
      return;
    }

    const [row, column] = cells[Math.floor(Math.random() * cells.length)];

    this.state[row][column] =
      Math.random() < FOUR_PROBABILITY ? CELL_VALUES.rare : CELL_VALUES.common;
  }

  updateStatus() {
    if (Board.contains(this.state, WINNING_VALUE)) {
      this.status = STATUS.win;

      return;
    }

    if (!Board.hasMoves(this.state)) {
      this.status = STATUS.lose;
    }
  }
}

module.exports = Game;
