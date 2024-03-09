/* eslint-disable */

'use strict';
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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
  ) {
    // eslint-disable-next-line no-console
    console.log(initialState, 'initial state');
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
    // this.rows = rows;


  }

  moveLeft() {}
  moveRight() {}

  moveUp() {

  }
  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
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
  start(name) {
    // eslint-disable-next-line no-console
    console.log(Math.floor(Math.random() * 4));
    console.log('The game has started', this.board[0].cells,  name);
    this.board[Math.floor(Math.random() * 4)].cells[Math.floor(Math.random() * 4)].innerText = 2;
    this.board[Math.floor(Math.random() * 4)].cells[Math.floor(Math.random() * 4)].innerText = 2;
    console.log(this.board[1].cells[1].value, 'board ');
  }

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
}

module.exports = Game;
