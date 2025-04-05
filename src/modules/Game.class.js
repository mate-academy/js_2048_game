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
   * @param boardCells
   * DOM elements representing the game board cells.
   * @param scoreElement
   * @param startMessageElement
   * @param winMessageElement
   * @param loseMessageElement
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
    boardCells,
    scoreElement,
    startMessageElement,
    winMessageElement,
    loseMessageElement,
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.board = this.copyBoard(initialState);
    this.score = 0;
    this.status = 'idle';
    this.boardCells = boardCells;
    this.scoreElement = scoreElement;
    this.startMessageElement = startMessageElement;
    this.winMessageElement = winMessageElement;
    this.loseMessageElement = loseMessageElement;
    this.BOARD_SIZE = 4;
  }

  moveLeft() {
    return this.moveTiles((row) => row);
  }

  moveRight() {
    return this.moveTiles((row) => {
      const copyRow = row.slice();

      return copyRow.reverse();
    });
  }

  moveUp() {
    this.transposeBoard();

    const moved = this.moveLeft();

    this.transposeBoard();

    return moved;
  }

  moveDown() {
    this.transposeBoard();

    const moved = this.moveRight();

    this.transposeBoard();

    return moved;
  }

  moveTiles(getRow) {
    let moved = false;
    const newBoard = this.board.map((row, rowIndex) => {
      let currentRow = getRow(row, rowIndex);

      currentRow = this.mergeTiles(currentRow);
      currentRow = this.normalizeRowLength(currentRow);
      currentRow = this.slideTiles(currentRow);

      if (
        JSON.stringify(getRow(row, rowIndex)) !== JSON.stringify(currentRow)
      ) {
        moved = true;
      }

      return getRow([...currentRow], rowIndex);
    });

    if (moved) {
      this.board = newBoard;
      this.generateRandomTile();
      this.updateStatus();
    }
    this.updateScoreDisplay();

    return moved;
  }

  mergeTiles(row) {
    const newRow = [];
    let i = 0;

    while (i < row.length) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        const mergedValue = row[i] * 2;

        this.score += mergedValue;
        newRow.push(mergedValue);
        i += 2;
      } else {
        newRow.push(row[i]);
        i++;
      }
    }

    return newRow;
  }

  normalizeRowLength(row, targetLength = 4) {
    while (row.length < targetLength) {
      row.push(0);
    }

    return row;
  }

  slideTiles(row, targetLength = row.length) {
    const nonZeroTiles = row.filter((tile) => tile !== 0);
    const numberOfZeroTilesNeeded = targetLength - nonZeroTiles.length;

    return [...nonZeroTiles, ...Array(numberOfZeroTilesNeeded).fill(0)];
  }

  generateRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, colIndex } = emptyCells[randomIndex];

      this.board[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;
    }
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
    return this.copyBoard(this.board);
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
    this.generateRandomTile();
    this.generateRandomTile();
    this.hideElement(this.startMessageElement);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
    this.showElement(this.startMessageElement);
    this.hideElement(this.loseMessageElement);
  }

  updateStatus() {
    if (this.isGameWon()) {
      this.status = 'win';
      this.showElement(this.winMessageElement);
    } else if (this.isGameOver()) {
      this.status = 'lose';
      this.showElement(this.loseMessageElement);
    }
  }

  isGameWon() {
    return this.board.some((row) => row.includes(2048));
  }

  isGameOver() {
    return !this.board.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        if (cell === 0) {
          return true;
        }

        if (rowIndex > 0 && cell === this.board[rowIndex - 1][colIndex]) {
          return true;
        }

        if (rowIndex < 3 && cell === this.board[rowIndex + 1][colIndex]) {
          return true;
        }

        if (colIndex > 0 && cell === row[colIndex - 1]) {
          return true;
        }

        if (colIndex < 3 && cell === row[colIndex + 1]) {
          return true;
        }

        return false;
      });
    });
  }

  copyBoard(board) {
    return board.map((row) => [...row]);
  }

  transposeBoard() {
    const newBoard = [];

    for (let colIndex = 0; colIndex < this.BOARD_SIZE; colIndex++) {
      newBoard[colIndex] = [];

      for (let rowIndex = 0; rowIndex < this.BOARD_SIZE; rowIndex++) {
        newBoard[colIndex][rowIndex] = this.board[rowIndex][colIndex];
      }
    }
    this.board = newBoard;
  }

  renderBoard() {
    this.board.forEach((row, rowIndex) => {
      const rowElement = this.boardCells[rowIndex];

      if (!rowElement || !rowElement.classList.contains('field-row')) {
        return;
      }

      row.forEach((cellValue, cellIndex) => {
        const cellElement = rowElement.children[cellIndex];

        cellElement.textContent = cellValue !== 0 ? cellValue : '';
        cellElement.dataset.value = cellValue;
      });
    });
  }

  updateScoreDisplay() {
    if (!this.scoreElement) {
      return;
    }
    this.scoreElement.textContent = this.score;
  }

  hideElement(element) {
    if (!element || element.classList.contains('hidden')) {
      return;
    }
    element.classList.add('hidden');
  }

  showElement(element) {
    if (!element || !element.classList.contains('hidden')) {
      return;
    }
    element.classList.remove('hidden');
  }
}

module.exports = Game;
