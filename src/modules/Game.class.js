'use strict';
/* eslint-disable function-paren-newline */
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
    this.gameBoard = initialState;
    this.gameScore = 0;
    this.gameStatus = 'idle';
  }

  /* eslint-disable no-shadow */
  addNewTile() {
    const emptyCells = [];

    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        if (this.gameBoard[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.gameBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
  /* eslint-disable no-shadow */

  renderGameBoard(board) {
    const rows = document.querySelectorAll('.field-row');

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('.field-cell');

      cells.forEach((cell, cellIndex) => {
        const value = board[rowIndex][cellIndex];

        cell.textContent = value === 0 ? '' : value;
        cell.className = 'field-cell';

        if (value !== 0) {
          cell.classList.add(`field-cell--${value}`);
        }
      });
    });
  }

  slideLeft(row) {
    let newRow = row.filter((num) => num !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        this.gameScore += newRow[i];
      }
    }

    newRow = newRow.filter((num) => num !== 0);

    while (newRow.length < this.gameBoard.length) {
      newRow.push(0);
    }

    return newRow;
  }

  moveLeft() {
    const oldGameBoard = JSON.stringify(this.gameBoard);
    const newGameBoard = this.gameBoard.map((row) => this.slideLeft(row));

    if (JSON.stringify(newGameBoard) !== oldGameBoard) {
      this.gameBoard = newGameBoard;
      this.addNewTile();
    }
    this.renderGameBoard(newGameBoard);
    this.getStatus();
  }

  moveRight() {
    const oldGameBoard = JSON.stringify(this.gameBoard);
    const newGameBoard = this.gameBoard.map((row) =>
      this.slideLeft([...row].reverse()).reverse(),
    );

    if (JSON.stringify(newGameBoard) !== oldGameBoard) {
      this.gameBoard = newGameBoard;
      this.addNewTile();
    }
    this.renderGameBoard(newGameBoard);
    this.getStatus();
  }

  matrixTranspose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  moveUp() {
    const oldGameBoard = JSON.stringify(this.gameBoard);
    let transposed = this.matrixTranspose(this.gameBoard);

    transposed = transposed.map((row) => this.slideLeft(row));

    const newGameBoard = this.matrixTranspose(transposed);

    if (JSON.stringify(newGameBoard) !== oldGameBoard) {
      this.gameBoard = newGameBoard;
      this.addNewTile();
    }
    this.renderGameBoard(newGameBoard);
    this.getStatus();
  }

  moveDown() {
    const oldGameBoard = JSON.stringify(this.gameBoard);
    let transposed = this.matrixTranspose(this.gameBoard);

    transposed = transposed.map((row) =>
      this.slideLeft([...row].reverse()).reverse(),
    );

    const newGameBoard = this.matrixTranspose(transposed);

    if (JSON.stringify(newGameBoard) !== oldGameBoard) {
      this.gameBoard = newGameBoard;
      this.addNewTile();
    }
    this.renderGameBoard(newGameBoard);
    this.getStatus();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.gameScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.gameBoard;
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
    let canMerge = false;
    let hasEmpty = false;

    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        const currentCell = this.gameBoard[i][j];

        if (currentCell === 2048) {
          this.gameStatus = 'win';

          return;
        }

        if (currentCell === 0) {
          hasEmpty = true;
        }

        if (
          j < this.gameBoard.length - 1 &&
          currentCell === this.gameBoard[i][j + 1]
        ) {
          canMerge = true;
        }

        if (
          i < this.gameBoard.length - 1 &&
          currentCell === this.gameBoard[i + 1][j]
        ) {
          canMerge = true;
        }
      }
    }

    if (hasEmpty || canMerge) {
      this.gameStatus = 'playing';
    } else {
      this.gameStatus = 'lose';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.gameStatus = 'playing';
    this.addNewTile();
    this.addNewTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.gameScore = 0;
    this.gameStatus = 'idle';

    this.gameBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
}

module.exports = Game;
