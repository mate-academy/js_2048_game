'use strict';

const BOARD_SIZE = 4;

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
  static GOAL_OF_VICTORY = 2048;

  static DIRECTION = Object.freeze({
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
  });

  static STATUS = Object.freeze({
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  });

  /**
   * Deep copies the game field, so changes to the copy
   * never affect the original.
   * @param {number[][]} state
   * @returns {number[][]}
   */
  static copyState(state) {
    return state.map((row) => [...row]);
  }

  /**
   * Creates two-dimensional array filled with zeros.
   * @returns {number[][]}
   */
  static createEmptyField() {
    const field = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      field.push(new Array(BOARD_SIZE).fill(0));
    }

    return field;
  }

  constructor(initialState = Game.createEmptyField()) {
    this.initialialState = Game.copyState(initialState);
    this.field = initialState;
    this.score = 0;
    this.status = Game.STATUS.IDLE;
  }

  /**
   * Moves tiles to the left, if possible.
   *
   * Determines - is move actualy has done?
   * @param {number[][]} field board of the game.
   * @param {boolean} isTest determines a mode in which the method will operate.
   * @returns {boolean} true - move has done. false - move has not done.
   */
  moveLeft(field = this.field, isTest = false) {
    if (this.getStatus() !== Game.STATUS.PLAYING) {
      return false;
    }

    let moved = false;

    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowBeforeMove = field[row];
      const copy = [...field[row]];
      const shifted = this.shiftRow(copy, Game.DIRECTION.LEFT);
      const merged = this.mergeTiles(shifted, Game.DIRECTION.LEFT, isTest);

      // compare old with new row and if we found difference
      // then it's counts as a move
      // update state of the game and return true
      // as sign to render updated state of the game
      if (JSON.stringify(rowBeforeMove) !== JSON.stringify(merged)) {
        // in test mode we only check possibility of move
        // and if so - we return true and finish the function.
        if (isTest) {
          return true;
        }
        field[row] = merged;
        moved = true;
      }
    }

    if (moved) {
      if (this.isGameWon()) {
        this.status = Game.STATUS.WIN;

        return moved;
      }

      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = Game.STATUS.LOSE;
      }
    }

    return moved;
  }

  /**
   * Moves tiles to the right, if possible.
   *
   * Determines - is move actualy has done?
   * @param {number[][]} field board of the game.
   * @param {boolean} isTest determines a mode in which the method will operate.
   * @returns {boolean} true - move has done. false - move has not done.
   */
  moveRight(field = this.field, isTest = false) {
    if (this.getStatus() !== Game.STATUS.PLAYING) {
      return false;
    }

    let moved = false;

    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowBeforeMove = field[row];
      const copy = [...field[row]];
      const shifted = this.shiftRow(copy, Game.DIRECTION.RIGHT);
      const merged = this.mergeTiles(shifted, Game.DIRECTION.RIGHT, isTest);

      // compare old with new row and if we found difference
      // then it's counts as a move
      // update state of the game and return true
      // as sign to add random tile on the board of the game
      if (JSON.stringify(rowBeforeMove) !== JSON.stringify(merged)) {
        // in test mode we only check possibility of move
        // and if so - we return true and finish the function.
        if (isTest) {
          return true;
        }
        moved = true;
        field[row] = merged;
      }
    }

    if (moved) {
      if (this.isGameWon()) {
        this.status = Game.STATUS.WIN;

        return moved;
      }

      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = Game.STATUS.LOSE;
      }
    }

    return moved;
  }

  /**
   * Moves tiles upward, if possible.
   *
   * Determines - is move actualy has done?
   * @param {number[][]} field board of the game.
   * @param {boolean} isTest determines a mode in which the method will operate.
   * @returns {boolean} true - move has done / false - move has not done.
   */
  moveUp(field = this.field, isTest = false) {
    if (this.getStatus() !== Game.STATUS.PLAYING) {
      return;
    }

    const stateBeforeMove = field;
    const copy = Game.copyState(field);

    const shifted = this.shiftColumns(copy, Game.DIRECTION.UP);
    const merged = this.mergeColumns(shifted, Game.DIRECTION.UP, isTest);

    if (JSON.stringify(stateBeforeMove) !== JSON.stringify(merged)) {
      // in test mode we only check possibility of move
      // and if so - we return true and finish the function.
      if (isTest) {
        return true;
      }

      this.field = merged;

      if (this.isGameWon()) {
        this.status = Game.STATUS.WIN;

        return true;
      }

      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = Game.STATUS.LOSE;
      }

      return true;
    }

    return false;
  }

  /**
   * Moves tiles down, if possible.
   *
   * Determines - is move actualy has done?
   * isTest parameter determines the mode in which the method will operate
   * @param {number[][]} field the board of the game
   * @param {boolean} isTest determines a mode in which the method will operate.
   * @returns {boolean} true - move has done / false - move has not done.
   */
  moveDown(field = this.field, isTest = false) {
    if (this.getStatus() !== Game.STATUS.PLAYING) {
      return;
    }

    const stateBeforeMove = field;
    const copy = Game.copyState(field);

    const shifted = this.shiftColumns(copy, Game.DIRECTION.DOWN);
    const merged = this.mergeColumns(shifted, Game.DIRECTION.DOWN, isTest);

    if (JSON.stringify(stateBeforeMove) !== JSON.stringify(merged)) {
      // in test mode we only check possibility of move
      // and if so - we return true and finish the function.
      if (isTest) {
        return true;
      }

      this.field = merged;

      if (this.isGameWon()) {
        this.status = Game.STATUS.WIN;

        return true;
      }

      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = Game.STATUS.LOSE;
      }

      return true;
    }

    return false;
  }

  /**
   * @returns {number} score of the game
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]} state of the game
   */
  getState() {
    return this.field;
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
   * Starts the game with two random tiles.
   */
  start() {
    this.status = Game.STATUS.PLAYING;
    this.score = 0;

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = Game.STATUS.IDLE;
    this.score = 0;
    this.field = Game.copyState(this.initialialState);
  }

  /**
   * Finds a random empty tile and places 2 or 4 on the board.
   * Probability of appering number 4 on the board is 10%
   */
  addRandomTile() {
    const emptyTiles = [];
    const board = this.getState();

    if (!board || !board.length) {
      return;
    }

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] === 0) {
          emptyTiles.push({ row: r, col: c });
        }
      }
    }

    if (emptyTiles.length === 0) {
      return;
    }

    // get random cell using Math methods
    const { row, col } =
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    // placing 2 or 4 (4 is probability 10%) into the empty tile
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
    // save last spawn placement to use for styles
    this.lastSpawn = { row, col };
  }

  /**
   * Shifts all zeros in the row
   * in the oposite direction specified as a parameter.
   * @param {number[]} row
   * @param {string} direction 'left' or 'right'
   * @returns {number[]} the shifted row
   */
  shiftRow(row, direction) {
    // filter out zeros
    const numbers = row.filter((n) => n !== 0);
    const zeros = new Array(BOARD_SIZE - numbers.length).fill(0);

    if (direction === Game.DIRECTION.LEFT) {
      return [...numbers, ...zeros];
    }

    if (direction === Game.DIRECTION.RIGHT) {
      return [...zeros, ...numbers];
    }
  }

  /**
   * Finds and merges equal numbers.
   *
   * example --> before: [2, 2, 4, 8] after: [4, 4, 8, 0]
   *
   * isTest parameter determines the mode in which the method will operate
   * @param {number[]} row
   * @param {string} direction 'left' or 'right'
   * @param {boolean} isTest determines in which mode the method will operate.
   * @returns {number[]} the row with merged numbers.
   */
  mergeTiles(row, direction, isTest) {
    if (direction === Game.DIRECTION.LEFT) {
      for (let col = 0; col < BOARD_SIZE - 1; col++) {
        const current = row[col];
        const next = row[col + 1];

        if (current === 0 || current !== next) {
          continue;
        }

        row[col] *= 2;

        // in test mode we do not modify score of the game
        if (!isTest) {
          this.score += row[col];
        }
        row[col + 1] = 0;
      }
    }

    if (direction === Game.DIRECTION.RIGHT) {
      for (let col = BOARD_SIZE - 1; col > 0; col--) {
        const current = row[col];
        const previos = row[col - 1];

        if (current === 0 || current !== previos) {
          continue;
        }

        row[col] *= 2;

        // in test mode we do not modify score of the game
        if (!isTest) {
          this.score += row[col];
        }

        row[col - 1] = 0;
      }
    }

    return this.shiftRow(row, direction);
  }

  /**
   * Shifts all zeros in the colomn
   * in the oposite direction specified as a parameter.
   * @param {number[][]} field
   * @param {string} direction 'up' or 'down'
   * @returns {number[][]} the shifted field of the game.
   */
  shiftColumns(field, direction) {
    // loop throuh each colomn and colect each number of it
    for (let col = 0; col < BOARD_SIZE; col++) {
      const colomn = [];

      for (let row = 0; row < BOARD_SIZE; row++) {
        colomn.push(field[row][col]);
      }

      const numbers = colomn.filter((n) => n); // filter out zeros

      // create an array filled with zeros, equal to the length of the numbers
      const zeros = new Array(BOARD_SIZE - numbers.length).fill(0);

      // create shifted colomn based on the direction
      const shifted =
        direction === Game.DIRECTION.DOWN
          ? [...zeros, ...numbers]
          : [...numbers, ...zeros];

      // modify each column of the game
      for (let row = 0; row < BOARD_SIZE; row++) {
        field[row][col] = shifted[row];
      }
    }

    return field;
  }

  /**
   * Finds and merges equal numbers
   * isTest parameter determines the mode in which the method will operate
   * @param {number[][]} field
   * @param {string} direction 'up' or 'down'
   * @param {boolean} isTest determines in which mode the method will operate.
   * @returns {number[][]} merged field of the game.
   */
  mergeColumns(field, direction, isTest) {
    //  We determine in which direction the column will be merged
    const rowDirection =
      direction === Game.DIRECTION.UP
        ? Game.DIRECTION.LEFT
        : Game.DIRECTION.RIGHT;

    // extract the column for merging tiles
    for (let col = 0; col < BOARD_SIZE; col++) {
      const column = [];

      for (let row = 0; row < BOARD_SIZE; row++) {
        column.push(field[row][col]);
      }

      // since the columns are rotated rows we reusing mergeTiles method
      const mergedColomn = this.mergeTiles(column, rowDirection, isTest);

      // insert merged column
      for (let row = 0; row < BOARD_SIZE; row++) {
        field[row][col] = mergedColomn[row];
      }
    }

    return field;
  }

  /**
   * Determines - is any move available?
   * @returns {boolean}
   *
   * true - the game is over.
   * false - a move is still available.
   */
  isGameOver() {
    const state = this.getState();
    const stateCopy = Game.copyState(state);
    const hasEmptyTile = state.flat().some((tile) => tile === 0);

    if (hasEmptyTile) {
      return false;
    }

    if (this.moveLeft(stateCopy, true)) {
      return false;
    }

    if (this.moveRight(stateCopy, true)) {
      return false;
    }

    if (this.moveUp(stateCopy, true)) {
      return false;
    }

    if (this.moveDown(stateCopy, true)) {
      return false;
    }

    return true;
  }

  /**
   * Determines whether tile 2048 is on the board.
   * @returns {boolean}
   */
  isGameWon() {
    const state = this.getState();
    const has2028Tile = state
      .flat()
      .some((tile) => tile === Game.GOAL_OF_VICTORY);

    return has2028Tile;
  }
}

module.exports = Game;
