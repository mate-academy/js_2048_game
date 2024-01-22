'use strict';

/**
 * This class represents the game.
 */
class Game {
  /**
   * Creates a new game instance.
   * @param {Array<Array<number>>} initialState The initial state of the board.
   * @param {number} initialScore The initial score.
   *
   * If provided, the board will be initialized with the provided
   * initial values.
   */
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    initialScore = 0,
  ) {
    this._state = initialState;
    this._score = initialScore;
    this._status = 'idle'; // Possible values: idle, playing, win, lose
  }

  /**
   * Moves all non-empty cells to the left.
   *
   * @returns {string} The current game status: idle, playing, win, lose
   */
  moveLeft() {}

  /**
   * Moves all non-empty cells to the right.
   *
   * @returns {string} The current game status: idle, playing, win, lose
   */
  moveRight() {}

  /**
   * Moves all non-empty cells up.
   *
   * @returns {string} The current game status: idle, playing, win, lose
   */
  moveUp() {}

  /**
   * Moves all non-empty cells down.
   *
   * @returns {string} The current game status: idle, playing, win, lose
   */
  moveDown() {}

  /**
   * Updates the game score.
   * @param {number} value The value to replace the current score with.
   */
  set score(value) {}

  /**
   * Returns the current game score.
   * @returns {number} The current game score.
   */
  get score() {}

  /**
   * Updates the game state.
   * @param {Array<Array<number>>} value The value to replace
   * the current state with.
   */
  set state(value) {}

  /**
   * Returns the current game state.
   * @returns {Array<Array<number>>} The current game state.
   */
  get state() {}

  /**
   * Updates the game status.
   * @param {string} value The value to replace the current status with.
   * Possible values: idle, playing, win, lose
   */
  set status(value) {}

  /**
   * Returns the current game status.
   *
   * @returns {string} The current game status: idle, playing, win, lose
   */
  get status() {}

  /**
   * Starts the game.
   * Sets the status to 'playing'.
   * Generates two random cells on the board.
   */
  start() {}

  /**
   * Resets the score and the status.
   * Sets the board to the empty state.
   */
  restart() {}

  // Add your own methods here
}

module.exports = Game;
