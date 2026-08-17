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
  constructor(initialState = []) {
    // eslint-disable-next-line no-console
    // console.log(initialState);

    if (initialState.length > 0) {
      this.field = initialState;
    } else {
      this.field = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'playing';
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  moveLeft() {
    const newGrid = this.field.map((row) => {
      let filtered = row.filter((cell) => cell !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
        }
      }

      filtered = filtered.filter((cell) => cell !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }

      return filtered;
    });

    this.field = newGrid;
  }

  moveRight() {
    this.field = this.field.map((row) => row.reverse());

    this.moveLeft();

    this.field = this.field.map((row) => row.reverse());
  }
  moveUp() {
    this.field = this.transpose(this.field);

    this.moveLeft();

    this.field = this.transpose(this.field);
  }

  moveDown() {
    this.field = this.transpose(this.field);

    this.moveRight();

    this.field = this.transpose(this.field);
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
    return this.field;
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

  addRandomTile() {
    const emptyCells = [];

    this.field.forEach((fieldRow, rowIndex) => {
      fieldRow.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.field[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.status = 'playing';

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  checkGameOver() {
    for (const row of this.field) {
      if (row.includes(0)) {
        return false;
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && this.field[r][c] === this.field[r][c + 1]) {
          return false;
        }

        if (r < 3 && this.field[r][c] === this.field[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
