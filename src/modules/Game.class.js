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
  //  * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.numbers = [
      [0, 0, 0, 0],
      [0, 1024, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 1024, 0],
    ];
    this.cells = [];
    this.status = 'idle';
    // console.log(initialState);
  }

  moveLeft() {
    for (let i = 0; i < 4; i++) {
      for (let j = 1; j <= 3; ) {
        // merge
        if (this.merge('left', i, j)) {
          j++;
          continue;
        }

        // swap
        if (this.swap('left', i, j)) {
          if (j > 1) {
            j--;
          }
        } else {
          j++;
        }
      }
    }

    this.createCell();
    this.setViewNumbers();
  }

  moveRight() {
    for (let i = 0; i < 4; i++) {
      for (let j = 2; j >= 0; ) {
        // merge
        if (this.merge('right', i, j)) {
          j--;
          continue;
        }

        // swap
        if (this.swap('right', i, j)) {
          if (j < 2) {
            j++;
          }
        } else {
          j--;
        }
      }
    }

    this.createCell();
    this.setViewNumbers();
  }

  moveUp() {
    for (let i = 0; i < 4; i++) {
      for (let j = 1; j <= 3; ) {
        // merge
        if (this.merge('up', i, j)) {
          j++;
          continue;
        }

        // swap
        if (this.swap('up', i, j)) {
          if (j > 1) {
            j--;
          }
        } else {
          j++;
        }
      }
    }

    this.createCell();
    this.setViewNumbers();
  }

  moveDown() {
    for (let i = 0; i < 4; i++) {
      for (let j = 2; j >= 0; ) {
        // merge
        if (this.merge('down', i, j)) {
          j--;
          continue;
        }

        // swap
        if (this.swap('down', i, j)) {
          if (j < 2) {
            j++;
          }
        } else {
          j--;
        }
      }
    }

    this.createCell();
    this.setViewNumbers();
  }

  merge(direction, i, j) {
    // numbers[row][col]
    let nextRow;
    let nextCol;
    let curRow;
    let curCol;

    if (direction === 'down') {
      nextRow = j + 1;
      nextCol = i;
      curRow = j;
      curCol = i;
    }

    if (direction === 'up') {
      nextRow = j - 1;
      nextCol = i;
      curRow = j;
      curCol = i;
    }

    if (direction === 'right') {
      nextRow = i;
      nextCol = j + 1;
      curRow = i;
      curCol = j;
    }

    if (direction === 'left') {
      nextRow = i;
      nextCol = j - 1;
      curRow = i;
      curCol = j;
    }

    if (
      this.numbers[curRow][curCol] > 0 &&
      this.numbers[nextRow][nextCol] === this.numbers[curRow][curCol]
    ) {
      this.numbers[nextRow][nextCol] *= 2;
      this.numbers[curRow][curCol] = 0;

      return true;
    }

    return false;
  }

  swap(direction, i, j) {
    // numbers[row][col]
    let nextRow;
    let nextCol;
    let curRow;
    let curCol;

    if (direction === 'down') {
      nextRow = j + 1;
      nextCol = i;
      curRow = j;
      curCol = i;
    }

    if (direction === 'up') {
      nextRow = j - 1;
      nextCol = i;
      curRow = j;
      curCol = i;
    }

    if (direction === 'right') {
      nextRow = i;
      nextCol = j + 1;
      curRow = i;
      curCol = j;
    }

    if (direction === 'left') {
      nextRow = i;
      nextCol = j - 1;
      curRow = i;
      curCol = j;
    }

    if (
      this.numbers[nextRow][nextCol] === 0 &&
      this.numbers[curRow][curCol] > 0
    ) {
      const item = this.numbers[nextRow][nextCol];

      this.numbers[nextRow][nextCol] = this.numbers[curRow][curCol];
      this.numbers[curRow][curCol] = item;

      return true;
    }

    return false;
  }

  setViewNumbers() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const currentNumber = this.numbers[i][j];
        const curentCell = this.cells[i][j];

        curentCell.className = 'field-cell';

        if (currentNumber) {
          curentCell.classList.add(`field-cell--${currentNumber}`);
          curentCell.innerText = currentNumber;
        } else {
          curentCell.innerText = '';
          // document.querySelector('field-cell').classList.length--;
        }
      }
    }
    // console.log(this.numbers);
  }

  createCell() {
    let i;
    let j;

    while (true) {
      i = Math.floor(Math.random() * 4);
      j = Math.floor(Math.random() * 4);

      if (this.numbers[i][j]) {
        continue;
      }

      this.numbers[i][j] = 2;
      // console.log(this.numbers[i][j]);
      break;
    }

    // console.log(i, j);
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {}

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start(button) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    this.status = 'playing';

    const rows = [...document.querySelectorAll('.field-row')];

    for (const cell of rows) {
      this.cells.push([...cell.children]);
    }

    this.createCell();
    this.setViewNumbers();
  }

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
}

module.exports = Game;
