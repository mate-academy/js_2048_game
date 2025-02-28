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
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.state =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

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
   * Setter method for this.state. Replaces the value of the cell with the
   * provided row and cell indexes with 'newValue'.
   *
   * @param {number} rowIndex - The index of the row.
   * @param {number} cellIndex - The index of the cell.
   * @param {number} newValue - The value to set in the cell.
   * @returns {void}
   */
  updateState(rowIndex, cellIndex, newValue) {
    this.state[rowIndex][cellIndex] = newValue;
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
   * Fills in the cells of the '.game-field' element
   * with the content of this.state.
   *
   * @returns {void}
   */
  renderState() {
    const gameField = document.querySelector('.game-field');
    const rowsArray = [...gameField.querySelectorAll('.field-row')];

    rowsArray.forEach((row, rowIndex) => {
      [...row.cells].forEach((cell, cellIndex) => {
        const cellValue = this.getState()[rowIndex][cellIndex];

        if (cellValue) {
          cell.textContent = cellValue;
          cell.classList.add(`field-cell--${cellValue}`);
        }
      });
    });
  }

  /**
   * Starts the game.
   */
  start() {}

  /**
   * Resets the game.
   */
  restart() {}

  /**
   * Returns array of coordinates (row index and column index)
   * of each empty cell.
   *
   * @returns {[number, number][]}
   */
  getEmptyCellsCoordinates() {
    const emptyCellsCoordinates = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cellValue, cellIndex) => {
        if (!cellValue) {
          emptyCellsCoordinates.push([rowIndex, cellIndex]);
        }
      });
    });

    return emptyCellsCoordinates;
  }

  /**
   * Replaces value of random empty cell with 2 or 4. 4 probability is 10%.
   *
   * @returns {void}
   */
  addRandomTile() {
    const emptyCells = this.getEmptyCellsCoordinates();
    const newTileValue = Math.floor(Math.random() * 10) > 8 ? 4 : 2;
    const newTileIndex = Math.floor(Math.random() * emptyCells.length);
    const [rowIndex, cellIndex] = emptyCells[newTileIndex];

    this.updateState(rowIndex, cellIndex, newTileValue);
  }
}

module.exports = Game;
