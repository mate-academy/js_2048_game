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
    this.initialState = initialState;

    this.setInitialBoard();
    this._renderedState = this.getEmptyBoard();

    this.flipHorizontally = this.flipHorizontally.bind(this);
    this.rotateLeft = this.rotateLeft.bind(this);
    this.rotateRight = this.rotateRight.bind(this);
    this.cacheRenderedState = this.cacheRenderedState.bind(this);
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
   * Sets the board state to a copy of initialState or an empty board.
   * @returns {void}
   */
  setInitialBoard() {
    if (this.initialState) {
      this.state = this.initialState.map((row) => [...row]);
    } else {
      this.state = this.getEmptyBoard();
    }
  }

  /**
   * @returns {number[][]} Matrix with size === this.size filled with 0.
   */
  getEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  /**
   * @returns {number} Current score
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]} Current board state
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

  cacheRenderedState(newState) {
    this._renderedState = newState.map((row) => [...row]);
  }

  /**
   * Processes a move on the board.
   * The move is possible if at least one cell is changed after the move.
   *
   * Steps:
   * - Optionally applies a pre-compression transformation.
   * - Compresses the board (merges cells, shifts left, pads with zeros).
   * - Optionally applies a post-compression transformation.
   * - Aborts the move if no changes occurred.
   * - Otherwise, updates the board state, score, adds a random tile,
   *   re-renders the board, and checks win/loss.
   *
   * @param {function} [fnBeforeCompressing] - Function to transform the board
   * before compression.
   * @param {function} [fnAfterCompressing] - Function to transform the board
   * after compression.
   */
  moveBoard(fnBeforeCompressing = undefined, fnAfterCompressing = undefined) {
    if (!this.canMakeMove()) {
      return;
    }

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

    if (this.checkHasLost()) {
      this.status = 'lose';
      this.showMessage('.message-lose');
    } else if (this.checkHasWon()) {
      this.status = 'win';
      this.showMessage('.message-win');
    }
  }

  /**
   * Compresses the board to the left by merging and shifting cells.
   *
   * Compression logic:
   * - Merges adjacent equal cells into one cell with double the value.
   * - Prevents a cell from merging more than once per move.
   * - Increases the score by the sum of all merged cells.
   * - Shifts non-zero values to the left and pads with zeros
   *   so each row has a length of {@link this.size}.
   *
   * @param {number[][]} board - The current game board state
   * @returns {number[][]} The new board state after compressing
   */
  compressBoard(board) {
    return board.map((row) => {
      const shiftedRow = [];
      const values = [...row].filter((item) => item > 0);

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

  /**
   * @param {number[][]} matrix
   * @returns {number[][]} Copy of the matrix with each row reversed
   */
  flipHorizontally(matrix) {
    return matrix.map((row) => {
      return row.map((value, index, arr) => {
        return arr[this.size - 1 - index];
      });
    });
  }

  /**
   * @param {number[][]} matrix
   * @returns {number[][]} Copy of the matrix rotated counterwise
   */
  rotateLeft(matrix) {
    const rotatedMatrix = Array.from({ length: this.size }, () => []);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        rotatedMatrix[this.size - 1 - j].push(matrix[i][j]);
      }
    }

    return rotatedMatrix;
  }

  /**
   * @param {number[][]} matrix
   * @returns {number[][]} Copy of the matrix rotated clockwise
   */
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

    return board.some(
      (row) => Array.isArray(row) && row.some((cell) => cell === 0),
    );
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

  /**
   * If no more moves can be made, sets this.status to 'lose'
   * and displays 'message-lose'.
   *
   * @returns {bool} True is this.status === 'lose'
   */
  checkHasLost() {
    return !this.hasEmptyCells() && !this.hasAvailableMoves();
  }

  /**
   * If at least one cell contains 2048, sets this.status to 'win'
   * and displays 'message-win'.
   *
   * @returns {void}
   */
  checkHasWon() {
    return this.state.some((row) => row.includes(2048));
  }

  /**
   * Replaces the textContent of the '.game-score' element with this.score.
   *
   * @returns {void}
   */
  updateScoreDisplay() {
    const gameScoreElement = document.querySelector('.game-score');

    if (gameScoreElement) {
      gameScoreElement.textContent = this.score;
    }
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
    const rowsArray = [...document.querySelectorAll('.field-row')];
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

    if (newState) {
      this.cacheRenderedState(newState);
    }
  }

  /**
   * If the given element doesn't have 'hidden' class, adds it.
   *
   * @param {HTMLElement} messageElement
   * @returns {void}
   */
  hideMessage(messageElement) {
    if (
      messageElement.classList &&
      !messageElement.classList.contains('hidden')
    ) {
      messageElement.classList.add('hidden');
    }
  }

  /**
   * Finds message element by the given selector
   * and removes 'hidden' class from its classList.
   *
   * @param {string} selector
   * @returns {void}
   */
  showMessage(selector) {
    const messageElement = document.querySelector(selector);

    if (messageElement) {
      document.querySelector(selector).classList.remove('hidden');
    }
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
    this.status = 'idle';

    this.updateScoreDisplay();
    this.renderState();
    this.cacheRenderedState(this.state);

    document
      .querySelectorAll('.message-win, .message-lose')
      .forEach((message) => this.hideMessage(message));
    this.showMessage('.message-start');
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
   *
   * @returns {void}
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
        targetClasses.replace('restart', 'start');
        e.target.textContent = 'Start';
    }
  }
}

module.exports = Game;
