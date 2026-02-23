'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static #EMPTY_MATRIX = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
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
    this.initialState = initialState || Game.#EMPTY_MATRIX;
    this.board = initialState || Game.#EMPTY_MATRIX;
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const finalMatrix = this.#transformMatrix(this.board);

    const isChanged = this.#isMatrixChanged(finalMatrix);

    this.board = this.#putRandomNumber(1, finalMatrix, isChanged);

    this.#gameOver(this.board);

    return isChanged;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const reversedMatrix = this.#reverseMatrix(this.board);
    const transformedMatrix = this.#transformMatrix(reversedMatrix);
    const finalMatrix = this.#reverseMatrix(transformedMatrix);

    const isChanged = this.#isMatrixChanged(finalMatrix);

    this.board = this.#putRandomNumber(1, finalMatrix, isChanged);

    return isChanged;
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const trasposedMatrix = this.#transpose(this.board);
    const transformedMatrix = this.#transformMatrix(trasposedMatrix);
    const finalMatrix = this.#transpose(transformedMatrix);

    const isChanged = this.#isMatrixChanged(finalMatrix);

    this.board = this.#putRandomNumber(1, finalMatrix, isChanged);

    this.#gameOver(this.board);

    return isChanged;
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const trasposedMatrix = this.#transpose(this.board);
    const reversedMatrix = this.#reverseMatrix(trasposedMatrix);
    const transformedMatrix = this.#transformMatrix(reversedMatrix);
    const transformedReversedMatrix = this.#reverseMatrix(transformedMatrix);
    const finalMatrix = this.#transpose(transformedReversedMatrix);

    const isChanged = this.#isMatrixChanged(finalMatrix);

    this.board = this.#putRandomNumber(1, finalMatrix, isChanged);

    this.#gameOver(this.board);

    return isChanged;
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
    return this.board;
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
    this.board = this.initialState;
    this.status = 'playing';
    this.score = 0;
    
    const newMatrix = this.#putRandomNumber(2, this.board);

    this.board = newMatrix;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState;
    this.status = 'idle';
    this.score = 0;
  }

  #transformMatrix(matrix) {
    const newMatrix = [];
    const size = matrix.length;

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      const row = matrix[rowIndex];
      const movedLeft = this.#moveLeft(row);
      const merged = this.#merge(movedLeft);

      newMatrix.push(this.#moveLeft(merged));
    }

    return newMatrix;
  }

  #moveLeft(row) {
    const newRow = Array.from({ length: row.length }, () => 0);
    let arrayIndex = 0;

    for (let i = 0; i < row.length; i++) {
      if (row[i] === 0) {
        continue;
      }

      newRow[arrayIndex] = row[i];
      arrayIndex++;
    }

    return newRow;
  }

  #merge(row) {
    const newRow = [...row];

    for (let i = 1; i < newRow.length; i++) {
      if (newRow[i] === newRow[i - 1]) {
        const newNumber = newRow[i] * 2;

        newRow[i - 1] = newNumber;
        this.score += newNumber;
        newRow[i] = 0;

        if (newNumber === 2048) {
          this.status = 'win';
        }
      }
    }

    return newRow;
  }

  #transpose(matrix) {
    const size = matrix.length;
    const result = Array.from({ length: size }, () => Array(size).fill(0));

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      for (let columnIndex = 0; columnIndex < size; columnIndex++) {
        result[columnIndex][rowIndex] = matrix[rowIndex][columnIndex];
      }
    }

    return result;
  }

  #reverseMatrix(matrix) {
    return matrix.map((row) => [...row].reverse());
  }

  #isMatrixChanged(newMatrix) {
    const size = newMatrix.length;

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      for (let columnIndex = 0; columnIndex < size; columnIndex++) {
        if (
          newMatrix[rowIndex][columnIndex] !== this.board[rowIndex][columnIndex]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  #putRandomNumber(count = 1, matrix, isChanged = true) {
    if (!isChanged) {
      return matrix;
    }

    const matrixCopy = matrix.map((row) => [...row]);

    for (let i = 0; i < count; i++) {
      const cells = this.#getAllEmptyCells(matrixCopy);

      if (cells.length === 0) {
        return matrixCopy;
      }

      const number = this.#generateRamdomNumber();

      const index = Math.floor(Math.random() * cells.length);
      const cell = cells[index];

      matrixCopy[cell.row][cell.column] = number;
    }

    return matrixCopy;
  }

  #generateRamdomNumber() {
    const random = Math.random();

    return random < 0.9 ? 2 : 4;
  }

  #getAllEmptyCells(matrix) {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < matrix.length; columnIndex++) {
        if (matrix[rowIndex][columnIndex] === 0) {
          const coords = { row: rowIndex, column: columnIndex };

          emptyCells.push(coords);
        }
      }
    }

    return emptyCells;
  }

  #gameOver(matrix) {
    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < matrix.length; columnIndex++) {
        const current = matrix[rowIndex][columnIndex];

        if (current === 0) {
          return;
        }

        if (
          columnIndex + 1 < matrix.length &&
          current === matrix[rowIndex][columnIndex + 1]
        ) {
          return;
        }

        if (
          rowIndex + 1 < matrix.length &&
          current === matrix[rowIndex + 1][columnIndex]
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
