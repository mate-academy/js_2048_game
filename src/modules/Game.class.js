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
  constructor(initialState) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.fields = initialState;
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
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

  addNewNumberField(number, findEmtpyCells) {
    const emtpyCells = findEmtpyCells(this.fields);
    const randomIndex = Math.floor(Math.random() * emtpyCells.length);
    const [randomRow, randomCol] = emtpyCells[randomIndex];

    this.fields[randomRow][randomCol] = number;
  }

  /**
   * Starts the game.
   */
  start(generate2or4, findEmptyCells, renderCells) {
    const number1 = generate2or4();
    const number2 = generate2or4();

    this.addNewNumberField(number1, findEmptyCells);
    this.addNewNumberField(number2, findEmptyCells);

    renderCells();
  }

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
}

module.exports = Game;
