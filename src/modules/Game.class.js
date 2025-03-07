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

    this.state = initialState || this.getEmptyBoard();
    this._renderedState = this.getEmptyBoard();

    this.flipHorizontally = this.flipHorizontally.bind(this);
    this.rotateLeft = this.rotateLeft.bind(this);
    this.rotateRight = this.rotateRight.bind(this);
  }

  canMakeMove() {
    return this.status === 'playing';
  }

  moveLeft() {
    this.moveBoard();
  }

  moveRight() {
    this.moveBoard(this.flipHorizontally, this.flipHorizontally);
  }

  moveUp() {
    this.moveBoard(this.rotateLeft, this.rotateRight);
  }

  moveDown() {
    this.moveBoard(this.rotateRight, this.rotateLeft);
  }

  /**
   * Returns matrix with size === this.size filled with 0.
   */
  getEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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

  moveBoard(fnBeforeCompressing = undefined, fnAfterCompressing = undefined) {
    let updatedBoard = fnBeforeCompressing
      ? fnBeforeCompressing(this.state)
      : this.state;

    updatedBoard = this.compressBoard(updatedBoard);

    updatedBoard = fnAfterCompressing
      ? fnAfterCompressing(updatedBoard)
      : updatedBoard;

    if (JSON.stringify(updatedBoard) === JSON.stringify(this.state)) {
      return;
    }

    this.state = updatedBoard;

    this.updateScoreDisplay();
    this.addRandomTile();
    this.renderState();
    this.checkHasLost();
    this.checkHasWon();
  }

  compressBoard(board) {
    return board.map((row) => {
      const shiftedRow = [];
      const values = row.filter((item) => item > 0);

      for (let i = 0; i < values.length; i++) {
        const currValue = values[i];

        if (i === this.size - 1) {
          shiftedRow.push(currValue);
          continue;
        }

        const nextValue = values[i + 1];

        if (currValue === nextValue) {
          const multipliedValue = currValue * 2;

          shiftedRow.push(multipliedValue);
          this.score += multipliedValue;
          i++;
        } else {
          shiftedRow.push(currValue);
        }
      }

      const zerosNeeded = this.size - shiftedRow.length;

      return shiftedRow.concat(Array(zerosNeeded).fill(0));
    });
  }

  flipHorizontally(matrix) {
    return matrix.map((row) => {
      return row.map((value, index, arr) => {
        return arr[this.size - 1 - index];
      });
    });
  }

  rotateLeft(matrix) {
    const rotatedMatrix = Array.from({ length: this.size }, () => []);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        rotatedMatrix[this.size - 1 - j].push(matrix[i][j]);
      }
    }

    return rotatedMatrix;
  }

  rotateRight(matrix) {
    const rotatedMatrix = Array.from({ length: this.size }, () => []);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        rotatedMatrix[j].push(matrix[this.size - 1 - i][j]);
      }
    }

    return rotatedMatrix;
  }

  /**
   * @returns {boolean} True if at least one cell has value === 0.
   */
  hasEmptyCells() {
    const board = this.state;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (board[i][j] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * @returns {boolean} True if at least 2 neighbour cells have the same value.
   */
  hasAvailableMoves() {
    const board = this.state;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const hasSameRightNeighbour =
          j >= this.size - 1 ? false : board[i][j] === board[i][j + 1];
        const hasSameBottomNeighbour =
          i >= this.size - 1 ? false : board[i][j] === board[i + 1][j];

        if (hasSameRightNeighbour || hasSameBottomNeighbour) {
          return true;
        }
      }
    }

    return false;
  }

  checkHasLost() {
    if (!this.hasEmptyCells() && !this.hasAvailableMoves()) {
      this.status = 'lose';
      this.showMessage('.message-lose');

      return true;
    }

    return false;
  }

  checkHasWon() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'won';
      this.showMessage('.message-win');
    }
  }

  updateScoreDisplay() {
    document.querySelector('.game-score').innerHTML = this.score;
  }

  /**
   * Fills in the cells of the '.game-field' element
   * with the values of this.state that are not equal to 0.
   *
   * Assigns class `field-cell--${value}` to the not empty cells.
   *
   * @returns {void}
   */
  renderState() {
    const gameField = document.querySelector('.game-field');
    const rowsArray = [...gameField.querySelectorAll('.field-row')];
    const newState = this.state;
    const prevState = this._renderedState;

    rowsArray.forEach((row, rowIndex) => {
      [...row.cells].forEach((cell, cellIndex) => {
        const newCellValue = newState[rowIndex][cellIndex];
        const prevCellValue = prevState[rowIndex][cellIndex];

        if (newCellValue !== prevCellValue) {
          cell.classList.remove(cell.classList[1]);

          if (newCellValue) {
            cell.textContent = newCellValue;
            cell.classList.add(`field-cell--${newCellValue}`);
          } else {
            cell.textContent = '';
          }
        }
      });
    });

    this._renderedState = newState.map((row) => [...row]);
  }

  hideMessage(message) {
    if (!message.classList.contains('hidden')) {
      message.classList.add('hidden');
    }
  }

  showMessage(selector) {
    document.querySelector(selector).classList.remove('hidden');
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.renderState();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.getEmptyBoard();
    this.score = 0;
    this.updateScoreDisplay();
    this.start();

    document
      .querySelectorAll('.message-win, .message-lose')
      .forEach((message) => this.hideMessage(message));
  }

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
    if (!this.hasEmptyCells()) {
      return;
    }

    const emptyCells = this.getEmptyCellsCoordinates();
    const newTileValue = Math.floor(Math.random() * 10) > 8 ? 4 : 2;
    const newTileIndex = Math.floor(Math.random() * emptyCells.length);
    const [rowIndex, cellIndex] = emptyCells[newTileIndex];

    this.updateState(rowIndex, cellIndex, newTileValue);
  }

  /**
   * Sets this.state to the starting state (board with 2 random
   * tiles with values 2 or 4).
   *
   * If previous status is 'idle', also updates this.status, main
   * button classes and textContent, and hides start message.
   */
  handleMainButtonClicks(e) {
    const targetClasses = e.target.classList;

    switch (targetClasses[1]) {
      case 'start':
        this.start();
        targetClasses.replace('start', 'restart');
        e.target.textContent = 'Restart';

        const messageStart = document.querySelector('.message-start');

        this.hideMessage(messageStart);

        break;
      case 'restart':
        this.restart();
    }
  }
}

module.exports = Game;
