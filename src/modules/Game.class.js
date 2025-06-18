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
    ],
  ) {
    this.initialState = initialState;
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.state = initialState.map((row) => row.slice());
  }

  /**
   * Moves tiles in provided direction
   *
   * @param {string} callback
   * Name of corresponding method with an axis
   * @param {boolean} direction
   * Reflects the positive or negative direction of the axis
   */

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row: randomRow, col: randomCol } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  moveRow(row, reverse = false) {
    const workingRow = reverse ? [...row].reverse() : [...row];
    const withoutZeros = workingRow.filter((n) => n !== 0);
    const merged = [];
    let scoreDelta = 0;

    for (let i = 0; i < withoutZeros.length; i++) {
      if (withoutZeros[i] === withoutZeros[i + 1]) {
        const mergedValue = withoutZeros[i] * 2;

        merged.push(mergedValue);
        scoreDelta += mergedValue;
        i++;
      } else {
        merged.push(withoutZeros[i]);
      }
    }

    while (merged.length < row.length) {
      merged.push(0);
    }

    const resultRow = reverse ? merged.reverse() : merged;

    return { row: resultRow, scoreDelta };
  }

  transpose(state) {
    const result = [];

    for (let i = 0; i < state[0].length; i++) {
      const newRow = [];

      for (let j = 0; j < state.length; j++) {
        newRow.push(state[j][i]);
      }
      result.push(newRow);
    }

    return result;
  }

  applyMove({ transpose = false, reverse = false }) {
    if (this.status !== 'playing') return;

    let moved = false;
    let totalScore = 0;

    let currentRows = transpose ? this.transpose(this.state) : this.state;

    const newState = currentRows.map((row) => {
      const { row: newRow, scoreDelta } = this.moveRow(row, reverse);

      if (!this.arraysEqual(row, newRow)) {
        moved = true;
      }

      totalScore += scoreDelta;
      return newRow;
    });

    if (moved) {
      this.state = transpose ? this.transpose(newState) : newState;
      this.addRandomTile();
      this.score += totalScore;
      this.checkWin();
      this.checkLose();
    }

    return moved;
  }

  moveLeft() {
    return this.applyMove({ transpose: false, reverse: false });
  }

  moveRight() {
    return this.applyMove({ transpose: false, reverse: true });
  }

  moveUp() {
    return this.applyMove({ transpose: true, reverse: false });
  }

  moveDown() {
    return this.applyMove({ transpose: true, reverse: true });
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
    this.state = this.initialState.map((row) => row.slice());
    this.status = 'playing';
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => row.slice());
    this.status = 'idle';
    this.score = 0;
  }

  checkWin() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  checkLose() {
    for (const row of this.state) {
      if (row.includes(0)) {
        return false;
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size - 1; row++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }
}

module.exports = Game;
