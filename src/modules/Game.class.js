'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static numbersToAppear = [2, 2, 2, 2, 4];
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
  constructor() {
    // eslint-disable-next-line no-console
    this.board = Game.initialState;
    this.score = 0;
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
  getState() {
    return this.board;
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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    this.insertNumberOnBoard();
    this.insertNumberOnBoard();
  }

  insertNumberOnBoard() {
    const emptySpacesOnBoard = this.getFreeSpaces();
    const randomNumber = this.getRandomNumber(1, emptySpacesOnBoard);

    let countIndex = 0;

    this.board = this.board.map((row) => {
      return row.map((element) => {
        if (element === 0) {
          if (countIndex === randomNumber - 1) {
            countIndex++;

            return Game.numbersToAppear[
              Math.floor(Math.random() * Game.numbersToAppear.length)
            ];
          }
          countIndex++;

          return element;
        }

        return element;
      });
    });
  }

  getFreeSpaces() {
    let freeSpacesCount = 0;

    this.board.forEach((row) => {
      return row.forEach((element) => {
        if (element === 0) {
          freeSpacesCount++;
        }
      });
    });

    return freeSpacesCount;
  }

  getRandomNumber(min, max) {
    const minCeiled = Math.ceil(min);

    return Math.floor(
      Math.random() * (Math.floor(max) - minCeiled + 1) + minCeiled,
    );
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Game.initialState;
    this.score = 0;

    this.insertNumberOnBoard();
    this.insertNumberOnBoard();
  }

  // Add your own methods here
}

module.exports = Game;
