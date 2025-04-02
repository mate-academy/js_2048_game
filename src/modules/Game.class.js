'use strict';

class Game {
  /**
   * Default number of starting tiles.
   * @readonly
   * @const
   * @type {number}
   */
  static START_TILES_QUANTITY_DEFAULT = 2;

  /**
   * The default board configuration (a 4x4 grid of zeros).
   * @readonly
   * @const
   * @type {number[][]}
   */
  static DEFAULT_BOARD = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  /**
   * List of keys that represent movement directions.
   * @readonly
   * @const
   * @type {Array<string>}
   */
  static MOVE_KEYS = Object.freeze([
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ]);

  /**
   * Enum for the status of the game.
   * - `Idle`: The game has not started and is idling.
   * - `Playing`: The game has started and is in progress.
   * - `Lost`: The game has finished and the player lost.
   * - `Won`: The game has finished and the player won.
   *
   * @readonly
   * @enum {string}
   */
  static STATUS = Object.freeze({
    Idle: 'Idle',
    Playing: 'Playing',
    Lost: 'Lost',
    Won: 'Won',
  });

  /**
   * Represents current {@link Game.STATUS|status} of the game
   * @type {keyof typeof Game.STATUS}
   * @private
   * @default Game.STATUS.Idle
   */
  _status = Game.STATUS.Idle;
  /**
   * Represents current score of the game
   * @type {number}
   * @private
   */
  _score = 0;
  /**
   * Represents the current state (grid) of the game.
   *
   * The grid is stored as a 2D array where each element represents a tile.
   * Empty tiles are represented by `0`, while others contain powers of two.
   *
   * @type {number[][]}
   * @private
   */
  _state;

  /**
   * Creates a new game instance.
   *
   * This constructor initializes the game with a given board state and the
   * number of tiles to be placed at the start. It also allows for sanitizing
   * the state (if necessary) to ensure that only valid values are used on the
   * board.
   *
   * @param {Object} options - The configuration options for the game instance.
   * @param {number[][]} [options.initialState=null] - The initial state of
   *   the board.
   *
   * If provided, the board will be initialized with the passed array, which
   * must adhere to the 2D grid format. The values in the grid must either be
   * `0` (empty space) or a power of 2 (e.g., 2, 4, 8, etc.). If no
   * `initialState` is provided, the game will use the
   * {@link DEFAULT_BOARD|default grid}.
   *   @default
   *   [
   *     [0, 0, 0, 0],
   *     [0, 0, 0, 0],
   *     [0, 0, 0, 0],
   *     [0, 0, 0, 0]
   *   ]
   *
   * @param {number} [options.startTilesAmount=2] - The initial number of
   *   random tiles to be placed on the board at the start of the game. This
   *   is the number of tiles with values `2` or `4` that will be randomly
   *   placed on the grid when the game begins. The tiles are placed randomly
   *   in empty spots (values of `0`). If not provided,
   * {@link START_TILES_QUANTITY_DEFAULT|default value} will be used.
   *   @default 2
   *
   * @param {boolean} [options.forcePowerOfTwo=false] - Flag to determine
   *   whether the grid values should be sanitized to ensure they are all
   *   powers of two.
   *   - If `true`, all values that are not powers of 2 will be adjusted to
   *     the nearest lower power of 2 or set to `0`.
   *   - If `false`, invalid values will be set to `0`.
   *   @default false
   */

  constructor({
    initialState = null,
    startTilesAmount = Game.START_TILES_QUANTITY_DEFAULT,
    forcePowerOfTwo = false,
  } = {}) {
    const init = Game.sanitizeState(
      initialState || structuredClone(Game.DEFAULT_BOARD),
      forcePowerOfTwo,
    );

    this._state = init;
    this.initialState = structuredClone(init);
    this.startTilesAmount = startTilesAmount;
  }

  /**
   * Starts the game, setting:
   * - the {@link Game._status|status} to {@link Game.STATUS.Playing|`playing`}
   *
   * Places new tiles on the board. The number of tiles placed at the start is
   * determined by the `startTilesAmount` property.
   */
  start() {
    this._status = Game.STATUS.Playing;

    for (let i = 0; i < this.startTilesAmount; i++) {
      this.placeNewTile();
    }
  }

  /**
   * Restarts the game, resetting:
   * - the {@link Game._score|score} to `0`,
   * - the {@link Game._state|state} to {@link DEFAULT_BOARD|default}
   * - the {@link Game._status|status} to {@link Game.STATUS.Idle|`Idle`}
   */
  restart() {
    this._status = Game.STATUS.Idle;
    this._state = structuredClone(this.initialState);
    this._score = 0;
    this.start();
  }

  // #region get (something)

  /**
   * Utility getter, used to get current board size (n*n)
   * @returns {number}
   */
  get size() {
    return this._state.length;
  }

  /**
   * Returns {@link Game._score|current score} of the game
   * @returns {number}
   */
  getScore() {
    return this._score;
  }

  /**
   * Returns {@link Game._state|current state} (grid) of the game
   * @returns {number[][]}
   */
  getState() {
    return this._state;
  }

  /**
   * Returns {@link Game._status|current status} of the game
   * @returns {string}
   */
  getStatus() {
    return this._status;
  }

  // #endregion

  // #region move handlers

  move(key) {
    switch (key) {
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
    }
    this.placeNewTile();
    this.updateGameStatus();
  }

