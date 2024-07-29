'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  INITIAL_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState = this.INITIAL_STATE) {
    this.state = initialState;
    this.status = 'idle';
  }

  moveLeft() {}

  moveRight() {}

  moveUp() {}

  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {
    let sum = 0;

    for (const row of this.state) {
      for (const el of row) {
        sum += el;
      }
    }

    return sum;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
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
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.INITIAL_STATE;
    this.status = 'idle';
  }

  getRandomPosition() {
    return [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
  }

  getRandomValue() {
    return Math.floor(Math.random() * 10) < 9 ? 2 : 4;
  }
}

module.exports = Game;
