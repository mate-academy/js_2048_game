'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static GAME_SIZE = 4;

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.status = 'idle';
    this.score = 0;
    this.state = initialState;
    this.initialState = JSON.parse(JSON.stringify(initialState));
  }

  moveLeft() {
    for (let y = 0; y < Game.GAME_SIZE; y++) {
      const newRow = [];
      let allowToAdd = true;

      for (let x = 0; x < Game.GAME_SIZE; x++) {
        if (this.state[y][x] === 0) {
          continue;
        }

        if (
          x === 0 ||
          !allowToAdd ||
          this.state[y][x] !== newRow[newRow.length - 1]
        ) {
          newRow.push(this.state[y][x]);
          allowToAdd = true;
          continue;
        }

        newRow[newRow.length - 1] += this.state[y][x];
        this.score += newRow[newRow.length - 1];
        allowToAdd = false;
      }

      while (newRow.length < Game.GAME_SIZE) {
        newRow.push(0);
      }
      this.state[y] = newRow;
    }
  }

  moveRight() {
    const lastIndex = Game.GAME_SIZE - 1;

    for (let y = lastIndex; y >= 0; y--) {
      const newRow = [];
      let allowToAdd = true;

      for (let x = lastIndex; x >= 0; x--) {
        if (this.state[y][x] === 0) {
          continue;
        }

        if (x === lastIndex || !allowToAdd || this.state[y][x] !== newRow[0]) {
          newRow.unshift(this.state[y][x]);
          allowToAdd = true;
          continue;
        }

        newRow[0] += this.state[y][x];
        this.score += newRow[0];
        allowToAdd = false;
      }

      while (newRow.length < Game.GAME_SIZE) {
        newRow.unshift(0);
      }
      this.state[y] = newRow;
    }
  }

  moveUp() {
    for (let x = 0; x < Game.GAME_SIZE; x++) {
      const newColumn = [];
      let allowToAdd = true;

      for (let y = 0; y < Game.GAME_SIZE; y++) {
        if (this.state[y][x] === 0) {
          continue;
        }

        if (
          y === 0 ||
          !allowToAdd ||
          this.state[y][x] !== newColumn[newColumn.length - 1]
        ) {
          newColumn.push(this.state[y][x]);
          allowToAdd = true;
          continue;
        }

        newColumn[newColumn.length - 1] += this.state[y][x];
        this.score += newColumn[newColumn.length - 1];
        allowToAdd = false;
      }

      for (let y = 0; y < Game.GAME_SIZE; y++) {
        this.state[y][x] = newColumn[y] ? newColumn[y] : 0;
      }
    }
  }

  moveDown() {
    const lastIndex = Game.GAME_SIZE - 1;

    for (let x = lastIndex; x >= 0; x--) {
      const newColumn = [];
      let allowToAdd = true;

      for (let y = lastIndex; y >= 0; y--) {
        if (this.state[y][x] === 0) {
          continue;
        }

        if (
          y === lastIndex ||
          !allowToAdd ||
          this.state[y][x] !== newColumn[0]
        ) {
          newColumn.unshift(this.state[y][x]);
          allowToAdd = true;
          continue;
        }

        newColumn[0] += this.state[y][x];
        this.score += newColumn[0];
        allowToAdd = false;
      }

      for (let y = lastIndex; y >= 0; y--) {
        const index = y - (Game.GAME_SIZE - newColumn.length);

        this.state[y][x] = newColumn[index] ? newColumn[index] : 0;
      }
    }
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
    this.initializeState();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.state = JSON.parse(JSON.stringify(this.initialState));
  }

  getRandomPosition() {
    return Math.floor(Math.random() * Game.GAME_SIZE);
  }

  getRandomValue() {
    return Math.floor(Math.random() * 10) < 9 ? 2 : 4;
  }

  addCellToState() {
    if (!this.hasEmptyCell()) {
      return;
    }

    let x;
    let y;

    do {
      x = this.getRandomPosition();
      y = this.getRandomPosition();
    } while (this.state[y][x] !== 0);

    this.state[y][x] = this.getRandomValue();
  }

  initializeState() {
    this.addCellToState();
    this.addCellToState();
  }

  hasEmptyCell() {
    for (let i = 0; i < Game.GAME_SIZE; i++) {
      if (this.state[i].includes(0)) {
        return true;
      }
    }

    return false;
  }

  has2048() {
    for (let i = 0; i < Game.GAME_SIZE; i++) {
      if (this.state[i].includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  hasMove() {
    if (this.hasEmptyCell()) {
      return true;
    }

    for (let y = 0; y < Game.GAME_SIZE; y++) {
      for (let x = 1; x < Game.GAME_SIZE; x++) {
        if (this.state[y][x] === this.state[y][x - 1]) {
          return true;
        }
      }
    }

    for (let x = 0; x < Game.GAME_SIZE; x++) {
      for (let y = 1; y < Game.GAME_SIZE; y++) {
        if (this.state[y][x] === this.state[y - 1][x]) {
          return true;
        }
      }
    }

    this.status = 'lose';

    return false;
  }
}

module.exports = Game;
