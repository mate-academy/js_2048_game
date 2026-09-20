/* eslint-disable function-paren-newline */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  #initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  #state;
  #score = 0;
  #status = 'idle';

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
    // eslint-disable-next-line no-console
    console.log(initialState);

    if (initialState) {
      if (!Array.isArray(initialState) || initialState.length !== 4) {
        throw new Error('invalid initial state');
      }

      for (const row of initialState) {
        if (!Array.isArray(row) || row.length !== 4) {
          throw new Error('invalid initial state');
        }
      }

      this.#initialState = initialState;
    }

    this.#state = this.#initialState.map((row) => [...row]);
  }

  moveLeft() {
    this.#updateState(this.#reduceToLeft(this.#state));
  }
  moveRight() {
    this.#updateState(
      this.#inverse(this.#reduceToLeft(this.#inverse(this.#state))),
    );
  }
  moveUp() {
    this.#updateState(
      this.#transpose(this.#reduceToLeft(this.#transpose(this.#state))),
    );
  }
  moveDown() {
    this.#updateState(
      this.#transpose(
        this.#inverse(
          this.#reduceToLeft(this.#inverse(this.#transpose(this.#state))),
        ),
      ),
    );
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#state;
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#status = 'playing';
    this.#addCell(2);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#status = 'idle';
    this.#score = 0;
    this.#state = this.#initialState.map((row) => [...row]);
  }

  #updateState(newState) {
    if (this.getStatus() !== 'playing') {
      return;
    }

    if (!this.#areEqualMatrices(this.#state, newState)) {
      this.#state = newState;
      this.#addCell();
    }

    const transposedMatrix = this.#transpose(this.#state);

    if (this.#state.some((row) => row.some((value) => value === 2048))) {
      this.#status = 'win';
    }

    if (
      this.#state.every((row) => row.every((value) => value !== 0)) &&
      this.#areEqualMatrices(this.#reduceToLeft(this.#state), this.#state) &&
      this.#areEqualMatrices(
        this.#reduceToLeft(transposedMatrix),
        transposedMatrix,
      )
    ) {
      this.#status = 'lose';
    }
  }

  #reduceToLeft(matrix, addScore = true) {
    return matrix.map((row) => {
      const newRow = row.filter((value) => value !== 0);
      let i = 0;

      if (newRow.length !== 0) {
        while (i < newRow.length - 1) {
          if (newRow[i] !== 0 && newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;

            if (addScore && this.getStatus() === 'playing') {
              this.#score += newRow[i];
            }

            newRow.splice(i + 1, 1);
          }

          i++;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      return newRow;
    });
  }

  #addCell(count = 1) {
    const emptyCells = [];

    this.#state.forEach((row, rowIndex) => {
      row.forEach((cellValue, columnIndex) => {
        if (cellValue === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    for (let i = 0; i < count; i++) {
      const randomCellIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomCellIndex];
      const newValue = Math.random() <= 0.1 ? 4 : 2;

      this.#state[randomCell[0]][randomCell[1]] = newValue;

      emptyCells.splice(randomCellIndex, 1);
    }
  }

  #transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  #inverse(matrix) {
    return matrix.map((row) => [...row].reverse());
  }

  #areEqualMatrices(matrix1, matrix2) {
    return matrix1.every((row, rowIndex) =>
      row.every((item, colIndex) => item === matrix2[rowIndex][colIndex]),
    );
  }
}

module.exports = Game;
