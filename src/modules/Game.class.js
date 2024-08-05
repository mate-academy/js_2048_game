'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.status = 'idle';
    this.score = 0;
    this.state = initialState ?? this.getInitialState();
  }

  moveLeft() {
  }

  moveRight() {
  }

  moveUp() {
  }

  moveDown() {
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

    this.state = this.getInitialState();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.INITIAL_STATE;
    this.status = 'idle';
    this.score = 0;
  }

  getRandomPosition() {
    return Math.floor(Math.random() * 4);
  }

  getRandomValue() {
    return Math.floor(Math.random() * 10) < 9 ? 2 : 4;
  }

  getInitialState() {
    const x1 = this.getRandomPosition();
    const y1 = this.getRandomPosition();
    let x2 = this.getRandomPosition();
    let y2 = this.getRandomPosition();

    while (x1 === x2 && y1 === y2) {
      x2 = this.getRandomPosition();
      y2 = this.getRandomPosition();
    }

    const state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    state[x1][y1] = this.getRandomValue();
    state[x2][y2] = this.getRandomValue();

    return state;
  }
}

module.exports = Game;
