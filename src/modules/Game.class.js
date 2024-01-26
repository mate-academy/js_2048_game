'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to extend it as you wish.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {Array<Array<number>>} initialState
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
    initialState,
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
   *
   * @returns {number}
   */
  getScore() {}

  /**
   * Returns the current game state.
   *
   * @returns {Array<Array<number>>}
   */
  getState() {}

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
