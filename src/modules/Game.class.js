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
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  filterZero(row) {
    return row.filter((val) => val !== 0);
  }

  slide(row) {
    let modifiedRow = this.filterZero(row);

    for (let i = 0; i < modifiedRow.length - 1; i++) {
      if (modifiedRow[i] === modifiedRow[i + 1]) {
        modifiedRow[i] *= 2;
        modifiedRow[i + 1] = 0;
        this.score += modifiedRow[i];
      }
    }

    modifiedRow = this.filterZero(modifiedRow);

    while (modifiedRow.length < 4) {
      modifiedRow.push(0);
    }

    return modifiedRow;
  }

  moveLeft() {
    for (let r = 0; r < 4; r++) {
      let row = this.state[r];

      row = this.slide(row);
      this.state[r] = row;
    }
  }

  moveRight() {
    for (let r = 0; r < 4; r++) {
      let row = this.state[r];

      row.reverse();
      row = this.slide(row);
      row.reverse();
      this.state[r] = row;
    }
  }

  moveUp() {
    for (let c = 0; c < 4; c++) {
      let tempRow = [];

      for (let i = 0; i < 4; i++) {
        tempRow.push(this.state[i][c]);
      }

      tempRow = this.slide(tempRow);

      for (let j = 0; j < 4; j++) {
        this.state[j][c] = tempRow[j];
      }
    }
  }

  moveDown() {
    for (let c = 0; c < 4; c++) {
      let tempRow = [];

      for (let i = 0; i < 4; i++) {
        tempRow.push(this.state[i][c]);
      }
      tempRow.reverse();
      tempRow = this.slide(tempRow);
      tempRow.reverse();

      for (let j = 0; j < 4; j++) {
        this.state[j][c] = tempRow[j];
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
    this.score = 0;

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'playing';

    const number1 = this.generateNumber();
    const number2 = this.generateNumber();

    const cell1 = this.getCellValue();
    let cell2 = this.getCellValue();

    while (cell2 === cell1) {
      cell2 = this.getCellValue();
    }
    this.state[Math.floor(cell1 / 4)][cell1 % 4] = number1;
    this.state[Math.floor(cell2 / 4)][cell2 % 4] = number2;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here

  // return 2 or 4. 4 probability is 10%
  generateNumber() {
    return Math.random() >= 0.9 ? 4 : 2;
  }

  // return number between 0 and 15
  getCellValue() {
    return Math.floor(Math.random() * 16);
  }

  fillOutRandomCell(value) {
    // getting array of empty cells
    let emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const randomCellIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomCellIndex];

      this.state[Math.floor(randomCell / 4)][randomCell % 4] = value;
      emptyCells = this.getEmptyCells();
    }

    if (emptyCells.length === 0) {
      if (!this.isMovePossible()) {
        this.status = 'lose';
      }
    }
  }

  getEmptyCells() {
    const emptyCells = [];
    const flatState = this.getState().flat();

    for (let i = 0; i < flatState.length; i++) {
      if (flatState[i] === 0) {
        emptyCells.push(i);
      }
    }

    return emptyCells;
  }

  updateStatus() {
    const win = this.state.filter((e) => e === 2048);

    if (win.length >= 1) {
      this.status = 'win';
    }
  }

  isMovePossible() {
    let result = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        // checking rows (move left|right)
        if (this.state[i][j] === this.state[i][j + 1]) {
          result = true;
        }

        // checking columns (move up|down)
        if (this.state[j][i] === this.state[j + 1][i]) {
          result = true;
        }
      }
    }

    return result;
  }
}

module.exports = Game;
