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
  initialState;
  status = 'idle';

  constructor(initialState) {
    this.initialState = initialState;
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.status === 'playing') {
      for (let i = 0; i < 4; i++) {
        const line = this.mergeLine([
          this.initialState[i][0],
          this.initialState[i][1],
          this.initialState[i][2],
          this.initialState[i][3],
        ]);

        for (let j = 0; j < 4; j++) {
          this.initialState[i][j] = line[j];
        }
      }
    }
  }
  moveRight() {
    if (this.status === 'playing') {
      for (let i = 0; i < 4; i++) {
        const line = this.mergeLine([
          this.initialState[i][0],
          this.initialState[i][1],
          this.initialState[i][2],
          this.initialState[i][3],
        ]).reverse();

        const newLine = this.mergeLine(line);
        const finalLine = newLine.reverse();

        for (let j = 0; j < 4; j++) {
          this.initialState[i][j] = finalLine[j];
        }
      }
    }
  }
  moveUp() {
    if (this.status === 'playing') {
      for (let i = 0; i < 4; i++) {
        const line = this.mergeLine([
          this.initialState[0][i],
          this.initialState[1][i],
          this.initialState[2][i],
          this.initialState[3][i],
        ]);

        for (let j = 0; j < 4; j++) {
          this.initialState[j][i] = line[j];
        }
      }
    }
  }
  moveDown() {
    if (this.status === 'playing') {
      for (let i = 0; i < 4; i++) {
        const line = [
          this.initialState[0][i],
          this.initialState[1][i],
          this.initialState[2][i],
          this.initialState[3][i],
        ].reverse();

        const newLine = this.mergeLine(line);
        const finalLine = newLine.reverse();

        for (let j = 0; j < 4; j++) {
          this.initialState[j][i] = finalLine[j];
        }
      }
    }
  }

  getScore() {
    let score = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        score += this.initialState[i][j];
      }
    }

    return score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.initialState;
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
  start() {}

  /**
   * Resets the game.
   */
  restart() {}

  mergeLine(line) {
    const filtered = line.filter((n) => n !== 0);

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;
      }
    }

    const result = filtered.filter((n) => n !== 0);

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }
}

module.exports = Game;