  handleMove() {
    for (let col = 0; col < this.size; col++) {
      const numbers = [];

      for (let row = 0; row < this.size; row++) {
        if (this._state[row][col] !== 0) {
          numbers.push(this._state[row][col]);
        }
      }

      const merged = [];
      let i = 0;

      while (i < numbers.length) {
        if (i + 1 < numbers.length && numbers[i] === numbers[i + 1]) {
          const stackedNumber = numbers[i] * 2;

          merged.push(stackedNumber);
          this._score += stackedNumber;
          i += 2;
        } else {
          merged.push(numbers[i]);
          i++;
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      for (let row = 0; row < this.size; row++) {
        this._state[row][col] = merged[row];
      }
    }
  }

  /**
   * Handles the `ArrowUp` keypress
   */
  moveUp() {
    this.handleMove();
  }

  /**
   * Handles the `ArrowUp` keypress, rotating the grid 180°,
   * applying the handler and rotating the grid back
   */
  moveDown() {
    this.reverseGrid();
    this.handleMove();
    this.reverseGrid();
  }

  /**
   * Handles the `ArrowLeft` keypress
   * and performing the same action as {@link Game.moveDown|moveDown()}, by
   * rotating the matrix by 90° clockwise
   */
  moveLeft() {
    this.rotateClockwise();
    this.handleMove();
    this.rotateCounterClockwise();
  }

  /**
   * Handles the `ArrowRight` keypress
   * and performing the same action as {@link Game.moveDown|moveDown()}, by
   * rotating the matrix by 90° counterclockwise
   */
  moveRight() {
    this.rotateCounterClockwise();
    this.handleMove();
    this.rotateClockwise();
  }

  /**
   * Reverses the order of rows in the grid.
   *
   * Used as a helper method in grid rotation.
   */
  reverseGrid() {
    this._state.reverse();
  }

  /**
   * Transposes the grid by swapping rows and columns.
   *
   * This method is used for rotating the grid by converting rows into columns.
   */
  transpose() {
    for (let i = 0; i < this.size; i++) {
      for (let j = i + 1; j < this.size; j++) {
        [this._state[i][j], this._state[j][i]] = [
          this._state[j][i],
          this._state[i][j],
        ];
      }
    }
  }

  /**
   * Rotates the grid 90° clockwise.
   *
   * This is done by {@link Game.transpose|transposing}
   * the grid and then {@link Game.reverseGrid|reversing} each row.
   */
  rotateClockwise() {
    this.transpose();
    this._state.forEach((row) => row.reverse());
  }

  /**
   * Rotates the grid 90° counterclockwise.
   *
   * This is done by {@link Game.transpose|transposing}
   * the grid and then {@link Game.reverseGrid|reversing} each row.
   */
  rotateCounterClockwise() {
    this._state.forEach((row) => row.reverse());
    this.transpose();
  }

  // #endregion

  /**
   * Updates the game status based on the current game state.
   *
   * - If no move is possible, the {@link Game._status|game status}
   *  is set to `Lost`.
   * - If the board contains the number 2048, the game status is set to `Won`.
   *
   * @returns {void}
   */
  updateGameStatus() {
    if (!this.checkMovePossibility()) {
      this._status = Game.STATUS.Lost;

      return;
    }

    const hasWon = this._state.some((row) => row.includes(2048));

    if (hasWon) {
      this._status = Game.STATUS.Won;
    }
  }

  // #region utility

  /**
   * Sanitizes the game state by ensuring that all values are either 0 or
   * a power of two. Optionally, forces values to the nearest lower power
   * of two.
   *
   * - If `forcePowerOfTwo` is `true`, each value will be replaced with the
   * nearest lower power of two.
   * - If `forcePowerOfTwo` is `false`, only values that are already powers
   * of two are kept, and others are set to 0.
   *
   * @param {number[][]} state - The 2D array representing the initial state
   * of the game board passed as parameter to a constructor.
   * @param {boolean} [forcePowerOfTwo=false] - Whether to force each value
   * to be the nearest lower power of two. Defaults to `false`.
   * @returns {number[][]} A sanitized 2D array with all values being either
   * 0 or a power of two.
   */
  static sanitizeState(state, forcePowerOfTwo = false) {
    const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

    const getNearestLowerPowerOfTwo = (n) => {
      if (n <= 0) {
        return 0;
      }

      return Math.pow(2, Math.floor(Math.log2(n)));
    };

    const sanitizeValue = (val) => {
      if (forcePowerOfTwo) {
        return getNearestLowerPowerOfTwo(val);
      }

      return isPowerOfTwo(val) ? val : 0;
    };

    return state.map((row) => row.map(sanitizeValue));
  }

  /**
   * Returns a random value, either 2 or 4, with a 90% chance of getting 2.
   *
   * @returns {number} 2 or 4, depending on the random chance.
   */
  getTwoOrFour() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  /**
   * Places a new tile (either 2 or 4) in a random empty cell on the game board.
   * The tile is placed in a cell where the current value is 0.
   * If there are no empty cells, no tile is placed.
   */
  placeNewTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this._state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCellIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomCellIndex];

      this._state[row][col] = this.getTwoOrFour();
    }
  }

  /**
   * Checks whether a move is possible in the current game state.
   *
   * A move is possible if:
   * - There is at least one empty cell (value of 0).
   * - Or if there are two adjacent cells (horizontally or vertically)
   * with the same value.
   *
   * @returns {boolean} `true` if a move is possible, otherwise `false`.
   */
  checkMovePossibility() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = this._state[row][col];

        if (!cell) {
          return true;
        }

        if (col < this.size - 1 && this._state[row][col + 1] === cell) {
          return true;
        }

        if (row < this.size - 1 && this._state[row + 1][col] === cell) {
          return true;
        }
      }
    }

    return false;
  }

  // #endregion
}

module.exports = Game;
