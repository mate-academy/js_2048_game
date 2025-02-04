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
  constructor(initialState = null) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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
    return this.board.map((row) => [...row]);
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
    this.board = this.createEmptyBoard();
    this.createEmptyBoard();
    this.createRandomTile();
    this.createRandomTile();
    this.score = 0;
    this.status = 'playing';
    this.printTiles();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createEmptyBoard();
    this.createRandomTile();
    this.createRandomTile();
    this.score = 0;
    this.status = 'playing';
    this.printTiles();
  }

  // Add your own methods here

  randomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  generateCellValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  printTiles() {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    this.board.forEach((row) => {
      row.forEach((cellValue) => {
        const cell = cells[index++];

        cell.textContent = cellValue !== 0 ? cellValue : '';
        cell.className = `field-cell ${cellValue ? 'field-cell--' + cellValue : ''}`;
      });
    });
  }

  createRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    this.board.forEach((row, rowIndex) => {
      // eslint-disable-next-line no-shadow
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, cellIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { rowIndex, cellIndex } =
      emptyCells[this.randomNumber(emptyCells.length - 1)];

    const newBoard = this.board.map((row) => row.slice());

    newBoard[rowIndex][cellIndex] = this.generateCellValue();
    this.board = newBoard;
    this.printTiles();
  }
}

module.exports = Game;
