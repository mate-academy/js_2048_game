'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = initialState;
    this.score = 0;
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}
  getScore() {}
  getState() {}
  getStatus() {}
  start() {}
  restart() {}
  getRandomNumber() {}
  addNumber() {}
  canMove() {}
  getEmptyCells() {}
  fillCells() {}
  moveUtil() {}
}

module.exports = Game;
