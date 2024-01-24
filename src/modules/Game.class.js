'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to extend it as you wish.
 */
class Game {
  /**
   * Creates a new game instance.
   * @param {Array<Array<number>>} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * @param {number} initialScore
   * The initial score.
   * @default 0
   *
   * @param {string} initialStatus
   * The initial status: 'idle', 'playing', 'win', 'lose'
   * @default 'idle'
   *
   * If provided, the board will be initialized with the provided
   * initial values.
   */
  constructor(
    initialState,
    initialScore,
    initialStatus,
  ) {}

  /**
   * Movement methods
   */
  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

  /**
   * Returns the current game score.
   * @returns {number} The current game score.
   */
  getScore() {}

  /**
   * Returns the current game state.
   * @returns {Array<Array<number>>} The current game state.
   */
  getState() {}

  /**
   * Returns the current game status.
   * @returns {string} The current game status: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {}

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
}

module.exports = Game;
