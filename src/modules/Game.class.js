'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

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
  static NUMBER_OF_ROWS = 4;
  static NUMBER_OF_COLUMNS = 4;

  constructor(
    initialState = Array.from({ length: 4 }, () => Array(4).fill(0)),
  ) {
    // eslint-disable-next-line no-console
    this.status = 'idle';

    this.initialState = initialState;
    this.cells = structuredClone(this.initialState);
    this.changedСell = [];
    this.score = 0;
  }

  moveLeft() {
    this.changedСell = [];

    let move = false;
    const mergedThisTurn = new Set();

    for (let row = 0; row < Game.NUMBER_OF_ROWS; row++) {
      for (let col = 1; col < Game.NUMBER_OF_COLUMNS; col++) {
        const cell = this.cells[row][col];

        if (cell !== 0 && this.status === 'playing') {
          let targetIndex = col;

          for (let newCol = col - 1; newCol >= 0; newCol--) {
            const newPlace = this.cells[row][newCol];

            const isEmpty = newPlace === 0;
            const theSame =
              newPlace !== 0 &&
              newPlace === cell &&
              !mergedThisTurn.has(`${row},${newCol}`);

            if (theSame) {
              this.cells[row][newCol] = newPlace * 2;
              this.score += this.cells[row][newCol];
              this.changedСell.push([row, newCol]);
              mergedThisTurn.add(`${row},${newCol}`);
              this.cells[row][col] = 0;
              move = true;

              if (this.cells[row][newCol] === 2048) {
                this.status = 'win';
                this.win();
              }

              break;
            }

            if (isEmpty) {
              targetIndex = newCol;
            } else {
              break;
            }
          }

          if (targetIndex !== col) {
            this.cells[row][targetIndex] = cell;
            this.cells[row][col] = 0;
            move = true;
          }
        }
      }
    }

    if (move) {
      this.addNewCell();
      this.getScore();
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  moveRight() {
    this.changedСell = [];

    let move = false;
    const mergedThisTurn = new Set();

    for (let row = 0; row < Game.NUMBER_OF_ROWS; row++) {
      for (let col = Game.NUMBER_OF_COLUMNS - 2; col >= 0; col--) {
        const cell = this.cells[row][col];

        if (cell !== 0 && this.status === 'playing') {
          let targetIndex = col;

          for (
            let newCol = col + 1;
            newCol < Game.NUMBER_OF_COLUMNS;
            newCol++
          ) {
            const newPlace = this.cells[row][newCol];

            const isEmpty = newPlace === 0;
            const theSame =
              newPlace !== 0 &&
              newPlace === cell &&
              !mergedThisTurn.has(`${row},${newCol}`);

            if (theSame) {
              this.cells[row][newCol] = newPlace * 2;
              this.score += this.cells[row][newCol];
              this.changedСell.push([row, newCol]);
              mergedThisTurn.add(`${row},${newCol}`);
              this.cells[row][col] = 0;
              move = true;

              if (this.cells[row][newCol] === 2048) {
                this.status = 'win';
                this.win();
              }

              break;
            }

            if (isEmpty) {
              targetIndex = newCol;
            } else {
              break;
            }
          }

          if (targetIndex !== col) {
            this.cells[row][targetIndex] = cell;
            this.cells[row][col] = 0;
            move = true;
          }
        }
      }
    }

    if (move) {
      this.addNewCell();
      this.getScore();
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  moveUp() {
    this.changedСell = [];

    let move = false;
    const mergedThisTurn = new Set();

    for (let col = 0; col < Game.NUMBER_OF_COLUMNS; col++) {
      for (let row = 1; row < Game.NUMBER_OF_ROWS; row++) {
        const cell = this.cells[row][col];

        if (cell !== 0 && this.status === 'playing') {
          let targetIndex = row;

          for (let newRow = row - 1; newRow >= 0; newRow--) {
            const newPlace = this.cells[newRow][col];

            const isEmpty = newPlace === 0;
            const theSame =
              newPlace !== 0 &&
              newPlace === cell &&
              !mergedThisTurn.has(`${newRow},${col}`);

            if (theSame) {
              this.cells[newRow][col] = newPlace * 2;
              this.score += this.cells[newRow][col];
              this.changedСell.push([newRow, col]);
              mergedThisTurn.add(`${newRow},${col}`);
              this.cells[row][col] = 0;
              move = true;

              if (this.cells[newRow][col] === 2048) {
                this.status = 'win';
                this.win();
              }

              break;
            }

            if (isEmpty) {
              targetIndex = newRow;
            } else {
              break;
            }
          }

          if (targetIndex !== row) {
            this.cells[targetIndex][col] = cell;
            this.cells[row][col] = 0;
            move = true;
          }
        }
      }
    }

    if (move) {
      this.addNewCell();
      this.getScore();
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  moveDown() {
    this.changedСell = [];

    let move = false;
    const mergedThisTurn = new Set();

    for (let col = 0; col < Game.NUMBER_OF_COLUMNS; col++) {
      for (let row = Game.NUMBER_OF_ROWS - 2; row >= 0; row--) {
        const cell = this.cells[row][col];

        if (cell !== 0 && this.status === 'playing') {
          let targetIndex = row;

          for (let newRow = row + 1; newRow < this.cells.length; newRow++) {
            const newPlace = this.cells[newRow][col];

            const isEmpty = newPlace === 0;
            const theSame =
              newPlace !== 0 &&
              newPlace === cell &&
              !mergedThisTurn.has(`${newRow},${col}`);

            if (theSame) {
              this.cells[newRow][col] = newPlace * 2;
              this.score += this.cells[newRow][col];
              this.changedСell.push([newRow, col]);
              mergedThisTurn.add(`${newRow},${col}`);
              this.cells[row][col] = 0;
              move = true;

              if (this.cells[newRow][col] === 2048) {
                this.status = 'win';
                this.win();
              }

              break;
            }

            if (isEmpty) {
              targetIndex = newRow;
            } else {
              break;
            }
          }

          if (targetIndex !== row) {
            this.cells[targetIndex][col] = cell;
            this.cells[row][col] = 0;
            move = true;
          }
        }
      }
    }

    if (move) {
      this.addNewCell();
      this.getScore();
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  win() {
    const e = new CustomEvent('win', { detail: {} });

    document.dispatchEvent(e);
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return structuredClone(this.cells);
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
    this.cells = structuredClone(this.initialState);

    this.addNewCell();
    this.addNewCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';

    this.cells = structuredClone(this.initialState);
    this.changedСell = [];

    this.getScore();
  }

  // Add your own methods here
  addNewCell() {
    if (!this.canMove()) {
      this.status = 'lose';

      return;
    }

    function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let randomRow, randomCol;

    do {
      randomRow = getRandom(0, Game.NUMBER_OF_ROWS - 1);
      randomCol = getRandom(0, Game.NUMBER_OF_COLUMNS - 1);
    } while (this.cells[randomRow][randomCol] !== 0);

    this.cells[randomRow][randomCol] = Math.random() < 0.1 ? 4 : 2;
    this.changedСell.push([randomRow, randomCol]);
  }

  canMove() {
    for (let row = 0; row < Game.NUMBER_OF_ROWS; row++) {
      for (let col = 0; col < Game.NUMBER_OF_COLUMNS; col++) {
        const cell = this.cells[row][col];

        if (cell === 0) {
          return true;
        }

        if (
          col < Game.NUMBER_OF_COLUMNS - 1 &&
          this.cells[row][col + 1] === cell
        ) {
          return true;
        }

        if (
          row < Game.NUMBER_OF_ROWS - 1 &&
          this.cells[row + 1][col] === cell
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
