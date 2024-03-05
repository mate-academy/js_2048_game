'use strict';

// const getRandomNumber = require('../utils/getRandomNumber');
const Board = require('./Board');
const getRandomNumber = require('./getRandomNumber');

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static STATUSES = {
    idle: 'idle',
    playing: 'playing',
    lose: 'lose',
    win: 'win',
  };

  #initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  #board;
  #score;
  #status;

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
    this.#initialState = initialState ?? this.#initialState;
    this.restart();
  }

  moveLeft() {
    this.move(() => this.#board.getMovedLeftState());
  }
  moveRight() {
    this.move(() => this.#board.getMovedRightState());
  }
  moveUp() {
    this.move(() => this.#board.getMovedUpState());
  }
  moveDown() {
    this.move(() => this.#board.getMovedDownState());
  }

  move(cb) {
    this.#checkLose();

    if (this.#status !== Game.STATUSES.playing) {
      return;
    }

    const { newState, mergedValues } = cb();

    if (JSON.stringify(newState) === JSON.stringify(this.#board.getState())) {
      return;
    }

    this.#score += mergedValues.reduce((sum, value) => sum + value, 0);
    this.#board = new Board(newState);
    this.#checkWin();
    this.#fillRandomCell();
  }
  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#board.getState();
  }

  /**
   * Returns the current game status.
   *
   * @returns {Game.STATUSES[keyof Game.STATUSES]}
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    const CELLS_TO_FILL = 2;

    this.#status = Game.STATUSES.playing;

    for (let cellsLeft = CELLS_TO_FILL; cellsLeft > 0; cellsLeft--) {
      this.#fillRandomCell();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#status = Game.STATUSES.idle;
    this.#score = 0;
    this.#board = new Board(this.#initialState);
  }

  #checkWin() {
    const WIN_VALUE = 2048;
    const doesStateIncludeWinValue = this.#board
      .getState()
      .flat()
      .find((value) => value === WIN_VALUE);

    if (doesStateIncludeWinValue) {
      this.#status = Game.STATUSES.win;
    }
  }

  #checkLose() {
    const state = this.#board.getState();
    const canStateBeChanged = [
      'getMovedUpState',
      'getMovedRightState',
      'getMovedLeftState',
      'getMovedDownState',
    ].some((getMovedState) => {
      const { newState } = this.#board[getMovedState]();

      return JSON.stringify(state) !== JSON.stringify(newState);
    });

    if (canStateBeChanged) {
      return;
    }
    this.#status = Game.STATUSES.lose;
  }

  #fillRandomCell() {
    const SMALL_NUMBER = 2;
    const BIG_NUMBER = 4;

    if (this.#status !== Game.STATUSES.playing) {
      return;
    }

    const removeZeros = (value) => value === 0;
    const cellsWithZeros = this.#board.filterCells(removeZeros);

    if (cellsWithZeros.length === 0) {
      return;
    }

    const { x, y } = cellsWithZeros[getRandomNumber(cellsWithZeros.length)];
    const state = this.#board.getState();

    state[y][x] = getRandomNumber(10) === 0 ? BIG_NUMBER : SMALL_NUMBER;

    this.#board = new Board(state);
  }
}

module.exports = Game;
