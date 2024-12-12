'use strict';

/**
 * This class represents the game.
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
    initialScore = 0,
  ) {
    // Initial state of game
    this.initialState = structuredClone(initialState);
    this.state = structuredClone(initialState);

    // Initial score
    this.score = initialScore;

    // Initial game status
    this.status = 'idle';

    // Value to win
    this.WINNING_VALUE = 2048;
  }

  /**
   * Moves all the tiles to the left and adds a random new tile.
   */
  moveLeft() {
    this.state.forEach((row, i) => {
      this.state[i] = this.shift(row, 'left');
    });

    this.addRandomCell();
  }

  /**
   * Moves all the tiles to the right and adds a random new tile.
   */
  moveRight() {
    this.state.forEach((row, i) => {
      this.state[i] = this.shift(row, 'right');
    });

    this.addRandomCell();
  }

  /**
   * Moves all the tiles upwards and adds a random new tile.
   */
  moveUp() {
    const numColumns = this.state[0].length;
    const numRows = this.state.length;

    for (let col = 0; col < numColumns; col++) {
      const column = this.state.map((row) => row[col]);
      const newColumn = this.shift(column, 'up');

      for (let row = 0; row < numRows; row++) {
        this.state[row][col] = newColumn[row];
      }
    }

    this.addRandomCell();
  }

  /**
   * Moves all the tiles downwards and adds a random new tile.
   */
  moveDown() {
    const numColumns = this.state[0].length;
    const numRows = this.state.length;

    for (let col = 0; col < numColumns; col++) {
      const column = this.state.map((row) => row[col]);
      const newColumn = this.shift(column, 'down');

      for (let row = 0; row < numRows; row++) {
        this.state[row][col] = newColumn[row];
      }
    }

    this.addRandomCell();
  }

  /**
   * Returns current game score
   *
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * Returns current game state
   *
   * @returns {number[][]}
   */
  getState() {
    return structuredClone(this.state);
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
   * Starts the game by adding two random tiles
   * and setting the status to 'playing'.
   */
  start() {
    this.addRandomCell();
    this.addRandomCell();
    this.getState();
    this.status = 'playing';
  }

  /**
   * Resets the game to its initial state.
   */
  restart() {
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  /**
   * Adds a random tile (either 2 or 4) to an empty cell.
   * This tile is placed in a random empty position on the board.
   */
  addRandomCell() {
    const emptyCells = [];

    // Find all empty cells on the board.
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    // If there are no empty cells, return.
    if (emptyCells.length === 0) {
      return;
    }

    // Choose a random empty cell and place a 2 or 4.
    const [rowRand, cellRand] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[rowRand][cellRand] = Math.random() < 0.1 ? 4 : 2;

    this.updateHtmlCells();
  }

  /**
   * Gets the game cells from the DOM.
   *
   * @returns {number[][]} A 2D array of HTML cell elements.
   */
  getCells() {
    if (!this.cachedCells) {
      const rows = document.querySelectorAll('.field-row');

      // Cache the cell elements if they haven't been cached yet.
      this.cachedCells = Array.from(rows).map((row) => {
        return Array.from(row.querySelectorAll('.field-cell'));
      });
    }

    return this.cachedCells;
  }

  /**
   * Update HTML according to the game state
   */
  updateHtmlCells() {
    const htmlCells = this.getCells();
    const state = this.getState();

    state.forEach((row, i) => {
      row.forEach((value, j) => {
        const cell = htmlCells[i][j];

        // Set the cell's text content and class name based on the value.
        cell.textContent = value || '';

        cell.className = cell.className
          .split(' ')
          .filter((className) => !className.startsWith('field-cell--'))
          .join(' ');

        if (value !== 0) {
          cell.classList.add(`field-cell--${value}`);
        }
      });
    });
  }

  /**
   * Shifts the tiles in a given direction,
   * merging adjacent tiles with equal values.
   * Also updates the score.
   *
   * @param {number[]} array - The array of tiles to shift.
   * @param {string} direction - The direction to shift the tiles
   * ('left', 'right', 'up', 'down').
   * @returns {number[]} The new array after shifting and merging.
   */
  shift(array, direction) {
    const nonZero = array.filter((num) => num !== 0);
    const newArray = [];
    let scoreIncrement = 0;

    // Loop through the non-zero tiles and merge if adjacent tiles are equal.
    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        const mergedValue = nonZero[i] * 2;

        newArray.push(mergedValue);
        scoreIncrement += mergedValue;
        i++;
      } else {
        newArray.push(nonZero[i]);
      }
    }

    // Fill the remaining spaces with zeros based on the direction of movement.
    const zeros = new Array(array.length - newArray.length).fill(0);
    const result =
      direction === 'left' || direction === 'up'
        ? newArray.concat(zeros)
        : zeros.concat(newArray);

    this.score += scoreIncrement;

    // Check if the game is over or won after the move.
    this.isGameOver();
    this.isGameWin();

    return result;
  }

  /**
   * Checks if the game is over.
   * Sets the game status to 'lose' if the game is over.
   */
  isGameOver() {
    for (const row of this.state) {
      if (row.includes(0)) {
        return;
      }
    }

    const numRows = this.state.length;
    const numColumns = this.state[0].length;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numColumns; col++) {
        const current = this.state[row][col];

        if (
          (col < numColumns - 1 && current === this.state[row][col + 1]) ||
          (row < numRows - 1 && current === this.state[row + 1][col])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  /**
   * Checks if the player has won the game.
   * Sets the game status to 'win' if the player has won.
   */
  isGameWin() {
    const state = this.getState();

    state.forEach((row) => {
      if (row.includes(this.WINNING_VALUE)) {
        this.status = 'win';
      }
    });
  }

  createTile(value, element) {
    return {
      value: value,
      element: element,
    };
  }

  setValue(tile, value) {
    tile.value = value;
    tile.element.textContent = value === 0 ? '' : value;

    tile.element.className = tile.element.className
      .split(' ')
      .filter((className) => !className.startsWith('field-cell--'))
      .join(' ');

    if (value !== 0) {
      tile.element.classList.add(`field-cell--${value}`);
    }
  }

  setPosition(tile, x, y) {
    tile.element.style.transition = 'transform 0.2s ease';
    tile.element.style.transform = `translate(${x * 100}px, ${y * 100}px)`; // assuming each cell is 100px by 100px
  }

  animateTileAppear(tile) {
    tile.element.classList.add('tile-appear');
  }
}

module.exports = Game;
