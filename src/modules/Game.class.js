/* eslint-disable no-console */
/* eslint-disable padding-line-between-statements */
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
    if (initialState.length) {
      this.initialState = initialState;
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.status = 'idle';
    this.score = 0;
    this.currentState = this.initialState.map((row) => [...row]);
  }

  /**
   * Checks the games status and shows win/lose message
   */
  isGameOver() {
    if (this.getStatus() === 'lose') {
      document.querySelector('.message-lose').classList.remove('hidden');
    } else if (this.getStatus() === 'win') {
      document.querySelector('.message-win').classList.remove('hidden');
    }
  }

  /**
   *
   * @returns true if there is 2048 tile on the field, false otherwise
   */
  checkWinCondition() {
    return this.currentState.some((row) => row.includes(2048));
  }

  /**
   *
   * @returns true if player has at least 1 move, othrwise false
   */
  checkMovePossibility() {
    if (this.getEmptyCellsCoordinates().length > 0) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const currentValue = this.checkCellByCoordinates([row, col]);

        if (
          col < 3 &&
          currentValue === this.checkCellByCoordinates([row, col + 1])
        ) {
          return true;
        }

        if (
          row < 3 &&
          currentValue === this.checkCellByCoordinates([row + 1, col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * @description Moves all tiles down.
   * Starting from the bottom-right corner, moving left and up,
   * each non-empty cell is moved down as far as possible
   * and merged if applicable.
   * After the movement, a new tile is generated and the board is updated.
   */
  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.currentState);

    for (let col = 3; col >= 0; col--) {
      const mergedThisMove = [false, false, false, false];

      for (let row = 3; row >= 0; row--) {
        const currentValue = this.checkCellByCoordinates([row, col]);

        if (currentValue !== 0) {
          let currentRow = row;
          let nextRow = currentRow + 1;

          // Move the tile down until it hits a non-empty cell
          //  or the bottom of the board
          while (
            nextRow <= 3 &&
            this.checkCellByCoordinates([nextRow, col]) === 0
          ) {
            this.currentState[nextRow][col] = currentValue;
            this.currentState[currentRow][col] = 0;
            currentRow = nextRow;
            nextRow++;
          }

          // Check for a possible merge
          if (
            nextRow <= 3 &&
            this.checkCellByCoordinates([nextRow, col]) === currentValue &&
            !mergedThisMove[nextRow]
          ) {
            // Merge
            this.currentState[nextRow][col] *= 2;
            this.currentState[currentRow][col] = 0;
            this.score += this.currentState[nextRow][col];
            mergedThisMove[nextRow] = true;
          }
        }
      }
    }

    const newState = JSON.stringify(this.currentState);

    if (previousState === newState) {
      return;
    }

    if (this.checkWinCondition()) {
      this.status = 'win';
    }

    this.generateAndPositionNewTile();
    this.updateTheBoard();

    if (!this.checkMovePossibility()) {
      this.status = 'lose';
    }
  }

  /**
   * @description Moves all tiles up.
   * Starting from the top-left corner, moving right and down,
   * each non-empty cell is moved up as far as possible
   * and merged if applicable.
   * After the movement, a new tile is generated and the board is updated.
   */
  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.currentState);

    for (let col = 0; col < 4; col++) {
      const mergedThisMove = [false, false, false, false];

      for (let row = 0; row < 4; row++) {
        const currentValue = this.checkCellByCoordinates([row, col]);

        if (currentValue !== 0) {
          let currentRow = row;
          let nextRow = currentRow - 1;

          // Move the tile up until it hits a non-empty cell
          // or the top of the board
          while (
            nextRow >= 0 &&
            this.checkCellByCoordinates([nextRow, col]) === 0
          ) {
            this.currentState[nextRow][col] = currentValue;
            this.currentState[currentRow][col] = 0;
            currentRow = nextRow;
            nextRow--;
          }

          // Check for a possible merge
          if (
            nextRow >= 0 &&
            this.checkCellByCoordinates([nextRow, col]) === currentValue &&
            !mergedThisMove[nextRow]
          ) {
            // Merge
            this.currentState[nextRow][col] *= 2;
            this.currentState[currentRow][col] = 0;
            this.score += this.currentState[nextRow][col];
            mergedThisMove[nextRow] = true;
          }
        }
      }
    }

    const newState = JSON.stringify(this.currentState);

    if (previousState === newState) {
      return;
    }

    if (this.checkWinCondition()) {
      this.status = 'win';
    }

    this.generateAndPositionNewTile();
    this.updateTheBoard();

    if (!this.checkMovePossibility()) {
      this.status = 'lose';
    }
  }

  /**
   * @description Moves all tiles left.
   * Starting from the top-left corner, moving right and down,
   * each non-empty cell is moved left as far as possible
   * and merged if applicable.
   * After the movement, a new tile is generated and the board is updated.
   */
  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.currentState);

    for (let row = 0; row < 4; row++) {
      let newRow = this.currentState[row].filter((cell) => cell !== 0);
      newRow = [...newRow, ...Array(4 - newRow.length).fill(0)];
      this.currentState[row] = newRow;

      const mergedThisMove = [false, false, false, false];

      for (let col = 0; col < 3; col++) {
        const currentValue = this.checkCellByCoordinates([row, col]);

        if (
          currentValue !== 0 &&
          this.checkCellByCoordinates([row, col + 1]) === currentValue &&
          !mergedThisMove[col]
        ) {
          this.currentState[row][col] *= 2;
          this.currentState[row][col + 1] = 0;
          this.score += this.currentState[row][col];
          mergedThisMove[col] = true;
        }
      }

      newRow = this.currentState[row].filter((cell) => cell !== 0);
      newRow = [...newRow, ...Array(4 - newRow.length).fill(0)];
      this.currentState[row] = newRow;
    }

    const newState = JSON.stringify(this.currentState);

    if (previousState === newState) {
      return;
    }

    if (this.checkWinCondition()) {
      this.status = 'win';
    }

    this.generateAndPositionNewTile();
    this.updateTheBoard();

    if (!this.checkMovePossibility()) {
      this.status = 'lose';
    }
  }

  /**
   * @description Moves all tiles right.
   * Starting from the top-right corner, moving left and down,
   * each non-empty cell is moved right as far as possible
   * and merged if applicable.
   * After the movement, a new tile is generated and the board is updated.
   */
  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.currentState);

    for (let row = 0; row < 4; row++) {
      let newRow = this.currentState[row].filter((cell) => cell !== 0);
      newRow = [...Array(4 - newRow.length).fill(0), ...newRow];
      this.currentState[row] = newRow;

      const mergedThisMove = [false, false, false, false];

      for (let col = 3; col > 0; col--) {
        const currentValue = this.checkCellByCoordinates([row, col]);

        if (
          currentValue !== 0 &&
          this.checkCellByCoordinates([row, col - 1]) === currentValue &&
          !mergedThisMove[col]
        ) {
          this.currentState[row][col] *= 2;
          this.currentState[row][col - 1] = 0;
          this.score += this.currentState[row][col];
          mergedThisMove[col] = true;
        }
      }

      newRow = this.currentState[row].filter((cell) => cell !== 0);
      newRow = [...Array(4 - newRow.length).fill(0), ...newRow];
      this.currentState[row] = newRow;
    }

    const newState = JSON.stringify(this.currentState);

    if (previousState === newState) {
      return;
    }

    if (this.checkWinCondition()) {
      this.status = 'win';
    }

    this.generateAndPositionNewTile();
    this.updateTheBoard();

    if (!this.checkMovePossibility()) {
      this.status = 'lose';
    }
  }

  /**
   * @description Simply holds an update of the visual score,
   * called after each move in the main file.
   */
  updateTheScore() {
    const scoreElement = document.querySelector('.game-score');
    scoreElement.innerText = this.score;
  }
  /**
   * @returns {number} returns game score.
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]} returns current game board state.
   */
  getState() {
    return this.currentState;
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
   * Calls two
   *  @method generateNewTile
   *
   * and
   *  @method positionNewTile
   *
   * in a chain to simplify the code read.
   */
  generateAndPositionNewTile() {
    this.positionNewTile(this.generateNewTile());
  }
  /**
   * Creates and positions 2 new cells on the field.
   */
  initializeBoard() {
    this.generateAndPositionNewTile();
    this.generateAndPositionNewTile();
  }

  /**
   * @description Starts the game.
   * Changing a status, initializing the board with 2 random cells
   * and updating UI.
   */
  start() {
    this.status = 'playing';
    this.initializeBoard();
    this.updateTheBoard();
  }

  /**
   * @description Resets the game.
   * Setting a score to 0, clearing the field and calling a start() again.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.currentState = this.initialState.map((row) => [...row]);
    this.updateTheBoard();
    // this.resetTheField();
  }

  /**
   * @description Mapping through all non-empty cells, asiging 0 value to them,
   * calling updateTheBoard() which check and fixes the styles
   */
  resetTheField() {
    const cellsToReset = this.getNonEmptyCells();
    const currentFieldState = this.getState();

    cellsToReset.forEach((cell) => {
      currentFieldState[cell[0]][cell[1]] = 0;
    });

    this.updateTheBoard();
  }

  /**
   * @returns {number} 2 or 4, 4 has 10% chance to be generated
   */
  generateNewTile() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  /**
   * Sets new random position for the passed cellValue
   * from available empty cell spots
   * @param {number} newTileValue - number value of new cell to place
   * @example 2, 4, 8, etc
   */
  positionNewTile(newTileValue) {
    const availableFields = this.getEmptyCellsCoordinates();

    const position =
      availableFields[Math.floor(Math.random() * availableFields.length)];

    if (availableFields.length) {
      this.getState()[position[0]][position[1]] = newTileValue;
    } else {
      this.checkMovePossibility();
    }
  }

  /**
   * @example[[0, 1], [3,2]] etc
   * @returns {number[][]} returns all empty cell coordinates array
   */
  getEmptyCellsCoordinates() {
    const possibleCoordinates = [];

    for (let row = 0; row < this.getState().length; row++) {
      for (let cell = 0; cell < this.getState()[row].length; cell++) {
        if (this.currentState[row][cell] === 0) {
          possibleCoordinates.push([row, cell]);
        }
      }
    }

    return possibleCoordinates;
  }

  /**
   * @example [[0, 1], [3,2]] etc
   * @returns {number[][]} returns all non-empty cell coordinates array
   */
  getNonEmptyCells() {
    const cellsCoordinates = [];

    for (let row = 0; row < this.getState().length; row++) {
      for (let cell = 0; cell < this.getState()[row].length; cell++) {
        if (this.currentState[row][cell] !== 0) {
          cellsCoordinates.push([row, cell]);
        }
      }
    }

    return cellsCoordinates;
  }

  /**
   * @param {number[]} coordinatesToCheck - array of the cell coordinates
   *  [x, y]
   * @returns {number} cell value by the coordinates
   */
  checkCellByCoordinates([row, col]) {
    if (row >= 0 && row < 4 && col >= 0 && col < 4) {
      return this.currentState[row][col];
    }
    return null;
  }

  /**
   * Updates UI of the board.
   * @description Mapping through all rows/cells, clearing previous styles,
   * changing cells according to updated game board.
   */
  updateTheBoard() {
    const gameField = [...document.querySelectorAll('tr.field-row')];
    const rows = this.currentState;

    if (gameField.length === 0) {
      return;
    }

    // Going through rows
    for (let i = 0; i < rows.length; i++) {
      // Going through cells in row
      for (let j = 0; j < rows[i].length; j++) {
        const currentCell = gameField[i].children[j];
        const currentDataCell = rows[i][j];

        // Removing all previous classes and setting a base class for the cell
        currentCell.className = 'field-cell';

        // Adding an extra class, if cell is not empty
        if (currentDataCell !== 0) {
          currentCell.classList.add(`field-cell--${currentDataCell}`);
          currentCell.innerText = currentDataCell;
        } else {
          currentCell.innerText = '';
        }
      }
    }
  }
}

module.exports = Game;
