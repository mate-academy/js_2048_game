'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.state = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array(this.size)
      .fill(0)
      .map(() => Array(this.size).fill(0));
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
  }

  restart() {
    this.state = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}
}

module.exports = Game;
