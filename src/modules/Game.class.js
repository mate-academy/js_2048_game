'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  static INITIAL_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState = Game.INITIAL_STATE) {
    this.grid = initialState;
    this.status = Game.STATUS.idle;
    this.score = 0;
    this.moves = 0;
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

  /**
   * Starts the game.
   */
  start() {
    this.status = Game.STATUS.playing;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = Game.STATUS.idle;
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  // Add your own methods here
  getRandomCell() {
    while (true) {
      const totalCells = this.grid.length * this.grid[0].length;
      const randomIndex = Math.floor(Math.random() * totalCells);
      const x = Math.floor(randomIndex / this.grid[0].length);
      const y = randomIndex % this.grid[0].length;
      const value = Math.random() > 0.5 ? 2 : 4;

      if (this.isEmpty(this.grid[x][y])) {
        this.grid[x][y] = value;
        return [x, y, value];
      }
    }
  }

  isEmpty(cell) {
    return cell === 0;
  }
}

module.exports = Game;
