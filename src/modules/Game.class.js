'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static GAME_SIZE = 4;
  static EMPTY_STATE = Object.freeze([
    Object.freeze(Array(Game.GAME_SIZE).fill(0)),
    Object.freeze(Array(Game.GAME_SIZE).fill(0)),
    Object.freeze(Array(Game.GAME_SIZE).fill(0)),
    Object.freeze(Array(Game.GAME_SIZE).fill(0)),
  ]);

  constructor(initialState) {
    this.status = 'idle';
    this.score = 0;
    this.state = initialState ?? this.getInitialState();
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

  moveUp() {}

  moveDown() {}

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
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.getInitialState();
    this.status = 'idle';
    this.score = 0;
  }

  getRandomPosition() {
    return Math.floor(Math.random() * Game.GAME_SIZE);
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

    const state = JSON.parse(JSON.stringify(Game.EMPTY_STATE));

    state[y1][x1] = this.getRandomValue();
    state[y2][x2] = this.getRandomValue();

    return state;
  }

  addCellToState() {
    let isEmptyCellExist = false;

    for (let i = 0; i < Game.GAME_SIZE; i++) {
      if (this.state[i].includes(0)) {
        isEmptyCellExist = true;
        break;
      }
    }

    if (!isEmptyCellExist) {
      return;
    }

    let x = this.getRandomPosition();
    let y = this.getRandomPosition();

    while (this.state[y][x] !== 0) {
      x = this.getRandomPosition();
      y = this.getRandomPosition();
    }

    this.state[y][x] = this.getRandomValue();
  }
}

module.exports = Game;
