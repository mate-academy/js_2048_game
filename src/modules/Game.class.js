/* eslint-disable no-unused-vars */
/* eslint-disable function-paren-newline */
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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.cells = initialState;
    this.initialCells = initialState.map((row) => [...row]);
    this.isGameStarted = false;
    this.score = 0;
  }

  moveLeft() {
    const cellsCopy = this.cells.map((row) => [...row]);

    if (this.isGameStarted === true) {
      let mergers = 0;
      const MERGERS_LIMIT = 2;

      this.cells.forEach((row) => {
        for (let numIndex = 0; numIndex < row.length - 1; numIndex++) {
          if (row[numIndex] && row[numIndex] === row[numIndex + 1]) {
            [row[numIndex], row[numIndex + 1]] = [(row[numIndex] *= 2), 0];
            this.score += row[numIndex];
            mergers += 1;
          }
        }

        for (let numIndex = 1; numIndex < row.length; numIndex++) {
          for (let i = numIndex; i > 0; i--) {
            if (row[i - 1] === 0) {
              [row[i - 1], row[i]] = [row[i], row[i - 1]];

              continue;
            }

            if (row[i - 1] === row[i] && mergers < MERGERS_LIMIT) {
              [row[i - 1], row[i]] = [(row[i - 1] *= 2), 0];
              this.score += row[i - 1];
              mergers += 1;

              break;
            }
          }
        }
      });

      if (this.isBoardChanged(this.cells, cellsCopy) === true) {
        this.addStartingValue();
      }
    }
  }

  moveRight() {
    const cellsCopy = this.cells.map((row) => [...row]);

    if (this.isGameStarted === true) {
      let mergers = 0;
      const MERGERS_LIMIT = 2;

      this.cells.forEach((row) => {
        for (let numIndex = row.length - 1; numIndex > 0; numIndex--) {
          if (row[numIndex] && row[numIndex] === row[numIndex - 1]) {
            [row[numIndex], row[numIndex - 1]] = [(row[numIndex] *= 2), 0];
            this.score += row[numIndex];
            mergers += 1;
          }
        }

        for (let numIndex = row.length - 2; numIndex >= 0; numIndex--) {
          for (let i = numIndex; i < row.length - 1; i++) {
            if (row[i + 1] === 0) {
              [row[i + 1], row[i]] = [row[i], row[i + 1]];

              continue;
            }

            if (row[i + 1] === row[i] && mergers < MERGERS_LIMIT) {
              [row[i + 1], row[i]] = [(row[i + 1] *= 2), 0];
              this.score += row[i + 1];
              mergers += 1;

              break;
            }
          }
        }
      });

      if (this.isBoardChanged(this.cells, cellsCopy) === true) {
        this.addStartingValue();
      }
    }
  }

  moveUp() {
    const cells = this.cells;
    const cellsCopy = cells.map((row) => [...row]);

    if (this.isGameStarted === true) {
      for (let numIndex = 0; numIndex < cells[0].length; numIndex++) {
        let mergers = 0;
        const MERGERS_LIMIT = 2;

        cells.forEach((row, rowIndex) => {
          if (
            rowIndex < cells.length - 1 &&
            cells[rowIndex][numIndex] &&
            cells[rowIndex + 1][numIndex] === cells[rowIndex][numIndex]
          ) {
            cells[rowIndex][numIndex] *= 2;
            cells[rowIndex + 1][numIndex] = 0;
            this.score += cells[rowIndex][numIndex];
            mergers += 1;
          }
        });

        for (let rowIndex = 1; rowIndex < cells.length; rowIndex++) {
          for (let i = rowIndex; i > 0; i--) {
            if (cells[i - 1][numIndex] === 0) {
              cells[i - 1][numIndex] = cells[i][numIndex];
              cells[i][numIndex] = 0;

              continue;
            }

            if (
              cells[i - 1][numIndex] === cells[i][numIndex] &&
              mergers < MERGERS_LIMIT - 1
            ) {
              cells[i - 1][numIndex] *= 2;
              cells[i][numIndex] = 0;
              mergers += 1;
              this.score += cells[i - 1][numIndex];

              break;
            }
          }
        }
      }

      if (this.isBoardChanged(cells, cellsCopy) === true) {
        this.addStartingValue();
      }
    }
  }

  moveDown() {
    const cells = this.cells;
    const cellsCopy = cells.map((row) => [...row]);

    if (this.isGameStarted === true) {
      for (let numIndex = 0; numIndex < cells[0].length; numIndex++) {
        let mergers = 0;
        const MERGERS_LIMIT = 2;

        for (let i = cells.length - 1; i >= 0; i--) {
          if (
            i > 0 &&
            cells[i][numIndex] &&
            cells[i - 1][numIndex] === cells[i][numIndex]
          ) {
            cells[i][numIndex] *= 2;
            cells[i - 1][numIndex] = 0;
            this.score += cells[i][numIndex];
            mergers += 1;
          }
        }

        for (let rowIndex = cells.length - 2; rowIndex >= 0; rowIndex--) {
          for (let i = rowIndex; i < cells.length - 1; i++) {
            if (cells[i + 1][numIndex] === 0) {
              cells[i + 1][numIndex] = cells[i][numIndex];
              cells[i][numIndex] = 0;

              continue;
            }

            if (
              cells[i + 1][numIndex] === cells[i][numIndex] &&
              mergers < MERGERS_LIMIT - 1
            ) {
              cells[i + 1][numIndex] *= 2;
              cells[i][numIndex] = 0;
              this.score += cells[i + 1][numIndex];
              mergers += 1;

              break;
            }
          }
        }
      }

      if (this.isBoardChanged(cells, cellsCopy) === true) {
        this.addStartingValue();
      }
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
    return this.cells;
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
    const checker = this.cells.some((row, rowIndex) =>
      row.some((cell, cellIndex) => {
        if (
          (rowIndex < this.cells.length - 1 &&
            (cell === row[cellIndex + 1] ||
              cell === this.cells[rowIndex + 1][cellIndex])) ||
          (rowIndex === this.cells.length - 1 && cell === row[cellIndex + 1])
        ) {
          return true;
        }

        return false;
      }),
    );

    if (this.cells.some((row) => row.some((cell) => cell === 2048))) {
      return 'win';
    }

    if (
      this.cells.every((row) => row.every((cell) => cell !== 0)) &&
      checker === false
    ) {
      return 'lose';
    }

    if (this.isGameStarted === false) {
      return 'idle';
    }

    if (this.isGameStarted === true) {
      return 'playing';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    const firstStartRowIndex = this.getStartRow();
    const firstStartCellIndex = this.getStartCell(firstStartRowIndex);
    const secondStartRowIndex = this.getStartRow();
    const secondStartCellIndex = this.getStartCell(secondStartRowIndex);

    if (
      firstStartRowIndex === secondStartRowIndex &&
      firstStartCellIndex === secondStartCellIndex
    ) {
      return this.start();
    }

    const firstValue = this.getStartValue();
    const secondValue = this.getStartValue();

    this.cells[firstStartRowIndex][firstStartCellIndex] = firstValue;
    this.cells[secondStartRowIndex][secondStartCellIndex] = secondValue;

    this.isGameStarted = true;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.cells.forEach((row, rowIndex) =>
      row.forEach((cell, cellIndex) => {
        row[cellIndex] = this.initialCells[rowIndex][cellIndex];
      }),
    );

    this.isGameStarted = false;
    this.score = 0;
  }

  addStartingValue() {
    const rowIndex = this.getStartRow();
    const cellIndex = this.getStartCell(rowIndex);
    const value = this.getStartValue();

    this.cells[rowIndex][cellIndex] = value;
  }

  getStartRow() {
    const randomRowIndex = Math.floor(Math.random() * this.cells.length);

    if (this.cells[randomRowIndex].every((cell) => cell !== 0)) {
      return this.getStartRow();
    }

    return randomRowIndex;
  }

  getStartCell(rowIndex) {
    const randomCellIndex = Math.floor(
      Math.random() * this.cells[rowIndex].length,
    );

    if (this.cells[rowIndex][randomCellIndex] === 0) {
      return randomCellIndex;
    }

    return this.getStartCell(rowIndex);
  }

  getStartValue() {
    const num = Math.random();

    if (num <= 0.9) {
      return 2;
    }

    return 4;
  }

  isBoardChanged(array, arrayCopy) {
    return array.some((row, rowIndex) =>
      row.some((num, numIndex) => {
        return num !== arrayCopy[rowIndex][numIndex];
      }),
    );
  }
}

module.exports = Game;
