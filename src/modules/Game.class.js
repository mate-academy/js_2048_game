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
    this.initialTiles = this.getInitialTiles();

    this.setInitialBoard();
    this.renderInitialBoard();

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

  addScaleAnimation(element, initialSize = 1) {
    const animation = element.animate(
      [
        { transform: `scale(${initialSize})` },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' },
      ],
      {
        duration: 250,
        easing: 'ease-out',
      },
    );

    animation.addEventListener('finish', () => {
      animation.cancel();
    });
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
      ? fnBeforeCompressing(this.state)[0]
      : this.state;

    const results = this.compressBoard(updatedBoard);

    let movedTiles = results[1];

    updatedBoard = results[0];

    if (fnAfterCompressing) {
      [updatedBoard, movedTiles] = fnAfterCompressing(updatedBoard, movedTiles);
    }

    if (JSON.stringify(updatedBoard) === JSON.stringify(this.state)) {
      const cells = Array.from(document.querySelectorAll('.field-cell')).filter(
        (cell) => cell.textContent,
      );

      cells.forEach((cell) => {
        this.addScaleAnimation(cell);
      });

      return;
    }

    this.state = updatedBoard;

    this.updateScoreDisplay();
    this.addRandomTile();
    this.renderState(movedTiles);

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
    const movedTiles = [];
    const shiftedBoard = [];

    board.forEach((row, rowIndex) => {
      const shiftedRow = [];
      const movedRowTiles = [];
      const mergedIndexes = [];

      row.forEach((cellValue, cellIndex) => {
        if (cellValue !== 0) {
          if (cellIndex === 0) {
            shiftedRow.push(cellValue);
          } else {
            const prevIndex = shiftedRow.length - 1;
            const previousValue = shiftedRow[prevIndex];

            if (
              cellValue === previousValue &&
              !mergedIndexes.includes(prevIndex)
            ) {
              const multipliedValue = previousValue * 2;

              shiftedRow[prevIndex] = multipliedValue;
              this.score += multipliedValue;
              mergedIndexes.push(prevIndex);

              movedRowTiles.push({
                oldRowIndex: rowIndex,
                newRowIndex: rowIndex,
                oldCellIndex: cellIndex,
                newCellIndex: prevIndex,
                isMerged: true,
                oldCellValue: cellValue,
                cellValue: multipliedValue,
              });
            } else {
              shiftedRow.push(cellValue);

              if (shiftedRow.length < cellIndex + 1) {
                movedRowTiles.push({
                  oldRowIndex: rowIndex,
                  newRowIndex: rowIndex,
                  oldCellIndex: cellIndex,
                  newCellIndex: prevIndex + 1,
                  isMerged: false,
                  cellValue,
                });
              }
            }
          }
        }
      });

      movedTiles.push(...movedRowTiles);

      const zerosNeeded = this.size - shiftedRow.length;

      shiftedBoard.push(shiftedRow.concat(Array(zerosNeeded).fill(0)));
    });

    return [shiftedBoard, movedTiles];
  }

  /**
   * @param {number[][]} matrix
   * @returns {number[][]} Copy of the matrix with each row reversed
   */
  flipHorizontally(matrix, movedTiles = []) {
    const shiftedMovedTiles = movedTiles.map((tile) => {
      return {
        oldRowIndex: tile.oldRowIndex,
        newRowIndex: tile.newRowIndex,
        oldCellIndex: 3 - tile.oldCellIndex,
        newCellIndex: 3 - tile.newCellIndex,
        cellValue: tile.cellValue,
      };
    });

    const shiftedMatrix = matrix.map((row) => {
      return row.map((value, index, arr) => {
        return arr[this.size - 1 - index];
      });
    });

    return [shiftedMatrix, shiftedMovedTiles];
  }

  /**
   * @param {number[][]} matrix
   * @returns {number[][]} Copy of the matrix rotated counterwise
   */
  rotateLeft(matrix, movedTiles = []) {
    const rotatedMovedTiles = movedTiles.map((tile) => {
      return {
        oldRowIndex: 3 - tile.oldCellIndex,
        newRowIndex: 3 - tile.newCellIndex,
        oldCellIndex: tile.oldRowIndex,
        newCellIndex: tile.newRowIndex,
        cellValue: tile.cellValue,
        isMerged: tile.isMerged,
      };
    });

    const rotatedMatrix = Array.from({ length: this.size }, () => []);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        rotatedMatrix[this.size - 1 - j].push(matrix[i][j]);
      }
    }

    return [rotatedMatrix, rotatedMovedTiles];
  }

  /**
   * @param {number[][]} matrix
   * @returns {number[][]} Copy of the matrix rotated clockwise
   */
  rotateRight(matrix, movedTiles = []) {
    const rotatedMovedTiles = movedTiles.map((tile) => {
      return {
        oldRowIndex: tile.oldCellIndex,
        newRowIndex: tile.newCellIndex,
        oldCellIndex: 3 - tile.oldRowIndex,
        newCellIndex: 3 - tile.newRowIndex,
        cellValue: tile.cellValue,
      };
    });

    const rotatedMatrix = Array.from({ length: this.size }, () => []);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        rotatedMatrix[j].push(matrix[this.size - 1 - i][j]);
      }
    }

    return [rotatedMatrix, rotatedMovedTiles];
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
  renderState(movedTiles = []) {
    if (!movedTiles.length) {
      if (this.newTiles.length) {
        this.renderNewTiles();
      }
    } else {
      this.renderMovedTiles(movedTiles).then(() => {
        if (this.newTiles.length) {
          this.renderNewTiles();
        }
      });
    }
  }

  renderNewTiles() {
    const fieldRows = [...document.querySelectorAll('.field-row')];

    this.newTiles.forEach(({ rowIndex, cellIndex, cellValue }) => {
      if (fieldRows[rowIndex]?.cells[cellIndex]) {
        const newCell = fieldRows[rowIndex].cells[cellIndex];

        this.updateTableCell(newCell, cellValue);
        this.addScaleAnimation(newCell, 0);
      }
    });

    this.newTiles = [];
  }

  renderMovedTiles(movedTiles) {
    const fieldRows = [...document.querySelectorAll('.field-row')];

    const animationPromises = movedTiles.map(
      ({
        oldRowIndex,
        newRowIndex,
        oldCellIndex,
        newCellIndex,
        isMerged,
        cellValue,
      }) => {
        const oldTilePosition = fieldRows[oldRowIndex]?.cells[oldCellIndex];
        const newTilePosition = fieldRows[newRowIndex]?.cells[newCellIndex];

        if (oldTilePosition && newTilePosition) {
          const { left: startX, top: startY } =
            oldTilePosition.getBoundingClientRect();
          const { left: endX, top: endY } =
            newTilePosition.getBoundingClientRect();

          const floatingTile = oldTilePosition.cloneNode(true);

          floatingTile.style.setProperty('--translate-x', `${endX - startX}px`);
          floatingTile.style.setProperty('--translate-y', `${endY - startY}px`);

          Object.assign(floatingTile.style, {
            position: 'absolute',
            left: `${startX}px`,
            top: `${startY}px`,
            lineHeight: '75px',
            animation: 'tile-move 0.25s ease-out',
            zIndex: '1',
          });

          document.body.appendChild(floatingTile);
          this.updateTableCell(oldTilePosition, '');

          const cleanupTile = () => {
            this.updateRenderedBoard();

            if (floatingTile.parentNode) {
              floatingTile.remove();
            }
            this.updateTableCell(newTilePosition, cellValue);
            newTilePosition.removeAttribute('style');

            if (isMerged) {
              this.addScaleAnimation(newTilePosition);
            }
          };

          const fallbackTimeout = setTimeout(() => {
            cleanupTile();
          }, 250);

          return new Promise((resolve) => {
            floatingTile.addEventListener('animationend', () => {
              clearTimeout(fallbackTimeout);
              cleanupTile();
              resolve();
            });
          });
        }

        return Promise.resolve();
      },
    );

    return Promise.all(animationPromises);
  }

  updateTableCell(cellElement, value) {
    const cellValue = value || '';

    cellElement.textContent = cellValue;

    if (cellValue) {
      cellElement.className = `field-cell field-cell--${cellValue}`;
    } else {
      cellElement.className = 'field-cell';
    }
  }

  updateRenderedBoard() {
    const fieldRows = [...document.querySelectorAll('.field-row')];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cellValue, cellIndex) => {
        const cellElement = fieldRows[rowIndex]?.cells[cellIndex];
        const formattedCellValue = cellValue ? cellValue.toString() : '';

        if (cellElement && cellElement.textContent !== formattedCellValue) {
          this.updateTableCell(cellElement, cellValue);
        }
      });
    });
  }

  renderInitialBoard() {
    const table = document.querySelector('.game-field');
    const tBody = document.createElement('tbody');

    for (let i = 0; i < this.size; i++) {
      const tr = document.createElement('tr');

      tr.classList = 'field-row';

      for (let j = 0; j < this.size; j++) {
        const td = document.createElement('td');

        td.classList = 'field-cell';
        tr.appendChild(td);
      }

      tBody.appendChild(tr);
    }

    if (table) {
      table.innerHTML = '';
      table.appendChild(tBody);
    }

    this.newTiles = [...this.initialTiles];
    this.renderNewTiles();
  }

  getInitialTiles() {
    if (!this.initialState) {
      return [];
    }

    const initialTiles = [];

    this.initialState.forEach((row, rowIndex) => {
      row.forEach((cellValue, cellIndex) => {
        if (cellValue) {
          initialTiles.push({
            rowIndex: rowIndex,
            cellIndex: cellIndex,
            cellValue: cellValue,
          });
        }
      });
    });

    return initialTiles;
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
    this.newTiles = [];
    this.addRandomTile();
    this.addRandomTile();
    this.renderState();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';

    this.setInitialBoard();
    this.updateScoreDisplay();
    this.renderInitialBoard();

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

    const newTileCoordinates = emptyCells[newTileIndex];
    const [rowIndex, cellIndex] = newTileCoordinates;

    this.newTiles.push({
      rowIndex: rowIndex,
      cellIndex: cellIndex,
      cellValue: newTileValue,
    });

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
