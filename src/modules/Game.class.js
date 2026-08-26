'use strict';

/**
 * This class represents the game.
 */
class Game {
  /**
   * Creates a new game instance.
   * @param {number[][]} initialState
   */
  constructor(initialState) {
    this.initialState =
      initialState || Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.isFirstMoveMade = false;
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
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
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';

    if (!this.hasTiles()) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';
    this.isFirstMoveMade = false;

    if (!this.hasTiles()) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  hasTiles() {
    return this.state.some((row) => row.some((cell) => cell > 0));
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const oldState = JSON.stringify(this.state);

    if (direction === 'left' || direction === 'right') {
      for (let row = 0; row < 4; row++) {
        let line = [...this.state[row]];

        if (direction === 'right') {
          line.reverse();
        }
        line = this.mergeLine(line);

        if (direction === 'right') {
          line.reverse();
        }
        this.state[row] = line;
      }
    }

    if (direction === 'up' || direction === 'down') {
      for (let col = 0; col < 4; col++) {
        let line = [];

        for (let row = 0; row < 4; row++) {
          line.push(this.state[row][col]);
        }

        if (direction === 'down') {
          line.reverse();
        }
        line = this.mergeLine(line);

        if (direction === 'down') {
          line.reverse();
        }

        for (let row = 0; row < 4; row++) {
          this.state[row][col] = line[row];
        }
      }
    }

    const newState = JSON.stringify(this.state);

    if (oldState === newState) {
      return false;
    }

    this.isFirstMoveMade = true;
    this.addRandomTile();

    if (this.has2048()) {
      this.status = 'win';

      return true;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }

    return true;
  }

  mergeLine(line) {
    const numbers = line.filter((value) => value !== 0);
    const result = [];
    let index = 0;

    while (index < numbers.length) {
      if (index < numbers.length - 1 && numbers[index] === numbers[index + 1]) {
        const mergedValue = numbers[index] * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        index += 2;
      } else {
        result.push(numbers[index]);
        index++;
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ row: r, column: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const idx = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[idx];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[cell.row][cell.column] = value;
  }

  has2048() {
    return this.state.some((row) => row.includes(2048));
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.state[r][c] === this.state[r][c + 1]) {
          return true;
        }
      }
    }

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

// Експорт для одночасної сумісності з Jest та Parcel
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Game;
} else {
  window.Game = Game;
}
