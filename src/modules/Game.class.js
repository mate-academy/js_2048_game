'use strict';

const BOARD_SIZE = 4;
const FOUR_SPAWN_CHANCE = 0.1;
const rows = [...document.querySelectorAll('.field-row')];

if (!rows.length) {
  throw new Error('Rows are not found!');
}

const cells = rows.map((row) => [...row.querySelectorAll('.field-cell')]);

if (!cells.length) {
  throw new Error('Cells are not found!');
}

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

    // Generate an empty dash board
    this.dash = Array.from({ length: BOARD_SIZE }, () => {
      return Array(BOARD_SIZE).fill(0);
    });
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

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
  start() {
    // Generate two numbers at random positions at the beginning of the game.
    this.spawnNumber();
    this.spawnNumber();
    this.updateHtmlTable();
  }

  /**
   * Resets the game.
   */
  restart() {}

  /**
   * Spawn 2 or 4 in a random available position
   */
  spawnNumber() {
    const newNum = Math.random() < FOUR_SPAWN_CHANCE ? 4 : 2;

    let randomRowPos;
    let randomColPos;

    // Continue the loop until a free cell is found
    while (true) {
      randomRowPos = Math.floor(Math.random() * BOARD_SIZE);
      randomColPos = Math.floor(Math.random() * BOARD_SIZE);

      if (this.cellIsFree(randomRowPos, randomColPos)) {
        break;
      }
    }

    // Update game dash
    this.dash[randomRowPos][randomColPos] = newNum;
  }

  /**
   * Check if the dash cell is free and returns true
   *
   * @returns {boolean}
   */
  cellIsFree(row, col) {
    return this.dash[row][col] === 0;
  }

  /**
   * Updates HTML table cells
   */
  updateHtmlTable() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const num = this.dash[i][j];

        if (num !== 0) {
          const cell = cells[i][j];

          cell.textContent = num;
          cell.classList.add(`field-cell--${num}`);
        }
      }
    }
  }
}

module.exports = Game;
