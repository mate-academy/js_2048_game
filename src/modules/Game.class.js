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
    this.size = 4;
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'

    this.field = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });

    if (initialState) {
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          this.field[r][c] = initialState[r][c] || 0;
        }
      }
    }
    // console.log(initialState);
  }

  addRandomTile() {
    const empty = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.field[row][col] === 0) {
          empty.push([row, col]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [rowIndex, colIndex] =
      empty[Math.floor(Math.random() * empty.length)];

    this.field[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;
  }

  checkWin() {
    for (const row of this.field) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.field[row][col] === 0) {
          return false;
        }

        if (
          col < this.size - 1 &&
          this.field[row][col] === this.field[row][col + 1]
        ) {
          return false;
        }

        if (
          row < this.size - 1 &&
          this.field[row][col] === this.field[row + 1][col]
        ) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      let newRow = this.field[row].filter((v) => v !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }
      newRow = newRow.filter((v) => v !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (newRow.join() !== this.field[row].join()) {
        moved = true;
      }
      this.field[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.checkWin()) {
      return;
    }
    this.checkLose();
  }
  moveRight() {
    this.field = this.field.map((row) => row.reverse());
    this.moveLeft();
    this.field = this.field.map((row) => row.reverse());
  }
  moveUp() {
    this.rotateLeft();
    this.moveLeft();
    this.rotateRight();
  }
  moveDown() {
    this.rotateLeft();
    this.moveRight();
    this.rotateRight();
  }

  rotateLeft() {
    const newField = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        newField[this.size - col - 1][row] = this.field[row][col];
      }
    }
    this.field = newField;
  }

  rotateRight() {
    const newField = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        newField[col][this.size - row - 1] = this.field[row][col];
      }
    }
    this.field = newField;
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
    return this.field.map((row) => row.slice());
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
    this.status = 'playing';

    this.field = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
