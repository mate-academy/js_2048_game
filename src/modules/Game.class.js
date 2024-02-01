'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Game {
  /** +
   *
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
    this.getInitialTable = () => JSON.parse(JSON.stringify(initialState));
    // eslint-disable-next-line no-console
    this.state = this.getInitialTable();
    this.status = 'idle';
    this.score = 0;
  }

  calculateRow(arr) {
    let filteredArr = arr.filter(item => item !== 0);

    for (let i = 0; i < filteredArr.length - 1; i++) {
      if (filteredArr[i] === filteredArr[i + 1]) {
        filteredArr[i] *= 2;
        this.score += filteredArr[i];
        filteredArr[i + 1] = 0;
      }
    }

    filteredArr = filteredArr.filter(el => el);

    filteredArr.push(...(new Array(4 - filteredArr.length).fill(0)));

    return filteredArr;
  }

  moveLeft() {
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] = this.calculateRow(this.state[i]);
    }
  }

  moveRight() {
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] = this.calculateRow(this.state[i].reverse()).reverse();
    }
  }

  moveUp() {
    for (let indexRow = 0; indexRow < this.state.length; indexRow++) {
      const column = this.state.map(row => row[indexRow]);
      const newColumn = this.calculateRow(column);

      newColumn.forEach((value, indexColumn) => {
        this.state[indexColumn][indexRow] = value;
      });
    }
  }

  moveDown() {
    for (let indexRow = 0; indexRow < this.state.length; indexRow++) {
      const column = this.state.map(row => row[indexRow]).reverse();
      const newColumn = this.calculateRow(column).reverse();

      newColumn.forEach((value, indexColumn) => {
        this.state[indexColumn][indexRow] = value;
      });
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
    this.spawnCell(0);
    this.spawnCell(0);
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.getInitialTable();
    this.score = 0;
    this.start();
  }

  // Add your own methods here
  spawnCell(percentForFour = 0.1) {
    const arrOfVoidIndexes = this.getVoidCellIndexes();

    if (arrOfVoidIndexes.length === 0) {
      return;
    }

    const randomIndex
      = arrOfVoidIndexes[Math.floor(Math.random() * arrOfVoidIndexes.length)];

    if (Math.random() < percentForFour) {
      this.state[randomIndex[0]][randomIndex[1]] = 4;
    } else {
      this.state[randomIndex[0]][randomIndex[1]] = 2;
    }
  }

  getVoidCellIndexes() {
    const result = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          result.push([i, j]);
        }
      }
    }

    return result;
  }

  checkWin() {
    for (let i = 0; i < this.state.length; i++) {
      if (this.state[i].indexOf(2048) !== -1) {
        this.status = 'win';
      }
    }
  }

  checkLose() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length - 1; j++) {
        const isRightEqual = this.state[j + 1][i] === this.state[j][i];
        const isLeftEqual = this.state[i][j + 1] === this.state[i][j];

        if (this.state[i][j] === 0 || this.state[i][j + 1] === 0) {
          return;
        } else if (isLeftEqual || isRightEqual) {
          return;
        }
      }
    }
    this.status = 'lose';
  }
}

module.exports = Game;
