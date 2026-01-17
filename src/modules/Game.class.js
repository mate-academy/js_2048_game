'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[4][4]} initialState
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
    this.score = 0;
    this.status = 'idle' | 'playing' | 'win' | 'lose';
    this.size = 4;

    if (initialState === undefined) {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    } else {
      this.state = initialState;
    }
  }

  moveLeft() {
    const oldMatrix = [];
    let moved = false;

    // Delete all 0's
    this.state.forEach((row, rowIndex) => {
      oldMatrix.push([...row]);

      this.state[rowIndex] = Array.from(this.state[rowIndex]).filter((cell) => {
        return cell !== 0;
      });
    });

    // Match two even values
    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (
          this.state[rowIndex][cellIndex] ===
          this.state[rowIndex][cellIndex + 1]
        ) {
          this.state[rowIndex][cellIndex] *= 2;
          this.state[rowIndex][cellIndex + 1] = 0;
        }
      });
    });

    // fill empty cells with 0
    this.state.forEach((row, rowIndex) => {
      while (row.length < 4) {
        this.state[rowIndex].push(0);
      }

      if (!this.arraysEqual(row, oldMatrix[rowIndex])) {
        moved = true;
      }
    });

    if (moved) {
      this.generateValue(1);
    }

    this.score = this.getScore();
  }

  moveRight() {
    const oldMatrix = [];
    let moved = false;

    // Delete all 0's
    this.state.forEach((row, rowIndex) => {
      oldMatrix.push([...row]);

      this.state[rowIndex] = Array.from(this.state[rowIndex]).filter((cell) => {
        return cell !== 0;
      });
    });

    // Match two even values
    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (
          this.state[rowIndex][cellIndex] ===
          this.state[rowIndex][cellIndex + 1]
        ) {
          this.state[rowIndex][cellIndex + 1] *= 2;
          this.state[rowIndex][cellIndex] = 0;
        }
      });
    });

    // fill empty cells with 0
    this.state.forEach((row, rowIndex) => {
      while (row.length < 4) {
        this.state[rowIndex].unshift(0);
      }

      if (!this.arraysEqual(row, oldMatrix[rowIndex])) {
        moved = true;
      }
    });

    if (moved) {
      this.generateValue(1);
    }

    this.score = this.getScore();
  }

  moveUp() {
    let moved = false;

    this.state.forEach((row, rowIndex) => {
      const oldCol = [];
      let col = [];

      row.forEach((cell, cellIndex) => {
        col.push(this.state[cellIndex][rowIndex]);
        oldCol.push(this.state[cellIndex][rowIndex]);
      });

      // Delete all zero's
      col = col.filter((cell) => {
        return cell !== 0;
      });

      // Match same values
      col.forEach((cell, cellIndex) => {
        if (col[cellIndex] === col[cellIndex + 1]) {
          col[cellIndex] *= 2;
          col[cellIndex + 1] = 0;
        }
      });

      // Fill emty cells with 0
      row.forEach((cell, cellIndex) => {
        while (col.length < 4) {
          col.push(0);
        }
      });

      // Set new values to column
      row.forEach((cell, cellIndex) => {
        this.state[cellIndex][rowIndex] = col[cellIndex];
      });

      if (!this.arraysEqual(col, oldCol)) {
        moved = true;
      }
    });

    if (moved) {
      this.generateValue(1);
    }

    this.score = this.getScore();
  }

  moveDown() {
    let moved = false;

    this.state.forEach((row, rowIndex) => {
      const oldCol = [];
      let col = [];

      row.forEach((cell, cellIndex) => {
        col.push(this.state[cellIndex][rowIndex]);
        oldCol.push(this.state[cellIndex][rowIndex]);
      });

      // Delete all zero's
      col = col.filter((cell) => {
        return cell !== 0;
      });

      // Match same values
      col.forEach((cell, cellIndex) => {
        if (col[cellIndex] === col[cellIndex + 1]) {
          col[cellIndex + 1] *= 2;
          col[cellIndex] = 0;
        }
      });

      // Fill emty cells with 0
      row.forEach((cell, cellIndex) => {
        while (col.length < 4) {
          col.unshift(0);
        }
      });

      // Set new values to column
      row.forEach((cell, cellIndex) => {
        this.state[cellIndex][rowIndex] = col[cellIndex];
      });

      if (!this.arraysEqual(col, oldCol)) {
        moved = true;
      }
    });

    if (moved) {
      this.generateValue(1);
    }

    this.score = this.getScore();
  }

  /**
   * @returns {number}
   */
  getScore() {
    let score = 0;

    Array.from(this.state).forEach((row) => {
      row.forEach((cell) => {
        if (/^\d+$/.test(cell)) {
          score += Number(cell);
        }
      });
    });

    return score;
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
    for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
      for (
        let cellIndex = 0;
        cellIndex < this.state[rowIndex].length;
        cellIndex++
      ) {
        if (this.state[rowIndex][cellIndex] === 2048) {
          this.status = 'win';

          return this.status;
        }

        if (this.state[rowIndex][cellIndex] === 0) {
          this.status = 'playing';

          return this.status;
        }

        if (
          cellIndex + 1 < 4 &&
          this.state[rowIndex][cellIndex] ===
            this.state[rowIndex][cellIndex + 1]
        ) {
          this.status = 'playing';

          return this.status;
        }

        if (
          rowIndex + 1 < 4 &&
          this.state[rowIndex][cellIndex] ===
            this.state[rowIndex + 1][cellIndex]
        ) {
          this.status = 'playing';

          return this.status;
        }
      }
    }
    this.status = 'lose';

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.generateValue(2);
    // this.score += this.getScore();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.setInitialState();
  }

  // Add your own methods here

  clearState() {
    Array.from(this.state).forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        this.state[rowIndex][cellIndex] = 0;
      });
    });

    return this.state;
  }

  setInitialState() {
    this.score = 0;

    this.status = 'idle';
    this.clearState();
  }

  getEmtyCells() {
    const available = [];

    Array.from(this.state).forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (this.state[rowIndex][cellIndex] === 0) {
          available.push([rowIndex, cellIndex]);
        }
      });
    });

    return available;
  }

  generateValue(amount) {
    const available = this.getEmtyCells();

    if (available.length === 0) {
      return;
    }

    for (let i = 0; i < amount; i++) {
      if (available.length === 0) {
        break;
      }

      const idx = Math.floor(Math.random() * available.length);
      const [r, c] = available[idx];

      this.state[r][c] = Math.random() <= 0.1 ? 4 : 2;
    }
  }

  arraysEqual(arr1, arr2) {
    // First, check if the lengths are the same
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Then, check if every element at the same index is equal
    return arr1.every((element, index) => {
      return element === arr2[index];
    });
  }
}
// module.exports = Game;
