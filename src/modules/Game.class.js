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
  constructor(initialState) {
    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  checkStatus() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  moveLeft() {
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] = this.moveRowLeft(this.state[i]);
    }
  }

  moveRowLeft(row) {
    const filteredArr = row.filter((el) => el !== 0);
    const newArr = [];

    for (let i = 0; i < filteredArr.length; i++) {
      if (filteredArr[i] === filteredArr[i + 1]) {
        const mrgValue = filteredArr[i] + filteredArr[i + 1];

        newArr.push(mrgValue);
        this.score += mrgValue;

        i++;
      } else {
        newArr.push(filteredArr[i]);
      }
    }

    const arrLength = 4 - newArr.length;

    for (let i = 0; i < arrLength; i++) {
      newArr.push(0);
    }

    return newArr;
  }

  moveRight() {
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] = this.moveRowRight(this.state[i]);
    }
  }

  moveRowRight(row) {
    const filteredArr = row.filter((el) => el !== 0);
    const newArr = [];

    for (let i = filteredArr.length - 1; i >= 0; i--) {
      if (filteredArr[i] === filteredArr[i - 1]) {
        const mrgValue = filteredArr[i] + filteredArr[i - 1];

        newArr.unshift(mrgValue);
        this.score += mrgValue;

        i--;
      } else {
        newArr.unshift(filteredArr[i]);
      }
    }

    const arrLength = 4 - newArr.length;

    for (let i = 0; i < arrLength; i++) {
      newArr.unshift(0);
    }

    return newArr;
  }

  moveUp() {
    for (let col = 0; col < this.state[0].length; col++) {
      const column = [];

      for (let row = 0; row < this.state.length; row++) {
        column.push(this.state[row][col]);
      }

      const newColumn = this.moveColumnUp(column);

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = newColumn[row];
      }
    }
  }

  moveColumnUp(column) {
    const filteredArr = column.filter((el) => el !== 0);
    const newArr = [];

    for (let i = 0; i < filteredArr.length; i++) {
      if (filteredArr[i] === filteredArr[i + 1]) {
        const mrgValue = filteredArr[i] + filteredArr[i + 1];

        newArr.push(mrgValue);
        this.score += mrgValue;

        i++;
      } else {
        newArr.push(filteredArr[i]);
      }
    }

    const arrLength = 4 - newArr.length;

    for (let i = 0; i < arrLength; i++) {
      newArr.push(0);
    }

    return newArr;
  }

  moveDown() {
    for (let col = 0; col < this.state[0].length; col++) {
      const column = [];

      for (let row = 0; row < this.state.length; row++) {
        column.push(this.state[row][col]);
      }

      const newColumn = this.moveColumnDown(column);

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = newColumn[row];
      }
    }
  }

  moveColumnDown(column) {
    const filteredArr = column.filter((el) => el !== 0);
    const newArr = [];

    for (let i = filteredArr.length - 1; i >= 0; i--) {
      if (filteredArr[i] === filteredArr[i - 1]) {
        const mrgValue = filteredArr[i] + filteredArr[i - 1];

        newArr.unshift(mrgValue);
        this.score += mrgValue;

        i--;
      } else {
        newArr.unshift(filteredArr[i]);
      }
    }

    const arrLength = 4 - newArr.length;

    for (let i = 0; i < arrLength; i++) {
      newArr.unshift(0);
    }

    return newArr;
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
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let ArrRow = 0; ArrRow < 4; ArrRow++) {
      for (let ArrCol = 0; ArrCol < 4; ArrCol++) {
        if (this.state[ArrRow][ArrCol] === 0) {
          emptyCells.push([ArrRow, ArrCol]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here
}

module.exports = Game;
